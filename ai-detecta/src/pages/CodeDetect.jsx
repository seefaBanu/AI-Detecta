import { useState } from "react";
import { detectCode } from "../api/detect";
import { Bot, User } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

export default function CodeDetect() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    const res = await detectCode({ code });
    setResult(res);
  };

  // Optional: Dynamically switch language mode based on keywords
  const language =
    code.includes("def") || code.includes("import") ? python() : java();

  return (
    <div className="container py-8">
      <div className="card">
        <h1 className="text-6xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          AI Code Detecta
        </h1>

        <div className="flex flex-col items-center max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow">
          <div className="w-full">
            <CodeMirror
              value={code}
              height="300px"
              extensions={[language]}
              onChange={(value) => setCode(value)}
              theme="light"
              className="rounded-xl border border-blue-300 "
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Code Length: {code.length} characters
            </span>
            <button
              disabled={code.length < 5}
              className={`p-4 rounded-3xl text-white text-lg transition 
      ${
        code.length < 5
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
              onClick={handleSubmit}
            >
              Detect
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col items-center bg-blue-900 rounded-xl shadow-lg p-6 max-w-5xl mx-auto my-10 animate-fade-in">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-semibold text-white">
                {result.message}
              </h2>
              {result.message.toLowerCase().includes("ai") ? (
                <Bot className="w-12 h-12 text-purple-400 animate-bounce" />
              ) : (
                <User className="w-12 h-12 text-green-400 animate-pulse" />
              )}
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Confidence on the results:
            </p>
            <div className="bg-gray-100 text-gray-700 rounded-lg px-6 py-4 text-3xl font-bold shadow-inner">
              {result.confidence}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
