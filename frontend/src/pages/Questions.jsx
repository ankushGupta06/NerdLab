import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { LogOut, Code2, ChevronRight, Search, LayoutGrid } from "lucide-react";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/questions");
      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Helper for difficulty colors
  const getDifficultyStyles = (diff) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (d === 'hard') return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Medium
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 flex flex-col">

      <main className="max-w-6xl mx-auto w-full p-6 md:p-10">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Challenge Lab</h2>
            <p className="text-slate-500">Solve problems and level up your coding skills.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-200"
            />
          </div>
        </div>

        {/* Questions Grid/List */}
        <div className="grid gap-4">
          {questions.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <LayoutGrid size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500">No questions found in the lab.</p>
            </div>
          ) : (
            questions
              .filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((q) => (
              <div
                key={q.id}
                onClick={() => navigate(`/questions/${q.id}`)}
                className="group bg-[#1e293b] border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 hover:bg-[#243147] cursor-pointer transition-all duration-300 shadow-sm flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {q.title}
                    </h3>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getDifficultyStyles(q.difficulty || 'Medium')}`}>
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-1">
                    {q.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Success Rate</span>
                    <span className="text-sm font-mono text-slate-300">82.4%</span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-xl group-hover:bg-indigo-600 transition-colors">
                    <ChevronRight size={20} className="text-slate-500 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}