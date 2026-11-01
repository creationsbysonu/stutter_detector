import { Lottie, type LottieHandle } from "lottie-react";
import { type CSSProperties, type ReactNode, type Ref } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./scroll";

import micAnimation from "../assets/lottie/mic.json";
import micDarkAnimation from "../assets/lottie/mic-dark.json";
import waveformAnimation from "../assets/lottie/waveform.json";
import loaderAnimation from "../assets/lottie/loader.json";
import checkAnimation from "../assets/lottie/check.json";
import scrollCueAnimation from "../assets/lottie/scroll-cue.json";
import scrollCueDarkAnimation from "../assets/lottie/scroll-cue-dark.json";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Self-hosted Lottie registry (no external CDN, always available)    */
/* ------------------------------------------------------------------ */
export const lotties = {
  mic: micAnimation,
  micDark: micDarkAnimation,
  waveform: waveformAnimation,
  loader: loaderAnimation,
  check: checkAnimation,
  scrollCue: scrollCueAnimation,
  scrollCueDark: scrollCueDarkAnimation,
} as const;

export type LottieName = keyof typeof lotties;

/** Legacy alias kept for older imports. */
export const LOTTIE_MIC = "mic";

interface LottieAnimationProps {
  name: LottieName;
  className?: string;
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
  lottieRef?: Ref<LottieHandle>;
  style?: CSSProperties;
}

/**
 * Lottie player that only plays while on screen (IntersectionObserver)
 * and freezes entirely when the user prefers reduced motion.
 */
export function LottieAnimation({
  name,
  className = "",
  speed = 1,
  loop = true,
  autoplay = true,
  lottieRef,
  style,
}: LottieAnimationProps) {
  return (
    <Lottie
      className={className}
      src={lotties[name]}
      speed={speed}
      loop={loop}
      autoplay={autoplay && !prefersReducedMotion()}
      lottieRef={lottieRef}
      style={style}
      aria-hidden="true"
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet", progressiveLoad: true }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Reveal helpers — Apple-style masked line/word reveals on scroll    */
/* ------------------------------------------------------------------ */

/**
 * Wraps each word in a mask span so GSAP can slide words up into view.
 * Returns React nodes; use inside a container driven by `staggerReveal`.
 */
export function maskedWords(text: string, className = ""): ReactNode[] {
  return text.split(" ").map((word, index, all) => (
    <span
      key={`${word}-${index}`}
      className={`reveal-mask inline-block align-top ${
        index === all.length - 1 ? "mr-0" : "mr-[0.24em]"
      }`}
    >
      <span className={className}>{word}</span>
    </span>
  ));
}

/**
 * Fades/slides every `[data-reveal]` descendant of `root` into view as it
 * enters the viewport — the workhorse of the whole site.
 */
export function staggerReveal(
  root: HTMLElement | null,
  options?: { y?: number; stagger?: number; delay?: number },
) {
  if (!root) return;
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  if (items.length === 0) return;

  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, y: options?.y ?? 44 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      delay: options?.delay ?? 0,
      stagger: options?.stagger ?? 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        once: true,
      },
    },
  );
}

/** Animated number count-up, triggered when the element scrolls into view. */
export function countUp(
  element: HTMLElement,
  to: number,
  options?: { duration?: number; decimals?: number; prefix?: string; suffix?: string },
) {
  const decimals = options?.decimals ?? 0;
  const prefix = options?.prefix ?? "";
  const suffix = options?.suffix ?? "";

  if (prefersReducedMotion()) {
    element.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
    return;
  }

  const counter = { value: 0 };
  gsap.to(counter, {
    value: to,
    duration: options?.duration ?? 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      once: true,
    },
    onUpdate: () => {
      element.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`;
    },
  });
}
