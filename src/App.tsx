import { useState } from "react";
import Header from "./components/Header";
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
        <div className="flex min-h-screen flex-col bg-[color:var(--surface)]">
          <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--surface)]/60 backdrop-blur-md px-6 py-4">
            <button onClick={() => setShowSmartBoli(false)} className="text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]">
              ← Back
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-2xl font-bold text-[color:var(--ink)] mb-2">Something went wrong</h2>
            <p className="text-[color:var(--ink-muted)] mb-6">{_error.message}</p>
            <button
              onClick={reset}
              className="rounded-full bg-[color:var(--ink)] text-[color:var(--surface)] px-5 py-2 text-sm font-bold hover:opacity-80 transition-colors"
            >
              Try again
            </button>
          </main>
          <Footer />
        </div>
      )}>
        <div className="flex min-h-screen flex-col bg-[color:var(--surface)] theme-transition">
          <SmartBoli language={language} onBack={() => setShowSmartBoli(false)} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={(_error, reset) => (
      <div className="flex min-h-screen flex-col bg-[color:var(--surface)]">
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-bold text-[color:var(--ink)] mb-2">Something went wrong</h2>
          <p className="text-[color:var(--ink-muted)] mb-6">{_error.message}</p>
          <button
            onClick={reset}
            className="rounded-full bg-[color:var(--ink)] text-[color:var(--surface)] px-5 py-2 text-sm font-bold hover:opacity-80 transition-colors"
          >
            Try again
          </button>
        </main>
        <Footer />
      </div>
    )}>
      <div className="flex min-h-screen flex-col bg-[color:var(--surface)] theme-transition">
        <header>
          <Header onStartTest={() => setShowSmartBoli(true)} />
        </header>
        <main className="flex-1">
          <Hero
            onStartTest={() => {
              const el = document.getElementById("test");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onLiveDetection={() => setShowSmartBoli(true)}
          />
          <TestSection language={language} onLanguageChange={setLanguage} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
