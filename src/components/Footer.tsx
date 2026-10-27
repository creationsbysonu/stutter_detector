import { Activity, GitBranch, HeartPulse, ShieldCheck } from "lucide-react";

const explore = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Take the test", href: "#test" },
  { label: "Technology", href: "#technology" },
  { label: "FAQ", href: "#faq" },
];

const project = [
  {
    label: "GitHub repository",
    href: "https://github.com/creationsbysonu/stutter_detector",
    external: true,
  },
  {
    label: "Report an issue",
    href: "https://github.com/creationsbysonu/stutter_detector/issues",
    external: true,
  },
  {
    label: "Training notebooks",
    href: "https://github.com/creationsbysonu/stutter_detector",
    external: true,
  },
  { label: "MIT License", href: "https://github.com/creationsbysonu/stutter_detector/blob/master/LICENSE", external: true },
];

const stack = ["React + Vite", "Tailwind CSS", "FastAPI (next)", "Supabase (next)"];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr]">
          <div>
            <a href="#overview" className="flex items-center gap-2.5" aria-label="Stutter Detector home">
              <span className="brand-gradient flex size-9 items-center justify-center rounded-xl">
                <Activity className="size-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight text-white">
                  Stutter Detector
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                  Speech fluency lab
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              An open speech-fluency research project. Practice reading, understand your
              delivery, and keep your audio private.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="size-3.5 text-teal-400" /> Audio processed on-device
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {explore.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Project</h3>
            <ul className="mt-4 space-y-2.5">
              {project.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                    {link.label === "GitHub repository" && <GitBranch className="size-3.5" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Built with</h3>
            <ul className="mt-4 space-y-2.5">
              {stack.map((item) => (
                <li key={item} className="text-sm text-slate-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-500 sm:flex-row sm:items-start sm:justify-between">
            <p className="flex max-w-2xl items-start gap-2">
              <HeartPulse className="mt-0.5 size-3.5 shrink-0 text-teal-500" />
              <span>
                This tool is for practice and research only. It is not a medical device and
                does not diagnose stuttering or any speech disorder. Consult a qualified
                speech-language professional for clinical concerns.
              </span>
            </p>
            <p className="shrink-0">© {new Date().getFullYear()} Stutter Detector · MIT License</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
