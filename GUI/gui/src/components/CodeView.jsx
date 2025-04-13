import { useState, useEffect } from 'react';

const CodeView = ({ code, pc }) => {
  const [hoveredLine, setHoveredLine] = useState(null);
  
  // Function to format an instruction address as hex
  const formatAddress = (addr) => {
    return "0x" + addr.toString(16).padStart(8, '0').toUpperCase();
  };
  
  // Function to format an instruction as hex
  const formatInstruction = (instr) => {
    return "0x" + instr.toString(16).padStart(8, '0').toUpperCase();
  };
  
  // Function to get the mnemonic for an instruction (basic implementation)
  const getMnemonic = (instruction) => {
    const opcode = instruction & 0x7F;
    const funct3 = (instruction >> 12) & 0x7;
    const funct7 = (instruction >> 25) & 0x7F;
    const rd = (instruction >> 7) & 0x1F;
    const rs1 = (instruction >> 15) & 0x1F;
    const rs2 = (instruction >> 20) & 0x1F;
    
    // This is a simplified decoder - you'd want to expand this based on your instruction set
    switch(opcode) {
      case 0x33: // R-type
        if (funct3 === 0x0 && funct7 === 0x00) return `add x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x0 && funct7 === 0x20) return `sub x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x7 && funct7 === 0x00) return `and x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x6 && funct7 === 0x00) return `or x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x4 && funct7 === 0x00) return `xor x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x1 && funct7 === 0x00) return `sll x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x2 && funct7 === 0x00) return `slt x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x5 && funct7 === 0x00) return `srl x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x5 && funct7 === 0x20) return `sra x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x0 && funct7 === 0x01) return `mul x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x4 && funct7 === 0x01) return `div x${rd}, x${rs1}, x${rs2}`;
        if (funct3 === 0x6 && funct7 === 0x01) return `rem x${rd}, x${rs1}, x${rs2}`;
        break;
      case 0x13: // I-type
        const imm_i = instruction >> 20;
        if (funct3 === 0x0) return `addi x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x7) return `andi x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x6) return `ori x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x4) return `xori x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x2) return `slti x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x3) return `sltiu x${rd}, x${rs1}, ${imm_i}`;
        if (funct3 === 0x1 && funct7 === 0x00) return `slli x${rd}, x${rs1}, ${imm_i & 0x1F}`;
        if (funct3 === 0x5 && funct7 === 0x00) return `srli x${rd}, x${rs1}, ${imm_i & 0x1F}`;
        if (funct3 === 0x5 && funct7 === 0x20) return `srai x${rd}, x${rs1}, ${imm_i & 0x1F}`;
        break;
      case 0x03: // Load instructions
        const load_imm = instruction >> 20;
        if (funct3 === 0x0) return `lb x${rd}, ${load_imm}(x${rs1})`;
        if (funct3 === 0x1) return `lh x${rd}, ${load_imm}(x${rs1})`;
        if (funct3 === 0x2) return `lw x${rd}, ${load_imm}(x${rs1})`;
        if (funct3 === 0x3) return `ld x${rd}, ${load_imm}(x${rs1})`;
        if (funct3 === 0x4) return `lbu x${rd}, ${load_imm}(x${rs1})`;
        if (funct3 === 0x5) return `lhu x${rd}, ${load_imm}(x${rs1})`;
        break;
      case 0x23: // S-type (store)
        const imm_s = ((instruction >> 25) << 5) | ((instruction >> 7) & 0x1F);
        if (funct3 === 0x0) return `sb x${rs2}, ${imm_s}(x${rs1})`;
        if (funct3 === 0x1) return `sh x${rs2}, ${imm_s}(x${rs1})`;
        if (funct3 === 0x2) return `sw x${rs2}, ${imm_s}(x${rs1})`;
        if (funct3 === 0x3) return `sd x${rs2}, ${imm_s}(x${rs1})`;
        break;
      case 0x63: // B-type (branch)
        const imm_b = ((instruction >> 31) << 12) | 
                      (((instruction >> 7) & 0x1) << 11) | 
                      (((instruction >> 25) & 0x3F) << 5) | 
                      (((instruction >> 8) & 0xF) << 1);
        if (funct3 === 0x0) return `beq x${rs1}, x${rs2}, ${imm_b}`;
        if (funct3 === 0x1) return `bne x${rs1}, x${rs2}, ${imm_b}`;
        if (funct3 === 0x4) return `blt x${rs1}, x${rs2}, ${imm_b}`;
        if (funct3 === 0x5) return `bge x${rs1}, x${rs2}, ${imm_b}`;
        break;
      case 0x37: // U-type (lui)
        const imm_u = instruction & 0xFFFFF000;
        return `lui x${rd}, ${imm_u >>> 12}`;
      case 0x17: // U-type (auipc)
        const imm_auipc = instruction & 0xFFFFF000;
        return `auipc x${rd}, ${imm_auipc >>> 12}`;
      case 0x6F: // J-type (jal)
        const imm_j = ((instruction >> 31) << 20) | 
                      (((instruction >> 12) & 0xFF) << 12) |
                      (((instruction >> 20) & 0x1) << 11) | 
                      (((instruction >> 21) & 0x3FF) << 1);
        return `jal x${rd}, ${imm_j}`;
      case 0x67: // I-type (jalr)
        const jalr_imm = instruction >> 20;
        return `jalr x${rd}, ${jalr_imm}(x${rs1})`;
      case 0xFF: // EXIT (custom)
        return `EXIT`;
      default:
        return `Unknown instruction: ${formatInstruction(instruction)}`;
    }
    return `Unknown instruction: ${formatInstruction(instruction)}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Instruction Memory</h2>
      <div className="font-mono">
        <div className="grid grid-cols-12 gap-4 text-sm mb-2 text-gray-400">
          <div className="col-span-3">Address</div>
          <div className="col-span-3">Machine Code</div>
          <div className="col-span-6">Instruction</div>
        </div>
        <div className="space-y-1">
          {code.map((item, index) => {
            const isCurrentPC = item.addr === pc;
            return (
              <div 
                key={index}
                className={`grid grid-cols-12 gap-4 text-sm py-1 px-2 rounded ${
                  isCurrentPC ? 'bg-blue-800 text-white' : 
                  hoveredLine === index ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoveredLine(index)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                <div className="col-span-3">{formatAddress(item.addr)}</div>
                <div className="col-span-3">{formatInstruction(item.instr)}</div>
                <div className="col-span-6">{getMnemonic(item.instr)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeView;