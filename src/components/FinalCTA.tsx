import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { prefersReducedMotion, useScroll } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

type FinalCTAProps = {
  onStartTest: () => void;
};

const words = ["Speak", "once", "more", "with", "confidence."];

export default function FinalCTA({ onStartTest }: FinalCTAProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const { scrollTo } = useScroll();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(".cta-word", { opacity: 1 });
        return;
      }
      /* Words light up one by one as the section scrolls through the viewport */
      gsap.fromTo(
        ".cta-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "center 55%",
            scrub: true,
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section overflow-hidden">
      <div className="container-page flex flex-col items-center text-center">
        <span className="eyebrow">06 — Start</span>
        <h2 className="mt-8 max-w-4xl text-[clamp(2.6rem,7vw,5.6rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
          {words.map((word, index) => (
            <span
              key={index}
              className={`cta-word inline-block ${
                word === "confidence."
                  ? "bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-ink)] bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
              {index < words.length - 1 && "\u00A0"}
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-[color:var(--ink-muted)]">
          Two minutes. One passage.{" "}
          <span className="font-deva">एक मिनेटको अभ्यास</span> — that is all it
          takes to hear your progress.
        </p>
        <div className="mt-11 flex flex-col gap-3.5 sm:flex-row">
          <button type="button" onClick={onStartTest} className="btn btn-accent group">
            Start live detection
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#test", { offset: -80 })}
            className="btn btn-ghost"
          >
            Practise with a passage
          </button>
        </div>
      </div>
    </section>
  );
}
