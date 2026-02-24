import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/api";
import {
  ChevronLeft,
  Play,
  Terminal,
  BookOpen,
  Code,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const fallbackTemplates = {
  python: `# Write your Python code here\nprint("Hello NerdLab")`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello NerdLab";\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello NerdLab");\n    }\n}`,
};

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isRunning, setIsRunning] = useState(false);

  // States for the Judge Response
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (!question) return;

    try {
      if (question.starterCode) {
        const parsed = JSON.parse(question.starterCode);
        setCode(parsed[language] || fallbackTemplates[language]);
      } else {
        setCode(fallbackTemplates[language]);
      }
    } catch (err) {
      console.error("Starter code parse error:", err);
      setCode(fallbackTemplates[language]);
    }
  }, [language, question]);

  const fetchQuestion = async () => {
    try {
      const res = await API.get(`/questions/${id}`);
      const q = res.data.question;
      setQuestion(q);

      if (q?.starterCode) {
        const parsed = JSON.parse(q.starterCode);
        setCode(parsed["python"] || fallbackTemplates["python"]);
      } else {
        setCode(fallbackTemplates["python"]);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Failed to load question.");
    }
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setError("");
      setTestResults(null);

      const res = await API.post(`/run/${id}`, {
        code,
        language,
      });

      setTestResults(res.data);
    } catch (error) {
      console.error("Run Error:", error);

      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Execution Failed";

      setError(backendMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    try {
      setIsRunning(true);
      setError("");
      setTestResults(null);

      const res = await API.post(`/submit/${id}`, {
        code,
        language,
      });

      // Only verdict info
      setTestResults({
        passed: res.data.passed,
        total: res.data.total,
        results: [],
        verdict: res.data.verdict,
      });
    } catch (error) {
      console.error("Submit Error:", error);

      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Submission Failed";

      setError(backendMessage);
    } finally {
      setIsRunning(false);
    }
  };

  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-mono animate-pulse">
        Loading NerdLab workspace...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-slate-300">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-[#1e293b]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/questions")}
            className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1"></div>
          <h1 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Code size={16} className="text-indigo-400" />
            {question.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="python">Python 3</option>
            <option value="cpp">C++ 17</option>
            <option value="java">Java 17</option>
          </select>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            {isRunning ? (
              "Running..."
            ) : (
              <>
                <Play size={14} fill="currentColor" /> Run
              </>
            )}
          </button>
          <button
            onClick={submitCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-[40%] flex flex-col border-r border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
            <BookOpen size={14} /> Description
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <h2 className="text-2xl font-bold text-white mb-4">
              {question.title}
            </h2>
            <div className="flex gap-2 mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                {question.difficulty}
              </span>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs border border-slate-700">
                Topic: {question.topic}
              </span>
            </div>
            <div className="prose prose-invert prose-slate">
              <p className="text-slate-400 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                {question.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Editor + Output */}
        <div className="w-[60%] flex flex-col bg-[#1e293b]">
          <div className="flex-1 relative border-b border-slate-800">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 15,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
                lineNumbers: "on",
                cursorSmoothCaretAnimation: "on",
              }}
            />
          </div>

          {/* Output Console */}
          {/* Output Console */}
          <div className="h-1/3 bg-[#020617] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0f172a]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Terminal size={14} /> Result
              </div>

              {testResults && (
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                    testResults.passed === testResults.total
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {testResults.passed === testResults.total ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}

                  {testResults.verdict
                    ? `${testResults.verdict} (${testResults.passed}/${testResults.total})`
                    : `Passed: ${testResults.passed} / ${testResults.total}`}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar font-mono">
              {/* Loading State */}
              {isRunning && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-indigo-400 text-sm">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  Judging test cases...
                </div>
              )}

              {/* Error State */}
              {!isRunning && error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                  <div className="text-rose-400 font-bold text-xs uppercase mb-1 tracking-widest">
                    Runtime Error
                  </div>
                  <pre className="text-rose-300 text-sm whitespace-pre-wrap bg-black/20 p-3 rounded-lg mt-2">
                    {error}
                  </pre>
                </div>
              )}

              {/* Run Mode — Show Test Case Details */}
              {!isRunning &&
                testResults &&
                testResults.results &&
                testResults.results.length > 0 && (
                  <div className="space-y-3">
                    {testResults.results.map((test, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700"
                      >
                        {/* Case Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/20">
                          <div className="flex items-center gap-3">
                            {test.passed ? (
                              <CheckCircle2
                                size={16}
                                className="text-emerald-500"
                              />
                            ) : (
                              <XCircle size={16} className="text-rose-500" />
                            )}
                            <span
                              className={`text-sm font-bold tracking-tight ${
                                test.passed
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              Case {idx + 1}
                            </span>
                          </div>

                          {test.hidden && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 uppercase">
                              Hidden
                            </span>
                          )}
                        </div>

                        {/* Visible Test Case Details */}
                        {!test.hidden ? (
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
                            <div>
                              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                                Input
                              </div>
                              <div className="bg-black/40 p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap">
                                {test.input || "n/a"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                                Expected
                              </div>
                              <div className="bg-black/40 p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap">
                                {test.expected}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                                Actual
                              </div>
                              <div
                                className={`bg-black/40 p-2 rounded border border-slate-800 whitespace-pre-wrap ${
                                  test.passed
                                    ? "text-emerald-400"
                                    : "text-rose-400 font-bold"
                                }`}
                              >
                                {test.output}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-[11px] text-slate-500 italic bg-slate-900/20">
                            Inputs/Outputs hidden to prevent hard-coding.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {/* Submit Mode — No Test Case Details */}
              {!isRunning &&
                testResults &&
                (!testResults.results || testResults.results.length === 0) && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                    {testResults.passed === testResults.total ? (
                      <div className="text-emerald-400 text-lg font-bold">
                        🎉 Accepted! All test cases passed.
                      </div>
                    ) : (
                      <div className="text-rose-400 text-lg font-bold">
                        ❌ Wrong Answer.
                      </div>
                    )}
                  </div>
                )}

              {/* Default Empty State */}
              {!isRunning && !testResults && !error && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm">
                  <Terminal size={32} className="mb-2 opacity-10" />
                  Run your code to evaluate against test cases.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
