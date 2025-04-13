import { useState } from 'react';
import './App.css';
import RegisterFile from './components/RegisterFile';
import MemoryView from './components/MemoryView';
import PipelineStages from './components/PipelineStages';
import CodeView from './components/CodeView';
import SimulationControls, { useSimulator, SimulatorProvider } from './components/SimulationControls';
import FileUploader from './components/FileUploader';
import LogOutput from './components/LogOutput';

// This component will use the simulator context
function AppContent() {
  // Get simulator state from context
  const simulator = useSimulator();
  
  const [log, setLog] = useState('RISC-V Simulator initialized');

  // Load text.mc file
  const loadTextMC = (content) => {
    try {
      const lines = content.split('\n');
      const newCode = [];
      
      lines.forEach(line => {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) return;
        
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const address = parseInt(parts[0], 16);
          const instruction = parseInt(parts[1], 16);
          newCode.push({ addr: address, instr: instruction });
        }
      });
      
      // Here we would update the simulator state via context
      // For now, just log it
      setLog(prev => prev + '\nText.mc file loaded successfully.');
    } catch (error) {
      setLog(prev => prev + '\nError loading text.mc: ' + error.message);
    }
  };

  // Load data.mc file
  const loadDataMC = (content) => {
    try {
      const lines = content.split('\n');
      const newMemory = [];
      
      lines.forEach(line => {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) return;
        
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const address = parseInt(parts[0], 16);
          const value = parseInt(parts[1], 16);
          newMemory.push({ addr: address, value: value });
        }
      });
      
      // Here we would update the simulator state via context
      // For now, just log it
      setLog(prev => prev + '\nData.mc file loaded successfully.');
    } catch (error) {
      setLog(prev => prev + '\nError loading data.mc: ' + error.message);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>RISC-V Simulator</h1>
      </header>
      
      <div className="upload-section">
        <FileUploader onTextFileLoad={loadTextMC} onDataFileLoad={loadDataMC} />
        <SimulationControls 
          onStep={simulator.stepSimulation} 
          onRun={simulator.toggleSimulation} 
          onStop={simulator.toggleSimulation} 
          onReset={simulator.resetSimulation}
          isRunning={simulator.running}
        />
        <div className="cycle-counter">
          Cycle: {simulator.clock_cycles}
        </div>
      </div>
      
      <div className="main-content">
        <div className="left-panel">
          <CodeView code={simulator.code} pc={simulator.pc} />
          <RegisterFile registers={simulator.reg_file} />
        </div>
        
        <div className="center-panel">
          <PipelineStages pipelineState={simulator.pipeline_stages} />
        </div>
        
        <div className="right-panel">
          <MemoryView memory={simulator.memory} />
          <LogOutput log={log} />
        </div>
      </div>
    </div>
  );
}

// The main App component that wraps the content with the provider
function App() {
  return (
    <SimulatorProvider>
      <AppContent />
    </SimulatorProvider>
  );
}

export default App;