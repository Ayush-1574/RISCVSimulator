import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const SimulatorContext = createContext();

// Provider component
export function SimulatorProvider({ children }) {
  const [simulatorState, setSimulatorState] = useState({
    pc: 0x00000000,
    ir: 0x00000000,
    clock_cycles: 0,
    reg_file: Array(32).fill(0).map((_, i) => {
      if (i === 2) return 0x7FFFFFDC;  // Stack pointer
      if (i === 3) return 0x10000000;  // Link register
      if (i === 10) return 0x00000001;
      if (i === 11) return 0x07FFFFDC;
      return 0;
    }),
    memory: [
      { addr: 0x10000000, value: 0x00000001 },
      { addr: 0x10000004, value: 0x00000002 },
      { addr: 0x10000008, value: 0x00000003 },
    ],
    code: [
      { addr: 0x00000000, instr: 0x00A00513 },  // addi x10, x0, 10
      { addr: 0x00000004, instr: 0x00B00593 },  // addi x11, x0, 11
      { addr: 0x00000008, instr: 0x00B50633 },  // add x12, x10, x11
      { addr: 0x0000000C, instr: 0x00C62023 },  // sw x12, 0(x12)
      { addr: 0x00000010, instr: 0x0000A703 },  // lw x14, 0(x1)
      { addr: 0x00000014, instr: 0x00C6A023 },  // sw x12, 0(x13)
      { addr: 0x00000018, instr: 0x00058067 },  // jalr x0, 0(x11)
      { addr: 0x0000001C, instr: 0xFF0000EF },  // jal x1, -16
      { addr: 0x00000020, instr: 0xFE9FF06F },  // j -24
      { addr: 0x00000024, instr: 0x00B51463 },  // bne x10, x11, 8
      { addr: 0x00000028, instr: 0x00052483 },  // lw x9, 0(x10)
      { addr: 0x0000002C, instr: 0xFFF00513 },  // addi x10, x0, -1
    ],
    pipeline_stages: {
      fetch: { active: true, instruction: "addi x10, x0, 10", pc: 0x00000000, ir: 0x00A00513 },
      decode: { active: true, rs1: 0, rs2: 0, rd: 10, imm: 10, ctrl: { reg_write: true, use_imm: true } },
      execute: { active: true, alu_op: "ADD", result: 10, branch_taken: false },
      memory: { active: false, address: 0, data: 0, read: false, write: false },
      writeback: { active: true, rd: 10, value: 10 }
    },
    running: false
  });
  
  const [executionSpeed, setExecutionSpeed] = useState(1000); // ms per cycle
  
  // Function to step the simulation forward one cycle
  const stepSimulation = () => {
    setSimulatorState(prevState => {
      const newPC = (prevState.pc + 4) % (prevState.code.length * 4);
      
      // Find the current instruction
      const currentInstrIdx = prevState.code.findIndex(item => item.addr === prevState.pc);
      const currentInstr = currentInstrIdx >= 0 ? prevState.code[currentInstrIdx].instr : 0;
      
      return {
        ...prevState,
        pc: newPC,
        ir: currentInstr,
        clock_cycles: prevState.clock_cycles + 1,
        // Add a simple register modification to see changes
        reg_file: prevState.reg_file.map((val, idx) => 
          idx === 10 ? val + 1 : val
        )
      };
    });
  };
  
  // Function to start/stop continuous simulation
  const toggleSimulation = () => {
    setSimulatorState(prevState => ({
      ...prevState,
      running: !prevState.running
    }));
  };
  
  // Function to reset simulation
  const resetSimulation = () => {
    setSimulatorState(prevState => ({
      ...prevState,
      pc: 0x00000000,
      ir: 0x00000000,
      clock_cycles: 0,
      running: false,
      reg_file: Array(32).fill(0).map((_, i) => {
        if (i === 2) return 0x7FFFFFDC;  // Stack pointer
        if (i === 3) return 0x10000000;  // Link register
        if (i === 10) return 0x00000001;
        if (i === 11) return 0x07FFFFDC;
        return 0;
      })
    }));
  };
  
  // Effect for continuous simulation
  useEffect(() => {
    let timer = null;
    
    if (simulatorState.running) {
      timer = setInterval(stepSimulation, executionSpeed);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simulatorState.running, executionSpeed]);
  
  const value = {
    ...simulatorState,
    stepSimulation,
    toggleSimulation,
    resetSimulation,
    executionSpeed,
    setExecutionSpeed
  };
  
  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}

// Hook to use the simulator context
export function useSimulator() {
  return useContext(SimulatorContext);
}

// The actual SimulationControls component
function SimulationControls({ onStep, onRun, onStop, onReset, isRunning }) {
  const simulator = useSimulator();
  
  return (
    <div className="simulation-controls">
      <button 
        onClick={onStep}
        disabled={isRunning}
      >
        Step
      </button>
      
      <button 
        onClick={isRunning ? onStop : onRun}
      >
        {isRunning ? "Stop" : "Run"}
      </button>
      
      <button 
        onClick={onReset}
        disabled={isRunning}
      >
        Reset
      </button>
      
      <div className="speed-control">
        <label>Speed:</label>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          step="100"
          value={simulator.executionSpeed}
          onChange={(e) => simulator.setExecutionSpeed(parseInt(e.target.value))}
          disabled={isRunning}
        />
        <span>{simulator.executionSpeed}ms</span>
      </div>
    </div>
  );
}

export default SimulationControls;