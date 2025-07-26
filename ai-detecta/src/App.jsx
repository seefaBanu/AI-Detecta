import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./pages/Home";
import AudioDetect from "./pages/AudioDetect";
import VideoDetect from "./pages/VideoDetect";
import ImageDetect from "./pages/ImageDetect";
import CodeDetect from "./pages/CodeDetect";
import './index.css'; // ✅ No styles object, not CSS module
import { motion } from 'framer-motion';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoDetect />} />
            <Route path="/audio" element={<AudioDetect />} />
            <Route path="/image" element={<ImageDetect />} />
            <Route path="/code" element={<CodeDetect />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App; 