const stats = [
  { value: "3000+", label: "Problems" },
  { value: "15+", label: "Languages" },
  { value: "500K+", label: "Submissions" },
  { value: "10K+", label: "Developers" },
];

export default function Stats() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-slate-900 rounded-xl p-8 text-center"
          >
            <h2 className="text-4xl font-bold text-indigo-500">
              {item.value}
            </h2>

            <p className="mt-2 text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}