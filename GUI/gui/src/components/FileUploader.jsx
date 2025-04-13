import React, { useState } from 'react';

const FileUploader = ({ onTextMcUpload, onDataMcUpload }) => {
  const [textFile, setTextFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleTextFileChange = (e) => {
    if (e.target.files[0]) {
      setTextFile(e.target.files[0]);
      setUploadStatus('Text file selected: ' + e.target.files[0].name);
    }
  };

  const handleDataFileChange = (e) => {
    if (e.target.files[0]) {
      setDataFile(e.target.files[0]);
      setUploadStatus('Data file selected: ' + e.target.files[0].name);
    }
  };

  const handleUpload = () => {
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          onTextMcUpload(e.target.result);
          setUploadStatus('Text file uploaded successfully');
        } catch (error) {
          setUploadStatus('Error parsing text file: ' + error.message);
        }
      };
      reader.readAsText(textFile);
    }

    if (dataFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          onDataMcUpload(e.target.result);
          setUploadStatus('Data file uploaded successfully');
        } catch (error) {
          setUploadStatus('Error parsing data file: ' + error.message);
        }
      };
      reader.readAsText(dataFile);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">File Uploader</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          text.mc file:
        </label>
        <div className="flex items-center">
          <input
            type="file"
            accept=".mc,.txt"
            onChange={handleTextFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          data.mc file:
        </label>
        <div className="flex items-center">
          <input
            type="file"
            accept=".mc,.txt"
            onChange={handleDataFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!textFile && !dataFile}
        className="px-4 py-2 bg-blue-600 text-white rounded-md
                  hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Upload Files
      </button>
      
      {uploadStatus && (
        <div className="mt-3 text-sm text-gray-600">
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default FileUploader;