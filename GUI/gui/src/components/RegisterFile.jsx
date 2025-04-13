import React from 'react';

function RegisterFile({ registers }) {
  // Helper to format register values as hex
  const formatHex = (value) => {
    if (value === undefined || value === null) return "0x00000000";
    return "0x" + value.toString(16).padStart(8, '0').toUpperCase();
  };

  // Helper to get register names
  const getRegName = (index) => {
    const abiNames = [
      "zero", "ra", "sp", "gp", "tp", "t0", "t1", "t2",
      "s0/fp", "s1", "a0", "a1", "a2", "a3", "a4", "a5",
      "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7",
      "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"
    ];
    return `x${index} (${abiNames[index]})`;
  };

  return (
    <div className="register-file">
      <h3>Register File</h3>
      <div className="register-grid">
        {registers && registers.map((value, index) => (
          <div key={index} className="register-item">
            <span className="register-name">{getRegName(index)}</span>
            <span className="register-value">{formatHex(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegisterFile;