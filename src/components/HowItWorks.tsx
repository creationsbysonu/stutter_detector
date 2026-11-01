import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpenText, Mic, Cpu, LineChart } from "lucide-react";
import { staggerReveal } from "../lib/animations";
import { prefersReducedMotion } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: BookOpenText,
    titleEn: "Choose a passage",
    titleNe: "पाठ छान्नुहोस्",
    body: "Short reading passages in Nepali, Hindi and English — from a one-minute warm-up to a three-minute challenge.",
  },
  {
    icon: Mic,
    titleEn: "Speak naturally",
    titleNe: "प्राकृतिक रूपमा बोल्नुहोस्",
    body: "Press record and read aloud at your own pace. The microphone is requested only when you start — nothing is uploaded.",
  },
  {
    icon: Cpu,
    titleEn: "Chunk-by-chunk analysis",
    titleNe: "ब्लक गरी विश्लेषण",
    body: "Your voice is analysed in 1.5-second chunks. A Nepali-trained model reads 13 MFCC features per chunk and flags stuttered moments in real time.",
  },
  {
    icon: LineChart,
    titleEn: "Practice against your score",
    titleNe: "आफ्नो नतिजासँग अभ्यास",
    body: "Pace, pauses, rhythm and a fluency score — with concrete suggestions you can apply on the very next reading.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      staggerReveal(section.querySelector("[data-reveal-root]"));

      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.5}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how" className="section overflow-hidden">
      <div data-reveal-root className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">01 — How it works</span>
            <h2 className="mt-6 max-w-xl text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold tracking-[-0.04em]">
              Four steps between you and a clearer read.
            </h2>
          </div>
          <p
            data-reveal
            className="max-w-xs text-sm leading-relaxed text-[color:var(--ink-muted)]"
          >
            The whole loop takes about two minutes. Scroll to move through it →
          </p>
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        <div ref={trackRef} className="flex gap-5 px-5 sm:px-8 md:w-max md:gap-7 md:px-10">
          {steps.map((step, index) => (
            <article
              key={step.titleEn}
              className="card group relative flex w-[82vw] shrink-0 flex-col justify-between p-8 sm:w-[62vw] md:w-[420px] md:p-10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] transition-colors duration-500 group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-5xl font-extrabold tabular-nums tracking-tight text-[color:var(--line-strong)] transition-colors duration-500 group-hover:text-[color:var(--accent)]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-extrabold tracking-tight">
                  {step.titleEn}
                </h3>
                <p className="mt-1.5 font-deva text-base text-[color:var(--accent-ink)]">
                  {step.titleNe}
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                  {step.body}
                </p>
              </div>
              <div className="mt-10 flex items-center gap-2" aria-hidden="true">
                {steps.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      dotIndex === index
                        ? "w-8 bg-[color:var(--accent)]"
                        : "w-3 bg-[color:var(--line-strong)]"
                    }`}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
