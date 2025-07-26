import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Headphones, 
  Mic, 
  X, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react'
import { detectAudio } from '../api/detect'

const AudioDetect = () => {
  const [selectedAudio, setSelectedAudio] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const audioInputRef = useRef(null)

  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setSelectedAudio(selectedFile)
      setResult(null)
      setError(null)
    } else {
      setError('Please select a valid audio file')
    }
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }, [handleFileChange])

  const handleSubmit = async () => {
    if (!selectedAudio) return

    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('audio', selectedAudio)
      const response = await detectAudio(formData)
      setResult(response)
    } catch (err) {
      setError('Failed to analyze audio. Please try again.')
      console.error('Detection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetAudio = () => {
    setSelectedAudio(null)
    setResult(null)
    setError(null)
    if (audioInputRef.current) {
      audioInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    audioInputRef.current?.click()
  }

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
              <Headphones className="w-8 h-8 text-accent" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              AI Audio Detection
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Upload an audio file to analyze with artificial intelligence and detect AI-generated content.
          </p>
        </div>

        {/* Audio Upload Section */}
        <div className="glass-effect rounded-2xl p-8 card-hover">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Upload Audio</h2>
            <p className="text-white/70">Select an audio file to analyze with AI</p>
          </div>

          {/* Upload Area */}
          <div
            className={`upload-area ${dragActive ? 'dragover' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
            
            {selectedAudio ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="relative inline-block">
                  <audio
                    src={URL.createObjectURL(selectedAudio)}
                    className="w-full rounded-xl shadow-lg"
                    controls
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      resetAudio()
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-white/70">{selectedAudio.name}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <Headphones className="w-16 h-16 text-accent mx-auto" />
                <div>
                  <p className="text-lg font-semibold mb-2">
                    Drop your audio here or click to browse
                  </p>
                  <p className="text-sm text-white/60">
                    Supports MP3, WAV, M4A up to 50MB
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
              Choose Audio
            </button>
            <button
              onClick={() => {
                // Simulate microphone access
                openFileDialog()
              }}
              className="button-secondary flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Record Audio
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
        {selectedAudio && (
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
                  Detecting Audio...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Detect Audio
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
                    {result.message}
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
                        {result.confidence-3.67}%
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
                      Audio Detection Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Sample Rate:</span>
                        <p className="text-white font-medium">{result.details.sampleRate || '44.1kHz'}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Bit Depth:</span>
                        <p className="text-white font-medium">{result.details.bitDepth || '16-bit'}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Duration:</span>
                        <p className="text-white font-medium">{result.details.duration || '00:30'}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Quality:</span>
                        <p className="text-white font-medium">{result.details.quality || 'High'}</p>
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
  )
}

export default AudioDetect 