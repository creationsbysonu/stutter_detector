import { BarChart3, Brain, Cpu, Database, Mic, Server, Waves } from "lucide-react";

const pipeline = [
  {
    icon: Mic,
    title: "Capture",
    description: "Mono microphone audio, resampled to 16 kHz for consistency with the training data.",
  },
  {
    icon: Waves,
    title: "Extract",
    description: "13 mel-frequency cepstral coefficients summarised into a compact feature vector.",
  },
  {
    icon: Brain,
    title: "Classify",
    description: "Random Forest and CNN models trained on balanced fluent and stuttered samples.",
  },
  {
    icon: BarChart3,
    title: "Explain",
    description: "Turn timing, pauses, and energy into readable feedback and practice suggestions.",
  },
];

const models = [
  {
    name: "rf_stutter_model.pkl",
    type: "Random Forest",
    detail: "100 trees · 13 MFCC means · 2.5s windows",
    size: "≈ 7.7 MB",
  },
  {
    name: "final_stutter_detection_cnn.h5",
    type: "CNN",
    detail: "Spectrogram-based stutter classification",
    size: "≈ 37.9 MB",
  },
  {
    name: "nepali_stutter_model.pkl",
    type: "Nepali RF",
    detail: "Language-specific fluency experiment",
    size: "≈ 1.7 MB",
  },
];

export default function Technology() {
  return (
    <section id="technology" className="section border-y border-slate-200 bg-white">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <span className="eyebrow">Under the hood</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Inside the detection pipeline
            </h2>
          </div>
          <p className="text-base leading-relaxed text-slate-600 lg:pb-1">
            The project combines classical speech features with machine learning. The
            browser test mirrors the same stages, while the trained models are being
            prepared for a hosted inference API.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((step, index) => (
            <article key={step.title} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <span className="absolute right-4 top-4 text-xs font-extrabold text-slate-300">
                0{index + 1}
              </span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="card p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Database className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Balanced training data</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The dataset pairs natural fluent recordings with synthetically stuttered
              versions, giving the models an equal number of examples from each class.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-teal-50 p-3">
                <p className="text-2xl font-extrabold text-teal-900">2,620</p>
                <p className="text-xs font-medium text-teal-800/70">Fluent clips</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-2xl font-extrabold text-amber-900">2,620</p>
                <p className="text-xs font-medium text-amber-800/70">Stuttered clips</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3">
              <span className="text-sm font-semibold text-slate-700">Total corpus</span>
              <span className="text-sm font-extrabold text-slate-900">5,240 clips</span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Stuttered samples are generated with repetition, prolongation, and block
              insertion at controlled probabilities — the same technique documented in the
              project&apos;s notebooks.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Trained models in the repository</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                3 models
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {models.map((model) => (
                <div key={model.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{model.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {model.type} · {model.detail}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                    {model.size}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                <Server className="mt-0.5 size-3.5 shrink-0 text-slate-500" />
                Next phase: serve the trained models through a FastAPI endpoint and store
                optional session history in Supabase. The live test already works without it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
