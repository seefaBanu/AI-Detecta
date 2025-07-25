import { useState } from "react";
import { detectVideo } from "../api/detect";

export default function VideoDetect() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);
    const res = await detectVideo(formData);
    setResult(res);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Video AI Detection</h1>

      <label className="block mb-2 font-medium">Upload a video file:</label>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
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
