import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radio } from "lucide-react";
import { LottieAnimation } from "../lib/animations";
import { prefersReducedMotion } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

type LiveShowcaseProps = {
  onOpen: () => void;
};

const chips = [
  { text: "बिहानको हावा", fluent: true },
  { text: "नदीको किनार…किनारको", fluent: false },
  { text: "बाटोमा हिड्छु", fluent: true },
  { text: "रुखमा चराहरू बोल्छन्", fluent: true },
];

export default function LiveShowcase({ onOpen }: LiveShowcaseProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      /* Apple-style: the product panel scales up and un-tilts as you scroll */
      gsap.fromTo(
        stageRef.current,
        { scale: 0.82, rotateX: 14, y: 80 },
        {
          scale: 1,
          rotateX: 0,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 15%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".showcase-copy > *",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section overflow-hidden">
      <div className="container-page grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="showcase-copy order-2 lg:order-1">
          <span className="eyebrow">02 — Live detection</span>
          <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold tracking-[-0.04em]">
            Watch stutter appear — and disappear.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--ink-muted)]">
            In live mode your speech is streamed in 1.5-second chunks. Each chunk
            comes back <strong className="font-semibold text-[color:var(--fluent)]">fluent</strong> or{" "}
            <strong className="font-semibold text-[color:var(--stutter)]">stuttered</strong>, and the
            whole screen flashes the verdict the instant it lands.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onOpen} className="btn btn-primary group">
              <Radio className="size-4" />
              Open live detection
            </button>
            <span className="text-xs text-[color:var(--ink-faint)]">
              Requires a deployed backend · mic access
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2" style={{ perspective: "1400px" }}>
          <div
            ref={stageRef}
            className="card relative overflow-hidden p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.4)] will-change-transform"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--ink-faint)]">
                <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--accent)]" />
                Listening · नेपाली
              </span>
              <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-[11px] font-bold text-[color:var(--ink-muted)]">
                1.5s chunks
              </span>
            </div>

            <div className="my-10 flex flex-col items-center gap-3">
              <LottieAnimation name="waveform" className="h-20 w-full max-w-sm" speed={1.2} />
              <span className="text-6xl font-extrabold tracking-tight text-[color:var(--fluent)]">
                FLUENT
              </span>
              <span className="text-sm text-[color:var(--ink-faint)]">
                confidence 91.4%
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {chips.map((chip, index) => (
                <span
                  key={index}
                  className={`font-deva rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                    chip.fluent
                      ? "border-[color:var(--fluent)]/40 bg-[color:var(--fluent)]/10 text-[color:var(--fluent)]"
                      : "border-[color:var(--stutter)]/40 bg-[color:var(--stutter)]/10 text-[color:var(--stutter)]"
                  }`}
                >
                  {chip.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
