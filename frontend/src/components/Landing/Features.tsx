import {
  Terminal,
  Trophy,
  Database,
  BarChart3,
  Brain,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Docker Judge",
    desc: "Secure and isolated code execution.",
  },
  {
    icon: Trophy,
    title: "Contests",
    desc: "Weekly competitive programming contests.",
  },
  {
    icon: Database,
    title: "Large Problem Set",
    desc: "Questions across all major topics.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Monitor your improvement over time.",
  },
  {
    icon: Brain,
    title: "AI Hints",
    desc: "Receive hints without spoilers.",
  },
  {
    icon: Shield,
    title: "Secure Execution",
    desc: "Sandboxed Docker environment.",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">Features</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="bg-slate-900 p-8 rounded-xl"
            >
              <Icon className="text-indigo-500 mb-5" size={32} />

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-400">
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}