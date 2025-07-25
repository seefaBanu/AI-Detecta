import { useState } from "react";
import { detectImage } from "../api/detect";

export default function ImageDetect() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const res = await detectImage(formData);
    setResult(res);
  };

  return (
    <div className="container py-8">
      <div className="card">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Image AI Detection
        </h1>

        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Upload an image file:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="input-field mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:hover:bg-green-700"
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Detect
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Result:</strong> {result.message}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Confidence:</strong> {result.confidence}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
