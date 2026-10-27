import { useState } from "react";
import { Activity, Menu, X } from "lucide-react";

const links = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Technology", href: "#technology" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#overview" className="flex items-center gap-2.5" aria-label="Stutter Detector home">
          <span className="brand-gradient flex size-9 items-center justify-center rounded-xl shadow-sm shadow-teal-900/20">
            <Activity className="size-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-slate-900">
              Stutter Detector
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700">
              Speech fluency lab
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="#test" className="btn-primary !px-4 !py-2.5">
            Take the test
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="nav-link !px-3 !py-3"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#test"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              Take the test
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
