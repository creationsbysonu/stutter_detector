import { useEffect } from "react";
import { gsap } from "gsap";
import { Mic, Play } from "lucide-react";

export default function Hero() {
  useEffect(() => {
    gsap.from(".hero-reveal", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section id="overview" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-600">
            <Mic className="size-3" /> Speak naturally
          </span>
          <h1 className="hero-reveal mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-[3.6rem]">
            Hear your <span className="relative inline-block text-black">fluency</span> in your own voice.
          </h1>
          <p className="hero-reveal mt-6 max-w-lg text-lg leading-relaxed text-gray-600">
            Read a short passage aloud and get instant feedback on pace, pauses, and
            rhythm. Audio stays on your device — nothing is uploaded.
          </p>
          <div className="hero-reveal mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-black text-white px-6 py-3.5 text-sm font-semibold shadow-lg hover:bg-gray-900 transition-all active:scale-[0.98]">
              <Play className="size-4" /> Begin fluency check
            </button>
            <a href="#smart-boli" className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]">
              Live chunk detection
            </a>
          </div>
          <div className="hero-reveal mt-10 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-black" /> No account needed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-black" /> On-device audio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-black" /> Nepali · Hindi · English
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
