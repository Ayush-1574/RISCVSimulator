import React from 'react';

function MemoryView({ memory }) {
  // Helper to format memory addresses and values as hex
  const formatHex = (value) => {
    if (value === undefined || value === null) {
      return "0x00000000";
    }
    return "0x" + value.toString(16).padStart(8, '0').toUpperCase();
  };

  // Group memory entries for display
  const getDisplayRows = () => {
    if (!memory || !Array.isArray(memory)) {
      // Return empty array if memory is undefined or not an array
      return [];
    }
    
    // Sort memory by address
    const sortedMemory = [...memory].sort((a, b) => {
      if (!a || !b || a.addr === undefined || b.addr === undefined) {
        return 0;
      }
      return a.addr - b.addr;
    });
    
    // Group into chunks of 4 for display
    const rows = [];
    let i = 0;
    
    while (i < sortedMemory.length) {
      // Get next 4 memory locations or fewer if at end
      const rowItems = sortedMemory.slice(i, i + 4);
      rows.push(rowItems);
      i += 4;
    }
    
    return rows;
  };

  const memoryRows = getDisplayRows();

  return (
    <div className="memory-view">
      <h3>Memory View</h3>
      {memoryRows.length === 0 ? (
        <div className="no-memory">No memory data available</div>
      ) : (
        <div className="memory-grid">
          {memoryRows.map((row, rowIndex) => (
            <div key={rowIndex} className="memory-row">
              {row.map((item, colIndex) => (
                <div key={colIndex} className="memory-cell">
                  <div className="memory-address">{item && item.addr !== undefined ? formatHex(item.addr) : "N/A"}</div>
                  <div className="memory-value">{item && item.value !== undefined ? formatHex(item.value) : "N/A"}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemoryView;