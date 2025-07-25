import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
          Welcome to AI-Detecta
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
          Detect AI-generated content in audio, video, images, and code with
          state-of-the-art models.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/audio"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition duration-200 transform hover:scale-105"
          >
            🎧 Audio Detection
          </Link>
          <Link
            to="/video"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition duration-200 transform hover:scale-105"
          >
            🎥 Video Detection
          </Link>
          <Link
            to="/image"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition duration-200 transform hover:scale-105"
          >
            🖼️ Image Detection
          </Link>
          <Link
            to="/code"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition duration-200 transform hover:scale-105"
          >
            💻 Code Detection
          </Link>
        </div>
      </div>
    </div>
  );
}
