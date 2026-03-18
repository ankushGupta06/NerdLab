import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, UserPlus, AlertCircle, CheckCircle2, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ✅ added
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showToast = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const res = await API.post(endpoint, { 
        email, 
        password,
        ...(isSignup && { username }), // ✅ only send on signup
      });

      if (!isSignup) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username); // ✅ save username
        navigate("/questions");
      } else {
        showToast("Account created successfully! Please login.", "success");
        setIsSignup(false);
        setPassword("");
        setUsername(""); // ✅ clear username on signup success
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "Authentication failed";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      
      {/* Animated Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>

      {/* Toast Notification */}
      {notification.message && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-right duration-300 ${
          notification.type === 'error' 
          ? "bg-slate-900 border-rose-500/50 text-rose-400" 
          : "bg-slate-900 border-emerald-500/50 text-emerald-400"
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-[#1e293b]/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isSignup ? "Join NerdLab" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSignup ? "Create your account to start solving" : "Login to continue your coding journey"}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleAuth}>
          <div className="space-y-4">

            {/* Username Field - only on signup */}
            {isSignup && (
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    required={isSignup}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    placeholder="codenerd123"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                  placeholder="codenerd@lab.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Processing..." : (
              <>
                {isSignup ? "Create Account" : "Sign In"} 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="pt-6 border-t border-slate-800 text-center">
          <button 
            onClick={() => {
              setIsSignup(!isSignup);
              setNotification({ message: "", type: "" });
              setUsername(""); // ✅ clear username when toggling
            }}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            {isSignup ? (
              <><ShieldCheck size={16} /> Already have an account? <span className="text-indigo-400 font-bold">Login</span></>
            ) : (
              <><UserPlus size={16} /> Need an account? <span className="text-indigo-400 font-bold">Sign up</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}