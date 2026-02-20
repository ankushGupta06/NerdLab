import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/api";
import { ChevronLeft, Play, Terminal, BookOpen, Code } from "lucide-react";

const fallbackTemplates = {
  python: `# Write your Python code here
print("Hello NerdLab")`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello NerdLab";
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello NerdLab");
    }
}`,
};

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Fetch question when page loads or id changes
  useEffect(() => {
    fetchQuestion();
  }, [id]);

  // Update editor code when language changes (use DB starterCode)
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

      // Initialize editor with python starter from DB (or fallback)
      if (q?.starterCode) {
        const parsed = JSON.parse(q.starterCode);
        setCode(parsed["python"] || fallbackTemplates["python"]);
      } else {
        setCode(fallbackTemplates["python"]);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setOutput("Failed to load question.");
    }
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput("Running hidden test cases...");

      const res = await API.post(`/judge/${id}`, {
        code,
        language,
      });

      setOutput(
        `Passed: ${res.data.passed}/${res.data.total}\nVerdict: ${res.data.verdict}`
      );
    } catch (error) {
      console.error("Judge Error:", error);

      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Execution Failed";

      setOutput(`Error:\n${backendMessage}`);
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
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-[40%] flex flex-col border-r border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
            <BookOpen size={14} /> Description
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <h2 className="text-2xl font-bold text-white mb-4">
              {question.title}
            </h2>

            {/* Dynamic Difficulty & Topic */}
            <div className="flex gap-2 mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                {question.difficulty}
              </span>

              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs border border-slate-700">
                Topic: {question.topic}
              </span>
            </div>

            <div className="prose prose-invert prose-slate">
              <p className="text-slate-400 leading-relaxed text-sm lg:text-base">
                {question.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Editor + Output */}
        <div className="w-[60%] flex flex-col bg-[#1e293b]">
          {/* Code Editor */}
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
          <div className="h-1/3 bg-[#020617] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 bg-[#0f172a]">
              <Terminal size={14} /> Output
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              {output ? (
                <pre
                  className={`whitespace-pre-wrap ${
                    output.includes("Error")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {output}
                </pre>
              ) : (
                <span className="text-slate-600 italic">
                  No output yet. Click 'Run' to evaluate hidden test cases.
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
