import { useEffect, useRef } from "react";
import { Cpu, GitBranch, Globe2, History, ShieldCheck, Zap } from "lucide-react";
import { staggerReveal } from "../lib/animations";

const features = [
  {
    icon: ShieldCheck,
    title: "Audio never leaves your device",
    body: "Recordings are analysed in the browser and streamed only as short anonymous chunks for ML inference. No accounts, no storage of raw audio.",
    wide: true,
  },
  {
    icon: Cpu,
    title: "Nepali-trained stutter model",
    body: "A Random Forest classifier trained on Nepali speech reads 13 MFCC features per 1.5s chunk.",
  },
  {
    icon: Globe2,
    title: "नेपाली · हिन्दी · English",
    body: "Reading passages in three scripts, with a dedicated English model on the way.",
  },
  {
    icon: Zap,
    title: "Real-time flash feedback",
    body: "The screen breathes green the moment a chunk comes back fluent — and red the moment it detects a stutter.",
    wide: true,
  },
  {
    icon: History,
    title: "Session history",
    body: "Optional Supabase logging of every chunk, so you can watch fluency trend across days.",
  },
  {
    icon: GitBranch,
    title: "Open source, MIT",
    body: "Every layer — frontend, backend, model — is inspectable and forkable.",
  },
];

export default function Features() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    staggerReveal(rootRef.current, { stagger: 0.07 });
  }, []);

  return (
    <section ref={rootRef} id="features" className="section">
      <div className="container-page">
        <div data-reveal className="max-w-2xl">
          <span className="eyebrow">04 — Features</span>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold tracking-[-0.04em]">
            Built like a lab instrument. Feels like a toy.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[color:var(--ink-muted)]">
            Every part of Smart Boli is tuned for one thing: honest, repeatable
            feedback on how your speech flows.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              data-reveal
              className={`card-hover flex flex-col p-7 sm:p-8 ${
                feature.wide ? "lg:col-span-2" : ""
              }`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--accent)]">
                <feature.icon className="size-5" />
              </span>
              <h3
                className={`mt-6 font-extrabold tracking-tight ${
                  /[\u0900-\u097F]/.test(feature.title)
                    ? "font-deva text-lg"
                    : "text-xl"
                }`}
              >
                {feature.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
