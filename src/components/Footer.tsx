import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <a href="#overview" className="flex items-center gap-2" aria-label="Smart Boli home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/50">
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
          <div className="flex items-center gap-6 text-xs text-white/40">
            <a
              href="https://github.com/creationsbysonu/stutter_detector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="border-l border-white/10 pl-6">Open source · MIT License</span>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-8 text-[11px] text-center text-white/30">
          Practice and research tool only — not a medical diagnosis. Consult a qualified
          speech-language professional for clinical concerns.
        </p>
      </div>
    </footer>
  );
}
