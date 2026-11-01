import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { staggerReveal } from "../lib/animations";

const faqs = [
  {
    q: "What exactly does Smart Boli detect?",
    qNe: "स्मार्ट बोलीले के पत्ता लगाउँछ?",
    a: "It detects disfluencies typical of stuttering — repetitions, prolongations and blocks — by analysing short chunks of your voice with a model trained on Nepali speech. Alongside that, a browser-side engine measures pace, pauses and rhythm to score each reading session.",
  },
  {
    q: "Is my audio uploaded anywhere?",
    qNe: "मेरो अडियो कता जान्छ?",
    a: "The fluency-test waveform analysis runs entirely in your browser. In live-detection mode, 1.5-second audio chunks are sent to the backend for ML inference, then discarded. Raw recordings are never stored.",
  },
  {
    q: "Why is Nepali the primary language?",
    qNe: "नेपाली प्राथमिकता किन?",
    a: "The stutter model was trained on a Nepali speech dataset, so Nepali gives the most accurate results today. Hindi passages use the browser analysis engine, and a dedicated English model is under development.",
  },
  {
    q: "Is this a medical diagnosis?",
    qNe: "यो चिकित्सकीय निदान हो?",
    a: "No. Smart Boli is a practice and research tool. It is not a medical device and cannot diagnose stuttering or any speech disorder. For clinical concerns, consult a qualified speech-language pathologist.",
  },
  {
    q: "Can I practise on my phone?",
    qNe: "मोबाइलबाट गर्न सकिन्छ?",
    a: "Yes. The site is fully responsive and the microphone works in modern mobile browsers — over https. For the cleanest audio, use headphones with a built-in mic.",
  },
];

export default function FAQ() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    staggerReveal(rootRef.current, { y: 28 });
  }, []);

  return (
    <section ref={rootRef} id="faq" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-reveal>
          <span className="eyebrow">05 — FAQ</span>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.04em]">
            Questions,
            <br />
            answered plainly.
          </h2>
        </div>

        <div data-reveal className="divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[color:var(--accent-ink)]"
                >
                  <span>
                    <span className="block text-base font-bold tracking-tight sm:text-lg">
                      {faq.q}
                    </span>
                    <span className="mt-1 block font-deva text-sm text-[color:var(--ink-faint)]">
                      {faq.qNe}
                    </span>
                  </span>
                  <Plus
                    className={`size-5 shrink-0 text-[color:var(--ink-faint)] transition-transform duration-500 ${
                      open ? "rotate-45 text-[color:var(--accent)]" : ""
                    }`}
                  />
                </button>
                <div className="accordion-panel" data-open={open}>
                  <div>
                    <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
