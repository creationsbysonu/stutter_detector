import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Mic, Sparkles } from "lucide-react";
import { LottieAnimation, maskedWords } from "../lib/animations";
import { prefersReducedMotion, useScroll } from "../lib/scroll";
import { useTheme } from "../context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

type HeroProps = {
  onLiveDetection: () => void;
};

const headline = "Find your fluent voice.";

const bullets = [
  { ne: "नेपालीमा प्रशिक्षण", en: "Nepali-first model" },
  { ne: "अडियो तपाईंकै डिभाइसमा", en: "Audio stays on device" },
  { ne: "तुरुन्त नतिजा", en: "Instant fluency score" },
];

export default function Hero({ onLiveDetection }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const { scrollTo } = useScroll();
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set("[data-hero]", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-eyebrow",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
      )
        .fromTo(
          ".hero-word",
          { yPercent: 118 },
          { yPercent: 0, duration: 1.25, stagger: 0.07 },
          0.15,
        )
        .fromTo(
          "[data-hero='sub']",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.55,
        )
        .fromTo(
          "[data-hero='cta']",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          0.7,
        )
        .fromTo(
          ".hero-bullet",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 },
          0.9,
        )
        .fromTo(
          ".hero-visual",
          { opacity: 0, scale: 0.92, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.4 },
          0.4,
        );

      /* Locomotive-style parallax: the orb drifts slower than the page */
      gsap.to(".hero-orb", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-waveform", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-copy", {
        yPercent: -12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="overview"
      className="relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44 lg:pt-48"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-52 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-[color:var(--accent)]/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 right-[-10%] h-[420px] w-[420px] rounded-full bg-[color:var(--accent)]/[0.05] blur-[120px]" />
      </div>

      <div className="container-page relative z-10 grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="hero-copy">
          <span className="hero-eyebrow eyebrow inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 backdrop-blur-md">
            <Sparkles className="size-3.5 text-[color:var(--accent)]" />
            <span className="font-deva">स्मार्ट बोली</span>
            <span className="text-[color:var(--line-strong)]">/</span>
            Nepali-first speech lab
          </span>

          <h1 className="display mt-8 text-[clamp(3rem,8.5vw,6.4rem)] leading-[0.98]">
            {maskedWords(headline, "hero-word")}
          </h1>

          <p
            data-hero="sub"
            className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--ink-muted)]"
          >
            Read a short passage in नेपाली, हिन्दी or English and speak into your
            microphone. Smart Boli listens in{" "}
            <strong className="font-bold text-[color:var(--ink)]">1.5-second chunks</strong>,
            flags stuttered moments as they happen, and turns each session into a
            fluency score you can actually practice against.
          </p>

          <div className="mt-11 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => scrollTo("#test", { offset: -80 })}
              data-hero="cta"
              className="btn btn-primary group"
            >
              Take the fluency test
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={onLiveDetection}
              data-hero="cta"
              className="btn btn-ghost"
            >
              <Mic className="size-4" /> Live chunk detection
            </button>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {bullets.map((bullet) => (
              <li key={bullet.en} className="hero-bullet flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_10px_var(--accent)]" />
                <span className="font-deva text-sm text-[color:var(--ink-2)]">
                  {bullet.ne}
                </span>
                <span className="text-sm text-[color:var(--ink-faint)]">
                  {bullet.en}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual relative mx-auto w-full max-w-md" data-hero="visual">
          <div className="hero-orb relative flex aspect-square items-center justify-center">
            <div className="absolute inset-[12%] rounded-full border border-[color:var(--line)]" aria-hidden="true" />
            <div className="absolute inset-[24%] rounded-full border border-[color:var(--line)]" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--accent-soft),transparent_65%)]" aria-hidden="true" />
            <LottieAnimation
              name={theme === "dark" ? "micDark" : "mic"}
              className="relative z-10 w-[58%] animate-floaty"
              speed={0.9}
            />
          </div>
          <div className="hero-waveform card mx-auto -mt-6 w-[86%] px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="field-label">Live waveform</span>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[color:var(--fluent)]">
                <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--fluent)]" />
                16 kHz · on-device
              </span>
            </div>
            <LottieAnimation
              name="waveform"
              className="mt-3 h-14 w-full"
              speed={1.1}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollTo("#how", { offset: 0 })}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--ink-faint)] transition-colors hover:text-[color:var(--ink)] lg:flex"
        aria-label="Scroll to how it works"
      >
        <LottieAnimation
          name={theme === "dark" ? "scrollCueDark" : "scrollCue"}
          className="h-14 w-9"
        />
      </button>
    </section>
  );
}
