import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Video,
  Play,
  X,
  Scan,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { detectVideo } from "../api/detect";

const VideoDetect = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const videoInputRef = useRef(null);

  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setSelectedVideo(selectedFile);
      setResult(null);
      setError(null);
    } else {
      setError("Please select a valid video file");
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleSubmit = async () => {
    if (!selectedVideo) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", selectedVideo);
      const response = await detectVideo(formData);
      setResult(response);
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
      console.error("Detection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetVideo = () => {
    setSelectedVideo(null);
    setResult(null);
    setError(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    videoInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Video className="w-8 h-8 text-accent" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              AI-Video Detecta
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Upload a video to analyze with artificial intelligence and detect
            AI-generated content.
          </p>
        </div>

        {/* Video Upload Section */}
        <div className="glass-effect rounded-2xl p-8 card-hover">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Upload Video</h2>
            <p className="text-white/70">
              Select a video file to analyze with AI
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`upload-area ${dragActive ? "dragover" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />

            {selectedVideo ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="relative inline-block">
                  <video
                    src={URL.createObjectURL(selectedVideo)}
                    className="max-w-full h-64 object-cover rounded-xl shadow-lg"
                    controls
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetVideo();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-white/70">{selectedVideo.name}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <Video className="w-16 h-16 text-accent mx-auto" />
                <div>
                  <p className="text-lg font-semibold mb-2">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-sm text-white/60">
                    Supports MP4, AVI, MOV up to 100MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={openFileDialog}
              className="button-secondary flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Choose Video
            </button>
            <button
              onClick={() => {
                // Simulate camera access
                openFileDialog();
              }}
              className="button-secondary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Record Video
            </button>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-effect rounded-xl p-4 border border-red-400/30"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="button-primary flex items-center gap-3 mx-auto text-lg px-8 py-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Detecting Video...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Detect Video
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-effect rounded-2xl p-8 card-hover"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold">Detection Complete</h3>
              </div>

              <div className="space-y-6">
                {/* Detection Result */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">
                    Detection Result
                  </h4>
                  <p className="text-lg font-semibold text-white">
                    {result.prediction}
                  </p>
                </div>

                {/* Confidence Level */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-3">
                    Confidence Level
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80">Accuracy</span>
                      <span className="text-accent font-semibold">
                        {result.confidence}%
                      </span>
                    </div>
                    <div className="confidence-bar">
                      <motion.div
                        className="confidence-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {result.details && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-3">
                      Video Analysis Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Frame Rate:</span>
                        <p className="text-white font-medium">
                          {result.details.frameRate || "30fps"}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Resolution:</span>
                        <p className="text-white font-medium">
                          {result.details.resolution || "1920x1080"}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Duration:</span>
                        <p className="text-white font-medium">
                          {result.details.duration || "00:30"}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Quality:</span>
                        <p className="text-white font-medium">
                          {result.details.quality || "High"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VideoDetect;
