import { useEffect } from "react";
import { Activity, Mic } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  onStartTest: () => void;
};

export default function Header({ onStartTest }: HeaderProps) {
  useEffect(() => {
    const els = document.querySelectorAll(".nav-item");
    els.forEach((el) => {
      const animate = el as HTMLElement;
      animate.style.opacity = "0";
      animate.style.transform = "translateY(-10px)";
      const r = animate.getBoundingClientRect();
      void r;
      animate.style.transition = "all 0.6s ease-out";
      animate.style.opacity = "1";
      animate.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--surface)]/60 backdrop-blur-md bg-white/60 dark:bg-black/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#overview" className="flex items-center gap-2 nav-item" aria-label="Smart Boli home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/40">
            <Activity className="size-5 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-[color:var(--ink)]">
              Smart Boli
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Speech fluency lab
            </span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <ThemeToggle className="nav-item" />
          <button
            type="button"
            onClick={onStartTest}
            className="flex items-center gap-2 rounded-full bg-[color:var(--ink)] text-[color:var(--surface)] px-5 py-2.5 text-sm font-semibold shadow-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all active:scale-[0.97] nav-item"
            aria-label="Start fluency test"
          >
            <Mic className="size-3.5" /> Start test
          </button>
        </div>
      </div>
    </header>
  );
}
