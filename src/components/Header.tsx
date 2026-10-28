import { gsap } from "gsap";
import { useEffect } from "react";
import { Activity, Mic } from "lucide-react";
import { languages } from "../data/passages";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  language: string;
  onLanguageChange: (id: string) => void;
  onStartTest: () => void;
};

export default function Header({ language, onLanguageChange, onStartTest }: HeaderProps) {
  useEffect(() => {
    gsap.from(".nav-item", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#overview" className="flex items-center gap-2 nav-item" aria-label="Smart Boli home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Activity className="size-5 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-white">
              Smart Boli
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Speech fluency lab
            </span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-1 py-0.5 shadow-sm nav-item">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id)}
                aria-pressed={language === lang.id}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  language === lang.id
                    ? "bg-white/20 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
          <ThemeToggle className="nav-item" />
          <button
            type="button"
            onClick={onStartTest}
            className="flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-black/40 hover:bg-gray-900 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all active:scale-[0.97] nav-item"
            aria-label="Start fluency test"
          >
            <Mic className="size-3.5" /> Start test
          </button>
        </div>
      </div>
    </header>
  );
}
