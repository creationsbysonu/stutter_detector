import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { BookOpen, Clock, Timer } from "lucide-react";
import { passages, getDefaultPassage } from "../data/passages";
import Recorder from "./Recorder";

type TestSectionProps = { language: string };

export default function TestSection({ language }: TestSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const langPassages = passages.filter((p) => p.language === language);
  const defaultPassage = getDefaultPassage(language);
  const selected = langPassages.find((p) => p.id === selectedId) ?? defaultPassage;

  useEffect(() => {
    gsap.from(".test-item", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, [language]);

  return (
    <section id="test" className="section border-t border-white/5">
      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/50">
              Choose passage
            </span>
            <span className="text-xs font-medium text-white/40">
              {selected.level} · {selected.estimatedMinutes}
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Read aloud, get feedback
          </h2>
          <p className="mb-14 max-w-lg text-lg leading-relaxed text-white/70">
            Pick a passage below, allow microphone access, and read at a comfortable
            pace. Your fluency score appears when you finish.
          </p>

          <div className="mb-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Passage
            </p>
            <div className="flex flex-wrap gap-2">
              {langPassages.map((passage) => {
                const active = passage.id === selected.id;
                return (
                  <button
                    key={passage.id}
                    type="button"
                    onClick={() => setSelectedId(passage.id)}
                    aria-pressed={active}
                    className={`rounded-full border px-5 py-2.5 text-left text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "border-cyan-500 bg-black/30 text-white shadow-[0_0_20px_rgba(14,165,230,0.2)]"
                        : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {passage.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="card-hover p-8 sm:p-10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="size-5 text-cyan-400" />
                <span className="text-sm font-bold text-white">{selected.title}</span>
              </div>
              <p className="text-[17px] leading-[1.9] text-white/70">{selected.text}</p>
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40">
                <span className="inline-flex items-center gap-2">
                  <Timer className="size-4" /> {selected.words} words
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4" /> About {selected.estimatedMinutes}
                </span>
              </div>
            </article>

            <Recorder key={selected.id} passage={selected} />
          </div>
        </div>
      </div>
    </section>
  );
}
