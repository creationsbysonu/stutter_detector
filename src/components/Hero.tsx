import { ArrowRight, Check, Mic, ShieldCheck, Sparkles } from "lucide-react";

const bars = [18, 34, 52, 28, 66, 40, 74, 46, 30, 58, 38, 70, 44, 24, 50, 62, 36, 54, 26, 42, 68, 32, 48, 20];

const stats = [
  { value: "5,240", label: "Training clips" },
  { value: "13", label: "MFCC features" },
  { value: "16 kHz", label: "Audio sampling" },
  { value: "3", label: "Trained models" },
];

export default function Hero() {
  return (
    <section id="overview" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-backdrop" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 top-0 size-[28rem] rounded-full bg-teal-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 size-[22rem] rounded-full bg-emerald-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative pb-12 pt-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <span className="eyebrow">
              <Sparkles className="size-3.5" />
              Speech fluency research project
            </span>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              Practice speaking with{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-teal-700">clarity</span>
                <span
                  className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-teal-200/70"
                  aria-hidden="true"
                />
              </span>{" "}
              and confidence.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Read a short passage aloud, record it in your browser, and get instant
              feedback on your pace, pauses, and rhythm. Built on the same speech
              analysis pipeline used to train this project&apos;s stutter detection models.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#test" className="btn-primary group">
                Start a fluency check
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#how-it-works" className="btn-ghost">
                See how it works
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-teal-600" /> No account needed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-teal-600" /> Audio stays on your device
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mic className="size-4 text-teal-600" /> Takes about one minute
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-200/40 via-transparent to-emerald-100/30 blur-2xl"
              aria-hidden="true"
            />

            <div className="card relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Mic className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Session preview</p>
                    <p className="text-xs text-slate-500">A Morning Walk · Easy</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                  <span className="size-1.5 animate-pulse rounded-full bg-rose-500" />
                  REC
                </span>
              </div>

              <div className="px-5 py-6">
                <div className="flex h-28 items-center justify-center gap-[3px] overflow-hidden rounded-xl bg-slate-50 px-3">
                  {bars.map((height, index) => (
                    <span
                      key={index}
                      className="w-1.5 shrink-0 rounded-full bg-teal-500/80"
                      style={{
                        height: `${height}%`,
                        animation: `bar-bounce ${1.1 + (index % 5) * 0.14}s ease-in-out ${
                          index * 0.04
                        }s infinite`,
                        opacity: 0.45 + (height / 100) * 0.55,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="metric-card">
                    <p className="field-label">Pace</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      128<span className="ml-0.5 text-xs font-medium text-slate-500">wpm</span>
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="field-label">Pauses</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">3</p>
                  </div>
                  <div className="metric-card">
                    <p className="field-label">Rhythm</p>
                    <p className="mt-1 text-lg font-bold text-teal-700">Steady</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                      Fluency score
                    </p>
                    <p className="text-sm text-teal-900/70">Comfortable, even delivery</p>
                  </div>
                  <p className="text-2xl font-extrabold text-teal-800">84</p>
                </div>
              </div>
            </div>

            <div className="animate-float-slow absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg shadow-slate-900/5 sm:flex">
              <ShieldCheck className="size-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">Private by design</span>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 backdrop-blur sm:mt-20 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl px-4 py-3 text-center sm:py-4">
              <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </dt>
              <dd className="text-2xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
