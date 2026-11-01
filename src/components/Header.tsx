import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, Mic, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useScroll, useScrollLock, prefersReducedMotion } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Test", href: "#test" },
];

type HeaderProps = {
  onStartTest: () => void;
};

export default function Header({ onStartTest }: HeaderProps) {
  const { scrollTo } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen && !prefersReducedMotion()) {
      gsap.fromTo(
        ".mobile-link",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" },
      );
    }
  }, [menuOpen]);

  const navigate = (event: React.MouseEvent, href: string) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollTo(href, { offset: -80 });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled
            ? "border-b border-[color:var(--line)] bg-[color:var(--bg)]/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`container-page flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <a
            ref={logoRef}
            href="#overview"
            onClick={(event) => navigate(event, "#overview")}
            className="flex items-center gap-3"
            aria-label="Smart Boli home"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] backdrop-blur-md">
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
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => navigate(event, link.href)}
                className="link-underline rounded-full px-4 py-2 text-[13px] font-semibold text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={onStartTest}
              className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex"
              aria-label="Start fluency test"
            >
              <Mic className="size-3.5" /> Start test
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full border border-[color:var(--line-strong)] transition-colors hover:border-[color:var(--accent)] md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col justify-center bg-[color:var(--bg)]/95 backdrop-blur-2xl md:hidden">
          <nav className="container-page flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => navigate(event, link.href)}
                className="mobile-link flex items-baseline gap-4 border-b border-[color:var(--line)] py-5 text-3xl font-extrabold tracking-tight"
              >
                <span className="text-xs font-bold text-[color:var(--accent)]">
                  0{index + 1}
                </span>
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onStartTest();
              }}
              className="mobile-link btn btn-primary mt-6 w-full"
            >
              <Mic className="size-4" /> Start live detection
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
