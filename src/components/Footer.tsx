import { Activity, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <a href="#overview" className="flex items-center gap-2" aria-label="Smart Boli home">
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand text-white">
              <Activity className="size-4 text-white" strokeWidth={2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[14px] font-extrabold tracking-tight text-slate-900">
                Smart Boli
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                Speech fluency lab
              </span>
            </span>
          </a>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <a
              href="https://github.com/creationsbysonu/stutter_detector"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors"
            >
              <GitBranch className="size-3.5" /> GitHub
            </a>
            <span>Open source · MIT License</span>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-[11px] text-center text-slate-400">
          Practice and research tool only — not a medical diagnosis. Consult a qualified
          speech-language professional for clinical concerns.
        </p>
      </div>
    </footer>
  );
}
