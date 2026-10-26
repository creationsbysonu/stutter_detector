import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, HelpCircle } from "lucide-react";

type View = "options" | "test" | "results";

export default function App() {
  const [view, setView] = useState<View>("options");
  const [showHelp, setShowHelp] = useState(false);

  const startTest = () => {
    setView("test");
  };

  const toggleHelp = () => setShowHelp((p) => !p);

  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--bg)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={viewVariants.initial}
          animate={viewVariants.animate}
          exit={viewVariants.exit}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex-1 flex flex-col items-center justify-center w-full p-4"
        >
          {view === "options" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[color:var(--brand)] flex items-center justify-center mx-auto">
                <Mic className="size-5 text-[color:var(--brand-fg)]" />
              </div>
              <h1 className="text-3xl font-bold text-[color:var(--ink)] tracking-tight">
                Stutter Detector
              </h1>
              <p className="text-[color:var(--muted)]">
                Read a passage and get fluency feedback
              </p>
              <button onClick={startTest} className="w-full btn btn-primary">
                Start Reading
              </button>
              <button onClick={toggleHelp} className="w-full btn btn-ghost text-sm">
                How it works
              </button>
            </div>
          )}
          {view === "test" && (
            <div className="text-center py-20">
              <p className="text-[color:var(--muted)]">
                Recording view - under construction
              </p>
            </div>
          )}
          {view === "results" && (
            <div className="text-center py-20">
              <p className="text-[color:var(--muted)]">
                Results view - under construction
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showHelp && (
        <div className="fixed inset-0 bg-[color:var(--bg)/30] backdrop-blur-sm">
          <div className="surface w-full max-w-md mx-4 sm:mx-0 sm:max-w-2xl p-6 mt-20">
            <button
              onClick={() => setShowHelp(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-[color:var(--surface)] text-[color:var(--ink)] hover:bg-[color:var(--line)] transition p-2"
            >
              <HelpCircle className="size-4" /> Close
            </button>
            <h2 className="text-xl font-bold text-[color:var(--ink)] mb-3">How it works</h2>
            <ol className="space-y-3 text-[color:var(--muted)] text-sm">
              <li>Press Start Reading</li>
              <li>Allow microphone access</li>
              <li>Read the passage aloud</li>
              <li>Press Finish to see your fluency score</li>
            </ol>
            <p className="mt-4 text-[color:var(--muted)]">
              Nothing is stored permanently. Audio is only sent locally for analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
