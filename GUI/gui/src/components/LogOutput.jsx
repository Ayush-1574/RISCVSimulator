import React, { useRef, useEffect } from 'react';

const LogOutput = ({ logs }) => {
  const logEndRef = useRef(null);
  
  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Format logs with color highlighting
  const formatLog = (log) => {
    if (log.includes('--- Fetch Stage')) {
      return <span className="text-blue-600">{log}</span>;
    } else if (log.includes('--- Decode Stage')) {
      return <span className="text-green-600">{log}</span>;
    } else if (log.includes('--- Execute Stage')) {
      return <span className="text-yellow-600">{log}</span>;
    } else if (log.includes('--- Memory Access Stage')) {
      return <span className="text-purple-600">{log}</span>;
    } else if (log.includes('--- Writeback Stage')) {
      return <span className="text-red-600">{log}</span>;
    } else if (log.includes('Error:')) {
      return <span className="text-red-500 font-bold">{log}</span>;
    } else if (log.includes('Warning:')) {
      return <span className="text-orange-500">{log}</span>;
    } else if (log.includes('===== Cycle')) {
      return <span className="text-indigo-700 font-bold">{log}</span>;
    } else {
      return log;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Simulation Log</h3>
      <div className="bg-gray-100 p-3 rounded-md h-96 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">No logs to display. Start simulation to see output.</div>
        ) : (
          <div>
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap mb-1">
                {formatLog(log)}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between">
        <button
          onClick={() => navigator.clipboard.writeText(logs.join('\n'))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
        >
          Copy to Clipboard
        </button>
        
        <div className="text-sm text-gray-500">
          {logs.length} log entries
        </div>
      </div>
    </div>
  );
};

export default LogOutput;