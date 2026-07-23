import LandingNavbar from "../../components/Navbar";
import Hero from "../../components/Landing/Hero";
import Stats from "../../components/Landing/Stats";
import Features from "../../components/Landing/Features";
import Categories from "../../components/Landing/Categories";
import HowItWorks from "../../components/Landing/HowItWorks";
import CTA from "../../components/Landing/CTA";
import Footer from "../../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />
      <Hero />
      <Stats />
      <Features />
      <Categories />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}