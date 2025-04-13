import React from 'react';

const PipelineStages = ({ pipelineState }) => {
  const { fetch, decode, execute, memory, writeback } = pipelineState;
  
  // Helper to format values as hex
  const formatHex = (value) => {
    if (value === undefined || value === null) return "N/A";
    return "0x" + value.toString(16).padStart(8, '0').toUpperCase();
  };

  return (
    <div className="pipeline-stages">
      <h2>Pipeline Stages</h2>
      
      <div className="pipeline-flow">
        <div className="stage fetch">
          <h3>Fetch</h3>
          <div className="stage-content">
            <div className="stage-row">
              <span>PC:</span>
              <span>{formatHex(fetch.pc)}</span>
            </div>
            <div className="stage-row">
              <span>IR:</span>
              <span>{formatHex(fetch.ir)}</span>
            </div>
          </div>
        </div>
        
        <div className="pipeline-arrow">→</div>
        
        <div className="stage decode">
          <h3>Decode</h3>
          <div className="stage-content">
            <div className="stage-row">
              <span>Opcode:</span>
              <span>{formatHex(decode.opcode)}</span>
            </div>
            <div className="stage-row">
              <span>RS1:</span>
              <span>x{decode.rs1}</span>
            </div>
            <div className="stage-row">
              <span>RS2:</span>
              <span>x{decode.rs2}</span>
            </div>
            <div className="stage-row">
              <span>RD:</span>
              <span>x{decode.rd}</span>
            </div>
            <div className="stage-row">
              <span>Imm:</span>
              <span>{formatHex(decode.imm)}</span>
            </div>
            <div className="stage-row">
              <span>Op:</span>
              <span>{decode.operation || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <div className="pipeline-arrow">→</div>
        
        <div className="stage execute">
          <h3>Execute</h3>
          <div className="stage-content">
            <div className="stage-row">
              <span>ALU Op:</span>
              <span>{execute.aluOp || "N/A"}</span>
            </div>
            <div className="stage-row">
              <span>Result:</span>
              <span>{formatHex(execute.result)}</span>
            </div>
            {execute.branchTaken !== undefined && (
              <div className="stage-row">
                <span>Branch:</span>
                <span>{execute.branchTaken ? "Taken" : "Not Taken"}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pipeline-arrow">→</div>
        
        <div className="stage memory-access">
          <h3>Memory</h3>
          <div className="stage-content">
            {memory.isRead || memory.isWrite ? (
              <>
                <div className="stage-row">
                  <span>Type:</span>
                  <span>{memory.isRead ? "Read" : "Write"}</span>
                </div>
                <div className="stage-row">
                  <span>Address:</span>
                  <span>{formatHex(memory.address)}</span>
                </div>
                <div className="stage-row">
                  <span>Value:</span>
                  <span>{formatHex(memory.value)}</span>
                </div>
              </>
            ) : (
              <div className="stage-row">
                <span>No memory operation</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pipeline-arrow">→</div>
        
        <div className="stage writeback">
          <h3>Writeback</h3>
          <div className="stage-content">
            {writeback.written ? (
              <>
                <div className="stage-row">
                  <span>Register:</span>
                  <span>x{writeback.rd}</span>
                </div>
                <div className="stage-row">
                  <span>Value:</span>
                  <span>{formatHex(writeback.value)}</span>
                </div>
              </>
            ) : (
              <div className="stage-row">
                <span>No writeback</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .pipeline-stages {
          padding: 15px;
          background-color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        h2 {
          margin-top: 0;
          border-bottom: 1px solid #444;
          padding-bottom: 10px;
        }
        
        .pipeline-flow {
          display: flex;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        
        .stage {
          min-width: 150px;
          padding: 10px;
          background-color: #2a2a2a;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
          color: #64b5f6;
          text-align: center;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
        }
        
        .pipeline-arrow {
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 24px;
          color: #888;
        }
        
        .stage-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .stage-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        
        .stage-row span:first-child {
          color: #aaa;
        }
        
        .stage-row span:last-child {
          font-family: monospace;
        }
        
        @media (prefers-color-scheme: light) {
          .pipeline-stages {
            background-color: #f0f0f0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          h2 {
            border-bottom: 1px solid #ddd;
          }
          
          .stage {
            background-color: #e0e0e0;
          }
          
          h3 {
            color: #1976d2;
            border-bottom: 1px solid #ccc;
          }
          
          .pipeline-arrow {
            color: #666;
          }
          
          .stage-row span:first-child {
            color: #666;
          }
        }
      `}</style>
    </div>
  );
};

export default PipelineStages;