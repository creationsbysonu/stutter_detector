import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LottieAnimation } from "../lib/animations";
import { prefersReducedMotion, useScrollLock } from "../lib/scroll";

type PreloaderProps = {
  onDone: () => void;
};

export default function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  useScrollLock(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        onDone();
        return;
      }

      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => onDone(),
      });

      tl.fromTo(
        ".preloader-mark",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
      )
        .to(
          counter,
          {
            value: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(2, "0");
              }
            },
          },
          0.15,
        )
        .fromTo(
          ".preloader-label",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.35,
        )
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
        }, "+=0.15");
    }, rootRef);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--bg)]"
      aria-label="Loading Smart Boli"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="preloader-mark">
          <LottieAnimation name="loader" className="size-16" />
        </div>
        <p className="preloader-label text-[11px] font-bold uppercase tracking-mega text-[color:var(--ink-faint)]">
          Smart Boli
        </p>
        <span
          ref={counterRef}
          className="text-sm font-bold tabular-nums text-[color:var(--ink-muted)]"
        >
          00
        </span>
      </div>
      <div
        ref={curtainRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0"
      />
    </div>
  );
}
