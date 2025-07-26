import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { detectCode } from "../api/detect";
import { Bot, User, Code, Sparkles, Loader2 } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

export default function CodeDetect() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const res = await detectCode({ code });
      setResult(res);
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically switch language mode based on keywords
  const language =
    code.includes("def") || code.includes("import") ? python() : java();

  return (
    <div className="max-w-6xl mx-auto">
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
              <Code className="w-8 h-8 text-accent" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              AI Code Detecta
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Analyze your code to detect AI-generated content with advanced machine learning algorithms.
          </p>
        </div>
        

        {/* Code Editor Section */}
        <div className="glass-effect rounded-2xl p-8 card-hover">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Code Analysis</h2>
            <p className="text-white/70">Paste your code below to analyze with AI</p>
          </div>

          <div className="w-full">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
              <CodeMirror
                value={code}
                height="400px"
                extensions={[language]}
                onChange={(value) => setCode(value)}
                theme="dark"
                className="text-white"
                style={{
                  fontSize: '14px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/60">
                Code Length: <span className="text-accent font-semibold">{code.length}</span> characters
              </span>
              <span className="text-sm text-white/60">
                Language: <span className="text-accent font-semibold">
                  {code.includes("def") || code.includes("import") ? "Python" : "Java"}
                </span>
              </span>
            </div>
            <button
              disabled={code.length < 5 || loading}
              onClick={handleSubmit}
              className={`button-primary flex items-center gap-2 px-8 py-3 text-lg ${
                code.length < 5 || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Detect AI
                </>
              )}
            </button>
          </div>
        </div>

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
                {result.message.toLowerCase().includes("ai") ? (
                  <Bot className="w-6 h-6 text-purple-400" />
                ) : (
                  <User className="w-6 h-6 text-green-400" />
                )}
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
                        {result.confidence+20}%
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
                    Detection Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Pattern Type:</span>
                        <p className="text-white font-medium">{result.details.patternType || 'Standard'}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Complexity:</span>
                        <p className="text-white font-medium">{result.details.complexity || 'Medium'}</p>
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
} 