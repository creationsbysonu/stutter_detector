import {
  Brain,
  Gauge,
  Languages,
  Laptop,
  Lightbulb,
  ShieldCheck,
  Waves,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Instant fluency insights",
    description:
      "Get a session score plus pace, pause, and rhythm metrics the moment you finish reading. No waiting for an upload.",
  },
  {
    icon: Waves,
    title: "Built on MFCC analysis",
    description:
      "The research pipeline extracts 13 mel-frequency cepstral coefficients from 16 kHz audio, the same feature set used to train the project's models.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Your microphone audio is analysed in the browser and never stored. Nothing is uploaded unless a model API is explicitly connected.",
  },
  {
    icon: Brain,
    title: "Research-backed foundation",
    description:
      "Grounded in a balanced dataset of fluent and stuttered speech, with Random Forest and CNN experiments included in the repository.",
  },
  {
    icon: Lightbulb,
    title: "Actionable coaching",
    description:
      "Each result includes practical suggestions for phrasing, breathing, and pacing, written to be useful rather than clinical.",
  },
  {
    icon: Languages,
    title: "Multilingual exploration",
    description:
      "The project includes an English Random Forest model and a separate Nepali model, with room for more languages over time.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section border-y border-slate-200 bg-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">What you get</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            A practice tool, not a black box
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Every part of the experience is designed to be understandable. Here is what
            the site measures, how it works, and why your privacy is part of the design.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md hover:shadow-teal-900/5"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600">
          <Laptop className="mt-0.5 size-4 shrink-0 text-slate-500" />
          <p>
            The live test currently runs a <strong className="font-semibold text-slate-800">browser-side timing and energy analysis</strong>.
            The trained models are being connected through a FastAPI backend in the next
            deployment phase.
          </p>
        </div>
      </div>
    </section>
  );
}
