import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { BookOpen, Clock, Timer } from "lucide-react";
import { passages, getDefaultPassage } from "../data/passages";
import Recorder from "./Recorder";

type TestSectionProps = {
  language: string;
};

export default function TestSection({ language }: TestSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const langPassages = passages.filter((p) => p.language === language);
  const defaultPassage = getDefaultPassage(language);
  const selected =
    langPassages.find((p) => p.id === selectedId) ?? defaultPassage;

  useEffect(() => {
    gsap.from(".test-reveal", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, [language]);

  return (
    <section id="test" className="py-20 sm:py-28 border-t border-slate-200">
      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <div className="test-reveal mb-8 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-700">
              Choose passage
            </span>
            <span className="text-xs font-medium text-slate-500">
              {selected.level} · {selected.estimatedMinutes}
            </span>
          </div>

          <h2 className="test-reveal mb-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Read aloud, get feedback
          </h2>
          <p className="test-reveal mb-10 max-w-lg text-lg leading-relaxed text-slate-600">
            Pick a passage below, allow microphone access, and read at a comfortable
            pace. Your fluency score appears when you finish.
          </p>

          <div className="test-reveal mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
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
                    className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "border-brand bg-brand/10 text-slate-950 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {passage.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="test-reveal grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="size-4 text-teal-600" />
                <span className="text-sm font-bold text-slate-900">{selected.title}</span>
              </div>
              <p className="text-[17px] leading-[1.9] text-slate-700">{selected.text}</p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="size-3.5" /> {selected.words} words
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" /> About {selected.estimatedMinutes}
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
