import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TestSection from "./components/TestSection";
import SmartBoli from "./components/SmartBoli";
import Footer from "./components/Footer";
import { defaultLanguage } from "./data/passages";

export default function App() {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [showSmartBoli, setShowSmartBoli] = useState(false);

  if (showSmartBoli) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header language={language} onLanguageChange={setLanguage} onStartTest={() => setShowSmartBoli(false)} />
        <SmartBoli language={language} />
        <button
          type="button"
          onClick={() => setShowSmartBoli(false)}
          className="absolute top-6 left-6 z-50 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-black shadow-sm hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header language={language} onLanguageChange={setLanguage} onStartTest={() => {}} />
      <main className="flex-1">
        <Hero />
        <TestSection language={language} />
      </main>
      <Footer />
    </div>
  );
}
