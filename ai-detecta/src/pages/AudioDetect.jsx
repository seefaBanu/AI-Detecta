import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { detectAudio } from "../api/detect";

export default function AudioDetect() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("audio", file);
    const res = await detectAudio(formData);
    setResult(res);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audio AI Detection</h1>
      <div
        {...getRootProps()}
        className={`border-dashed border-2 p-6 rounded text-center ${
          isDragActive ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & drop an audio file here, or click to select</p>
        )}
      </div>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Detect
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Result:</strong> {result.message}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}
