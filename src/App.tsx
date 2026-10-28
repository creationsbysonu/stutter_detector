import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import TestSection from "./components/TestSection";
import SmartBoli from "./components/SmartBoli";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { defaultLanguage } from "./data/passages";

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [showSmartBoli, setShowSmartBoli] = useState(false);

  if (showSmartBoli) {
    return (
      <ErrorBoundary fallback={(_error: Error, reset: () => void) => (
        <div className="flex min-h-screen flex-col bg-black">
          <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md px-6 py-4">
            <button onClick={() => setShowSmartBoli(false)} className="text-white/60 hover:text-white">
              ← Back
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-white/50 mb-6">{_error.message}</p>
            <button
              onClick={reset}
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>
          </main>
          <Footer />
        </div>
      )}>
        <div className="flex min-h-screen flex-col bg-black theme-transition">
          <SmartBoli language={language} onBack={() => setShowSmartBoli(false)} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={(_error, reset) => (
      <div className="flex min-h-screen flex-col bg-black">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/50 mb-6">{_error.message}</p>
          <button
            onClick={reset}
            className="rounded-full bg-white text-black px-5 py-2 text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            Try again
          </button>
        </main>
        <Footer />
      </div>
    )}>
      <div className="flex min-h-screen flex-col bg-black dark:bg-white theme-transition">
        <Sidebar
          language={language}
          onLanguageChange={setLanguage}
          onStartTest={() => setShowSmartBoli(true)}
          onLiveDetection={() => setShowSmartBoli(true)}
        />
        <main className="flex-1 ml-80 dark:text-black">
          <Hero
            onStartTest={() => {
              const el = document.getElementById("test");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onLiveDetection={() => setShowSmartBoli(true)}
          />
          <TestSection language={language} />
        </main>
        <Footer className="ml-80" />
      </div>
    </ErrorBoundary>
  );
}
