import { BookOpen, Check, Mic, ScanLine, Sparkles } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Choose a passage",
    description: "Pick an easy, medium, or challenging text. Each one is short enough to finish in a couple of minutes.",
  },
  {
    icon: Mic,
    title: "Allow the microphone",
    description: "Recording stays in your browser. You will see a live level meter so you know the mic is picking you up.",
  },
  {
    icon: ScanLine,
    title: "Read it aloud",
    description: "Speak naturally at your own pace. Pause at punctuation when it feels comfortable. There is no time limit.",
  },
  {
    icon: Sparkles,
    title: "Review your insights",
    description: "Finish the recording to see a fluency score, pause details, estimated pace, and coaching suggestions.",
  },
];

const checklist = [
  "A quiet room and a working microphone",
  "About one minute of uninterrupted time",
  "Reading naturally rather than performing",
  "Willingness to repeat once and compare",
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <span className="eyebrow">The process</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Four steps from reading to feedback
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            The test is intentionally simple. You do not need an account, a special app,
            or a clinical setting. All you need is a passage and your voice.
          </p>

          <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/60 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800">
              Before you start
            </h3>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-teal-950/80">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="relative space-y-4">
          <div
            className="absolute bottom-8 left-[27px] top-8 hidden w-px bg-gradient-to-b from-teal-200 via-slate-200 to-transparent sm:block"
            aria-hidden="true"
          />
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4">
              <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-teal-700 shadow-sm">
                <step.icon className="size-5" />
              </span>
              <div className="card flex-1 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-600">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
