const categories = [
  "Arrays",
  "Strings",
  "Linked List",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Binary Search",
  "Heap",
  "Trie",
  "Math",
];

export default function Categories() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        Explore Topics
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((topic) => (
          <div
            key={topic}
            className="bg-slate-900 px-5 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            {topic}
          </div>
        ))}
      </div>
    </section>
  );
}