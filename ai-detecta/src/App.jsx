import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./pages/Home";
import AudioDetect from "./pages/AudioDetect";
import VideoDetect from "./pages/VideoDetect";
import ImageDetect from "./pages/ImageDetect";
import CodeDetect from "./pages/CodeDetect";
import './index.css'; // ✅ No styles object, not CSS module

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container py-6 p-40">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audio" element={<AudioDetect />} />
          <Route path="/video" element={<VideoDetect />} />
          <Route path="/image" element={<ImageDetect />} />
          <Route path="/code" element={<CodeDetect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;