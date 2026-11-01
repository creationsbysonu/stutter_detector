import { GitBranch } from "lucide-react";

type FooterProps = {
  className?: string;
};

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Features", href: "#features" },
      { label: "Fluency test", href: "#test" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Languages",
    links: [
      { label: "नेपाली — primary model", href: "#test" },
      { label: "English — model in progress", href: "#test" },
      { label: "हिन्दी — browser analysis", href: "#test" },
    ],
  },
];

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`border-t border-[color:var(--line)] bg-[color:var(--surface-2)] ${
        className ?? ""
      }`}
    >
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full border border-[color:var(--line-strong)]">
                <span className="flex items-end gap-[2px]" aria-hidden="true">
                  <span className="h-1.5 w-[3px] rounded-full bg-[color:var(--accent)]" />
                  <span className="h-3 w-[3px] rounded-full bg-[color:var(--ink)]" />
                  <span className="h-2 w-[3px] rounded-full bg-[color:var(--accent)]" />
                </span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight">
                  Smart Boli
                </span>
                <span className="mt-[3px] text-[9px] font-bold uppercase tracking-[0.24em] text-[color:var(--ink-faint)]">
                  Speech fluency lab
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[color:var(--ink-muted)]">
              A Nepali-first stutter detection and fluency practice tool.
              Built in Nepal 🇳🇵 for anyone who wants to hear their speech
              clearly — and practice it safely.
            </p>
            <a
              href="https://github.com/creationsbysonu/stutter_detector"
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
            >
              <GitBranch className="size-4" /> Source on GitHub
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title}>
              <p className="field-label">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="link-underline text-sm text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[color:var(--line)] pt-8 text-xs text-[color:var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Smart Boli · MIT License · Open source</p>
          <p className="max-w-md leading-relaxed">
            Practice and research tool only — not a medical diagnosis. Consult a
            qualified speech-language professional for clinical concerns.
          </p>
        </div>
      </div>
    </footer>
  );
}
