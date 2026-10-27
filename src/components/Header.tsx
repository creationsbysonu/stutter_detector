import { useEffect } from "react";
import { gsap } from "gsap";
import { Activity, Mic } from "lucide-react";
import { languages } from "../data/passages";

type HeaderProps = {
  language: string;
  onLanguageChange: (id: string) => void;
  onStartTest: () => void;
};

export default function Header({ language, onLanguageChange, onStartTest }: HeaderProps) {
  useEffect(() => {
    gsap.from(".header-item", {
      y: -16,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power2.out",
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <a href="#overview" className="flex items-center gap-2 header-item" aria-label="Smart Boli home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
            <Activity className="size-4 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14px] font-extrabold tracking-tight text-black">Smart Boli</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">Speech fluency lab</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-1 py-0.5 shadow-sm header-item">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id)}
                aria-pressed={language === lang.id}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  language === lang.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onStartTest}
            className="flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors header-item"
            aria-label="Start fluency test"
          >
            <Mic className="size-3.5" /> Start test
          </button>
        </div>
      </div>
    </header>
  );
}
