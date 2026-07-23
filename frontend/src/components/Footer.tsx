export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-400">
        <p>© 2026 NerdLab. All rights reserved.</p>

        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </footer>
  );
}