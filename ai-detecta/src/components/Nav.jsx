import { Link } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container flex justify-between items-center">
        <div className="font-bold text-xl">AI-Detecta</div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-400">Home</Link>
          <Link to="/audio" className="hover:text-green-400">Audio</Link>
          <Link to="/video" className="hover:text-green-400">Video</Link>
          <Link to="/image" className="hover:text-green-400">Image</Link>
          <Link to="/code" className="hover:text-green-400">Code</Link>
        </div>
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          <Link to="/" className="hover:text-green-400 py-2" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/audio" className="hover:text-green-400 py-2" onClick={() => setIsOpen(false)}>Audio</Link>
          <Link to="/video" className="hover:text-green-400 py-2" onClick={() => setIsOpen(false)}>Video</Link>
          <Link to="/image" className="hover:text-green-400 py-2" onClick={() => setIsOpen(false)}>Image</Link>
          <Link to="/code" className="hover:text-green-400 py-2" onClick={() => setIsOpen(false)}>Code</Link>
        </div>
      )}
    </nav>
  );
}