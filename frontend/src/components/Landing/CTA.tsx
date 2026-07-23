import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-28">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-5xl font-bold">
          Ready to Level Up?
        </h2>

        <p className="mt-6 text-slate-400">
          Join thousands of developers improving their coding skills every day.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-10 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-semibold"
        >
          Start Coding
        </button>
      </div>
    </section>
  );
}