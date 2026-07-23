import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 text-center">
      <h1 className="text-6xl font-extrabold leading-tight">
        Master Coding
        <br />
        <span className="text-indigo-500">One Problem at a Time</span>
      </h1>

      <p className="mt-8 text-slate-400 text-xl max-w-3xl mx-auto">
        Practice coding problems, compete in contests, and prepare for technical
        interviews with our fast Docker-powered online judge.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/questions")}
          className="border border-slate-700 hover:border-indigo-500 px-6 py-3 rounded-xl"
        >
          Browse Problems
        </button>
      </div>
    </section>
  );
}