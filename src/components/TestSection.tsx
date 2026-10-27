import { useState } from "react";
import { BookOpen, Clock, Info, ShieldCheck, Timer } from "lucide-react";
import { passages } from "../data/passages";
import Recorder from "./Recorder";

export default function TestSection() {
  const [selectedId, setSelectedId] = useState(passages[0].id);
  const selected = passages.find((passage) => passage.id === selectedId) ?? passages[0];

  return (
    <section id="test" className="section relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-teal-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
            <MicBadge /> Take the test
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Read a passage. Hear what your delivery sounds like.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Pick a passage below, allow microphone access, and read aloud at a comfortable
            pace. When you finish, you will get a fluency score with pause and rhythm
            details. Nothing is uploaded.
          </p>
        </div>

        <div className="mt-8" id="test-passages">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Choose your passage
          </p>
          <div className="flex flex-wrap gap-2">
            {passages.map((passage) => {
              const active = passage.id === selected.id;
              return (
                <button
                  key={passage.id}
                  type="button"
                  onClick={() => setSelectedId(passage.id)}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                    active
                      ? "border-teal-400 bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10"
                  }`}
                  aria-pressed={active}
                >
                  {passage.title}
                  <span
                    className={`ml-2 text-[11px] font-medium ${
                      active ? "text-slate-800/70" : "text-slate-400"
                    }`}
                  >
                    {passage.level}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-teal-600" />
                <span className="text-sm font-bold text-slate-900">{selected.title}</span>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                {selected.level}
              </span>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <p className="text-[17px] leading-[1.9] text-slate-700">{selected.text}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-xs text-slate-500 sm:px-6">
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-3.5" /> {selected.words} words
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> About {selected.estimatedMinutes}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Info className="size-3.5" /> Read naturally
              </span>
            </div>
          </article>

          <Recorder key={selected.id} passage={selected} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              text: "Processed on your device. No audio is uploaded, stored, or shared.",
            },
            {
              icon: MicBadge,
              text: "Use a quiet room and speak at a volume that feels natural to you.",
            },
            {
              icon: Info,
              text: "Scores are practice feedback, not a medical or clinical diagnosis.",
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs leading-relaxed text-slate-300"
            >
              <item.icon className="mt-0.5 size-4 shrink-0 text-teal-400" />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MicBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-3.5"}
      aria-hidden="true"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
