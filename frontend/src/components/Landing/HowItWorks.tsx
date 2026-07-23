const steps = [
  "Create an Account",
  "Choose a Problem",
  "Write Your Solution",
  "Run & Submit",
  "Improve Your Ranking",
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-16">
        How It Works
      </h2>

      <div className="grid md:grid-cols-5 gap-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className="bg-slate-900 rounded-xl p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-500">
              {index + 1}
            </div>

            <p className="mt-4">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}