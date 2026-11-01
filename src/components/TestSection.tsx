import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Clock, Timer } from "lucide-react";
import { languages, passages, getDefaultPassage } from "../data/passages";
import Recorder from "./Recorder";
import { staggerReveal } from "../lib/animations";
import { cn } from "../lib/utils";

type TestSectionProps = {
  language: string;
  onLanguageChange: (id: string) => void;
};

export default function TestSection({ language, onLanguageChange }: TestSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    staggerReveal(rootRef.current, { y: 30 });
  }, []);

  const langPassages = passages.filter((p) => p.language === language);
  const defaultPassage = getDefaultPassage(language);
  const selected = langPassages.find((p) => p.id === selectedId) ?? defaultPassage;
  const activeLanguage = languages.find((l) => l.id === language) ?? languages[0];

  return (
    <section ref={rootRef} id="test" className="section border-t border-[color:var(--line)]">
      <div className="container-page">
        <div data-reveal className="max-w-2xl">
          <span className="eyebrow">03 — Fluency test</span>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold tracking-[-0.04em]">
            Read aloud. Get scored.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[color:var(--ink-muted)]">
            Pick a language and a passage, allow microphone access, and read at a
            comfortable pace. Your waveform, pace, pauses and fluency score appear
            the moment you stop.
          </p>
        </div>

        {/* Language switcher */}
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-2.5">
          {languages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => {
                onLanguageChange(lang.id);
                setSelectedId(null);
              }}
              aria-pressed={language === lang.id}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300",
                lang.id === "nepali" && "font-deva",
                language === lang.id
                  ? "border-transparent bg-[color:var(--inverse-bg)] text-[color:var(--inverse-ink)] shadow-[0_12px_36px_-14px_var(--accent)]"
                  : "border-[color:var(--line-strong)] text-[color:var(--ink-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--ink)]",
              )}
            >
              {lang.nativeLabel}
              {lang.modelReady && (
                <span
                  className={cn(
                    "ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    language === lang.id
                      ? "bg-[color:var(--accent)] text-white"
                      : "bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]",
                  )}
                >
                  ML
                </span>
              )}
            </button>
          ))}
          <span className="ml-1 text-xs text-[color:var(--ink-faint)]">
            {activeLanguage.note}
          </span>
        </div>

        {/* Passage picker */}
        <div data-reveal className="mt-8 grid gap-3 sm:grid-cols-3">
          {langPassages.map((passage) => {
            const active = passage.id === selected.id;
            return (
              <button
                key={passage.id}
                type="button"
                onClick={() => setSelectedId(passage.id)}
                aria-pressed={active}
                className={cn(
                  "card group relative overflow-hidden p-5 text-left transition-all duration-300",
                  active
                    ? "border-[color:var(--accent)] shadow-[0_16px_48px_-20px_var(--accent)]"
                    : "hover:-translate-y-1 hover:border-[color:var(--line-strong)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.18em]",
                      active ? "text-[color:var(--accent-ink)]" : "text-[color:var(--ink-faint)]",
                    )}
                  >
                    {passage.level}
                  </span>
                  {active && <Check className="size-4 text-[color:var(--accent)]" />}
                </div>
                <p
                  className={cn(
                    "mt-3 text-base font-bold tracking-tight",
                    /[\u0900-\u097F]/.test(passage.title) && "font-deva",
                  )}
                >
                  {passage.title}
                </p>
                <p className="mt-1.5 text-xs text-[color:var(--ink-faint)]">
                  {passage.words} words · {passage.estimatedMinutes}
                </p>
              </button>
            );
          })}
        </div>

        {/* Reader + recorder */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <article data-reveal className="card flex flex-col p-8 sm:p-10">
            <div className="flex items-center gap-2.5">
              <BookOpen className="size-4 text-[color:var(--accent)]" />
              <span className="field-label">Read this aloud</span>
            </div>
            <h3
              className={cn(
                "mt-5 text-2xl font-extrabold tracking-tight",
                /[\u0900-\u097F]/.test(selected.title) && "font-deva",
              )}
            >
              {selected.title}
            </h3>
            <p
              className={cn(
                "mt-6 flex-1 text-[17px] leading-[2.05] text-[color:var(--ink-2)]",
                language === "nepali" || language === "hindi" ? "font-deva" : "",
              )}
            >
              {selected.text}
            </p>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[color:var(--line)] pt-6 text-xs text-[color:var(--ink-faint)]">
              <span className="inline-flex items-center gap-2">
                <Timer className="size-3.5" /> {selected.words} words
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-3.5" /> About {selected.estimatedMinutes}
              </span>
            </div>
          </article>

          <Recorder key={selected.id} passage={selected} />
        </div>
      </div>
    </section>
  );
}
