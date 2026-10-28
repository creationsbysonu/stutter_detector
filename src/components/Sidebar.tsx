import { gsap } from "gsap";
import { useEffect, useState } from "react";
import { Activity, Play, Radio } from "lucide-react";
import { languages } from "../data/passages";
import ThemeToggle from "./ThemeToggle";

type SidebarProps = {
  language: string;
  onLanguageChange: (id: string) => void;
  onStartTest: () => void;
  onLiveDetection: () => void;
};

const navLinks = [
  { label: "Overview", href: "#overview", icon: Activity },
  { label: "Fluency Test", href: "#test", icon: Play },
  { label: "Live Detection", href: "#smart-boli", icon: Radio },
];

export default function Sidebar({ language, onLanguageChange, onStartTest, onLiveDetection }: SidebarProps) {
  const [activeHash, setActiveHash] = useState(() => window.location.hash || "#overview");

  useEffect(() => {
    gsap.from(".sidebar-item", {
      x: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || "#overview");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-80 border-r border-[color:var(--line)] bg-[color:var(--surface)]/80 dark:bg-black/80 backdrop-blur-md flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-6 sidebar-item">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
          <Activity className="size-5 text-white" strokeWidth={2} />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[14px] font-extrabold tracking-tight text-[color:var(--ink)] dark:text-white">Smart Boli</span>
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-cyan-400 dark:text-cyan-600">
            Speech fluency lab
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        <p className="px-4 mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--ink-muted)]/40 dark:text-white/40 sidebar-item">
          Navigation
        </p>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 sidebar-item ${
              activeHash === link.href
                ? "bg-[color:var(--ink)]/10 dark:bg-white/10 text-[color:var(--ink)] dark:text-white border border-cyan-500/30"
                : "text-[color:var(--ink-muted)]/60 dark:text-white/60 hover:bg-[color:var(--ink)]/5 dark:hover:bg-white/5 hover:text-[color:var(--ink)] dark:hover:text-white hover:border-[color:var(--line)] dark:hover:border-white/10"
            }`}
          >
            <link.icon className="size-4 text-cyan-400 dark:text-cyan-600" />
            {link.label}
          </a>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-4 py-4 sidebar-item">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--ink-muted)]/40 dark:text-white/40">Settings</p>
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)]/50 dark:bg-black/5 px-1 py-0.5 shadow-sm">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id)}
                aria-pressed={language === lang.id}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  language === lang.id
                    ? "bg-[color:var(--ink)]/20 dark:bg-white/20 text-[color:var(--ink)] dark:text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    : "text-[color:var(--ink-muted)]/60 dark:text-white/60 hover:text-[color:var(--ink)] dark:hover:text-white hover:bg-[color:var(--ink)]/10 dark:hover:bg-white/10"
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
          <ThemeToggle className="w-auto" />
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-6 border-t border-[color:var(--line)] sidebar-item">
        <button
          type="button"
          onClick={onStartTest}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] dark:bg-white text-[color:var(--surface)] dark:text-black px-5 py-3 text-sm font-bold shadow-lg shadow-black/40 dark:shadow-gray-900/40 hover:bg-gray-900 dark:hover:bg-gray-100 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all active:scale-[0.97]"
        >
          <Play className="size-4" /> Start test
        </button>
        <button
          type="button"
          onClick={onLiveDetection}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)]/50 dark:bg-black/5 px-5 py-3 text-sm font-semibold text-[color:var(--ink)]/90 dark:text-white/90 hover:bg-[color:var(--surface)]/80 dark:hover:bg-black/10 hover:border-cyan-500/30 hover:text-[color:var(--ink)] dark:hover:text-white transition-all active:scale-[0.97]"
        >
          <Radio className="size-4" /> Live detection
        </button>
      </div>
    </aside>
  );
}
