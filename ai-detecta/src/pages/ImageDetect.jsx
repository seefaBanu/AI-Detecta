import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  Scan,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { detectImage } from "../api/detect";

const ImageDetect = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    } else {
      setError("Please select a valid image file");
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
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await detectImage(formData);
      setResult(response);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error("Detection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
              <Camera className="w-8 h-8 text-accent" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              AI-Image Detecta
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Upload a image to analyze with artificial intelligence and detect
            AI-generated content.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="glass-effect rounded-2xl p-8 card-hover">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Upload Image</h2>
            <p className="text-white/70">Select an image to analyze with AI</p>
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
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />

            {file ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="max-w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetImage();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-white/70">{file.name}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-accent mx-auto" />
                <div>
                  <p className="text-lg font-semibold mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-white/60">
                    Supports JPG, PNG, GIF up to 10MB
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
              <ImageIcon className="w-5 h-5" />
              Choose File
            </button>
            <button
              onClick={() => {
                // Simulate camera access
                openFileDialog();
              }}
              className="button-secondary flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Camera
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
        {file && (
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
                  Detecting...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Detect Image
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
                    {result.label}
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
                        {result.label === "REAL"
                          ? result.prob_real
                          : result.prob_fake}
                        %
                      </span>
                    </div>
                    <div className="confidence-bar">
                      <motion.div
                        className="confidence-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            result.label === "REAL"
                              ? result.prob_real
                              : result.prob_fake
                          }%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {result.details && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-3">
                      Additional Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Category:</span>
                        <p className="text-white font-medium">
                          {result.details.category}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Subcategory:</span>
                        <p className="text-white font-medium">
                          {result.details.subcategory}
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

export default ImageDetect;
