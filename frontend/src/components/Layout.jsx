import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-slate-300">
      <Navbar />
      {/* Outlet renders the child routes defined in App.jsx */}
      <main className="flex-1 overflow-hidden">
        <Outlet /> 
      </main>
    </div>
  );
}