import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import HowItWorks from "./components/HowItWorks";
import LiveShowcase from "./components/LiveShowcase";
import TestSection from "./components/TestSection";
import Features from "./components/Features";
import Stats from "./components/Stats";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import SmartBoli from "./components/SmartBoli";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { SmoothScrollProvider, useScroll } from "./lib/scroll";
import { defaultLanguage } from "./data/passages";

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <AppInner />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

/** Thin scroll-progress hairline pinned to the top of the viewport. */
function ScrollProgress() {
  const { lenis } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = (value: number) =>
      setProgress(Math.min(1, Math.max(0, value)));

    if (lenis) {
      const handler = (event: { progress: number }) => update(event.progress);
      lenis.on("scroll", handler);
      return () => lenis.off("scroll", handler);
    }

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      update(total > 0 ? window.scrollY / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[95] h-[2px] origin-left bg-[color:var(--accent)] will-change-transform"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}

function AppInner() {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [showSmartBoli, setShowSmartBoli] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoaded = useCallback(() => setLoading(false), []);

  const openLiveDetection = useCallback(() => setShowSmartBoli(true), []);

  return (
    <ErrorBoundary
      fallback={(error: Error, reset: () => void) => (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-[color:var(--ink-muted)]">
            {error.message}
          </p>
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
        </div>
      )}
    >
      {loading && <Preloader onDone={handleLoaded} />}
      {!loading && <ScrollProgress />}

      {showSmartBoli ? (
        <SmartBoli
          language={language}
          onBack={() => setShowSmartBoli(false)}
        />
      ) : (
        <div className="flex min-h-screen flex-col">
          <Header onStartTest={openLiveDetection} />
          <main className="flex-1">
            <Hero onLiveDetection={openLiveDetection} />
            <Marquee />
            <HowItWorks />
            <LiveShowcase onOpen={openLiveDetection} />
            <TestSection language={language} onLanguageChange={setLanguage} />
            <Features />
            <Stats />
            <FAQ />
            <FinalCTA onStartTest={openLiveDetection} />
          </main>
          <Footer />
        </div>
      )}
    </ErrorBoundary>
  );
}
