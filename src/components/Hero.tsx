import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect } from "react";
import { Mic, Play } from "lucide-react";
import { LottieAnimation, LOTTIE_MIC } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

type HeroProps = {
  onStartTest: () => void;
  onLiveDetection: () => void;
};

export default function Hero({ onStartTest, onLiveDetection }: HeroProps) {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(".hero-badge", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    })
      .from(
        ".hero-title",
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        ".hero-desc",
        {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        ".hero-actions > *",
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .from(
        ".hero-features > *",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      );

    gsap.to(".wave-path", {
      scrollTrigger: {
        trigger: "#overview",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      attr: { d: "M0 80 Q 200 40 400 80 T 800 80" },
      duration: 1,
      ease: "none",
    });
  }, []);

  return (
    <section id="overview" className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 overflow-hidden">
      {/* Premium SVG background graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-[400px] text-[color:var(--ink)]/5 dark:text-white/5" preserveAspectRatio="none">
          <path className="wave-path" d="M0 80 Q 200 120 400 80 T 800 80" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)]/50 dark:bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 dark:text-cyan-600">
            <Mic className="size-3" /> Speak naturally
          </span>
          <h1 className="hero-title mt-6 text-balance text-5xl font-black leading-[1.02] tracking-tight text-[color:var(--ink)] dark:text-white sm:text-6xl lg:text-[4.5rem]">
            Hear your{" "}
            <span className="relative inline-block text-cyan-400 dark:text-cyan-400">
              fluency
              <span className="absolute inset-x-0 bottom-[8%] z-0 h-[10%] rounded-full bg-cyan-500/30 dark:bg-cyan-500/20 blur-md" />
            </span>{" "}
            in your own voice.
          </h1>
          <p className="hero-desc mt-8 max-w-lg text-lg leading-relaxed text-[color:var(--ink-muted)] dark:text-white/70">
            Read a short passage aloud and get instant feedback on pace, pauses, and
            rhythm. Audio stays on your device — nothing is uploaded.
          </p>
          <div className="hero-actions mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStartTest}
              className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] dark:bg-white text-[color:var(--surface)] dark:text-black px-8 py-4 text-base font-bold shadow-[0_0_30px_rgba(0,0,0,0.6)] dark:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:bg-gray-900 dark:hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300 active:scale-[0.97] group"
            >
              <Play className="size-5 group-hover:translate-x-1 transition-transform" /> Start test
            </button>
            <button
              type="button"
              onClick={onLiveDetection}
              className="flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)]/50 dark:bg-black/5 px-8 py-4 text-base font-semibold text-[color:var(--ink)]/90 dark:text-white/90 hover:bg-[color:var(--surface)]/80 dark:hover:bg-black/10 hover:border-cyan-500/30 hover:text-[color:var(--ink)] dark:hover:text-white transition-all duration-300 active:scale-[0.97]"
            >
              <Mic className="size-5" /> Live chunk detection
            </button>
          </div>
          <div className="hero-features mt-14 flex flex-wrap items-center gap-6 text-sm text-[color:var(--ink-muted)]/50 dark:text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)] dark:shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
              No account needed
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)] dark:shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
              On-device audio
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)] dark:shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
              Nepali · Hindi · English
            </span>
          </div>

          {/* Lottie animation section */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 dark:from-cyan-500/10 dark:to-blue-600/10 rounded-[3rem] blur-xl" />
            <div className="relative rounded-[3rem] border border-[color:var(--line)] bg-[color:var(--surface)]/50 dark:bg-black/5 p-8 backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.1)]">
              <LottieAnimation
                src={LOTTIE_MIC}
                className="w-48 h-48 mx-auto mb-6 opacity-80 animate-pulse-slow"
                speed={0.8}
              />
              <h3 className="text-2xl font-black text-[color:var(--ink)] dark:text-white text-center mb-3">Your voice, analyzed instantly</h3>
              <p className="text-center text-[color:var(--ink-muted)]/60 dark:text-white/60 max-w-md mx-auto">
                Speak into your microphone and get real-time fluency feedback with
                smooth, premium animations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
