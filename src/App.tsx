import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import TestSection from "./components/TestSection";
import Technology from "./components/Technology";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg)]">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <TestSection />
        <Technology />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
