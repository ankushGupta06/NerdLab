import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import {
  User,
  Code2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   STAT CARD 
───────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, accent, icon: Icon }) => (
  <div
    className={`relative overflow-hidden bg-[#1e293b] border ${accent.border} rounded-2xl p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-200`}
  >
    <div
      className={`absolute -top-6 -right-6 w-20 h-20 ${accent.glow} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}
    />
    <div
      className={`${accent.icon} w-9 h-9 rounded-xl flex items-center justify-center`}
    >
      <Icon size={18} className={accent.text} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   DIFFICULTY BADGE 
───────────────────────────────────────────────────────────── */
const DiffBadge = ({ difficulty }) => {
  const map = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
        map[difficulty] || map["Medium"]
      }`}
    >
      {difficulty}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUBMISSION ROW 
───────────────────────────────────────────────────────────── */
const SubmissionRow = ({ sub }) => {
  const accepted = sub.status === "Accepted";
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors last:border-0">
      <div className="flex items-center gap-3">
        {accepted ? (
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        ) : (
          <XCircle size={16} className="text-rose-400 shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {sub.question?.title || "Unknown Problem"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {sub.question?.difficulty && (
              <DiffBadge difficulty={sub.question.difficulty} />
            )}
            <span className="text-[11px] text-slate-500 font-mono">
              {sub.language}
            </span>
          </div>
        </div>
      </div>
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full border ${
          accepted
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }`}
      >
        {sub.status}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SOLVED PROGRESS BAR 
───────────────────────────────────────────────────────────── */
const SolvedBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-400 w-14">{label}</span>
      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-300 w-6 text-right">
        {count}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LOADING SKELETON 
───────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse space-y-6">
    <div className="h-36 bg-slate-800 rounded-2xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-800 rounded-2xl" />
      ))}
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="h-48 bg-slate-800 rounded-2xl" />
      <div className="md:col-span-2 h-48 bg-slate-800 rounded-2xl" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ERROR STATE 
───────────────────────────────────────────────────────────── */
const ErrorState = ({ message }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 py-20">
    <AlertCircle size={48} className="text-rose-500 opacity-60" />
    <p className="text-lg font-semibold text-slate-300">Oops! Something went wrong</p>
    <p className="text-sm text-rose-400/80">{message}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PROFILE PAGE 
───────────────────────────────────────────────────────────── */
const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(`/profile/${username}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err?.response?.status === 404
            ? "User not found"
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-[#0f172a]"><Skeleton /></div>;
  if (error) return <div className="min-h-screen bg-[#0f172a]"><ErrorState message={error} /></div>;
  if (!profile) return <div className="min-h-screen bg-[#0f172a]"><ErrorState message="No profile data found" /></div>;

  const totalProblems = (profile.easy ?? 0) + (profile.medium ?? 0) + (profile.hard ?? 0);

  const stats = [
    {
      label: "Total Solved",
      value: profile.totalSolved ?? 0,
      icon: Target,
      accent: { border: "border-indigo-500/20", glow: "bg-indigo-500", icon: "bg-indigo-500/10", text: "text-indigo-400" },
    },
    {
      label: "Easy Solved",
      value: profile.easy ?? 0,
      icon: Zap,
      accent: { border: "border-emerald-500/20", glow: "bg-emerald-500", icon: "bg-emerald-500/10", text: "text-emerald-400" },
    },
    {
      label: "Medium Solved",
      value: profile.medium ?? 0,
      icon: TrendingUp,
      accent: { border: "border-amber-500/20", glow: "bg-amber-500", icon: "bg-amber-500/10", text: "text-amber-400" },
    },
    {
      label: "Hard Solved",
      value: profile.hard ?? 0,
      icon: Award,
      accent: { border: "border-rose-500/20", glow: "bg-rose-500", icon: "bg-rose-500/10", text: "text-rose-400" },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        
        {/* Hero Card */}
        <div className="relative overflow-hidden bg-[#1e293b] border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative shrink-0 z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <User size={36} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#1e293b]" />
          </div>
          <div className="flex-1 z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile.username}</h1>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
              <Code2 size={14} /> NerdLab Member
            </p>
          </div>
          <div className="z-10 text-center bg-slate-900/60 border border-slate-700 rounded-2xl px-6 py-4 shrink-0">
            <p className="text-3xl font-extrabold text-white">
              {profile.acceptanceRate ?? "0"}<span className="text-lg text-slate-400">%</span>
            </p>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mt-0.5 flex items-center gap-1 justify-center">
              <TrendingUp size={11} /> Acceptance
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Breakdown */}
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Target size={14} className="text-indigo-400" /> Breakdown
            </h2>
            {totalProblems === 0 ? (
              <p className="text-slate-600 text-sm italic">No problems solved yet</p>
            ) : (
              <div className="space-y-4">
                <SolvedBar label="Easy" count={profile.easy ?? 0} total={totalProblems} color="bg-emerald-500" />
                <SolvedBar label="Medium" count={profile.medium ?? 0} total={totalProblems} color="bg-amber-500" />
                <SolvedBar label="Hard" count={profile.hard ?? 0} total={totalProblems} color="bg-rose-500" />
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="md:col-span-2 bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
              <Clock size={14} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recent Submissions</h2>
            </div>
            {!profile.recentSubmissions || profile.recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <Code2 size={32} className="mb-2 opacity-30" />
                <p className="text-sm italic">No submissions yet</p>
              </div>
            ) : (
              <div>
                {profile.recentSubmissions.map((sub) => (
                  <SubmissionRow key={sub.id} sub={sub} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;