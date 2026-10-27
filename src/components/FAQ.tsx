import { ArrowRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is this a medical diagnosis?",
    answer:
      "No. Stutter Detector is a practice and research tool. It gives feedback on observable speech patterns such as pauses, pace, and rhythm. It cannot diagnose stuttering or any other speech condition. Please speak with a qualified speech-language professional for clinical advice.",
  },
  {
    question: "Is my voice recording uploaded or stored?",
    answer:
      "No. The current test captures audio through your browser, analyses it on your device, and discards it when you close or reset the session. There is no account and no server-side storage. If a model API is connected later, the site will clearly ask for consent before sending audio.",
  },
  {
    question: "How is the fluency score calculated?",
    answer:
      "The score combines the proportion of time spent speaking, the number and length of pauses, how evenly phrases are grouped, and your estimated speaking pace. It is a transparent heuristic designed for practice. The trained Random Forest and CNN models will provide a separate model-based classification once the FastAPI backend is deployed.",
  },
  {
    question: "What do pace, pauses, and rhythm mean?",
    answer:
      "Pace is an estimate of words per minute while your voice is active. Pauses are gaps of 0.3 seconds or longer inside your reading. Rhythm describes how even your phrases are: a steady rhythm has similar phrase lengths, while an uneven rhythm jumps between short bursts and long stops. Speaking percentage is the share of the recording that contains voice.",
  },
  {
    question: "Do I need an account or special software?",
    answer:
      "No. You need a modern browser, a microphone, and a secure HTTPS connection (the deployed site provides this). No installation or sign-up is required. On mobile, use the browser's microphone permission prompt and headphones for cleaner audio.",
  },
  {
    question: "Which languages and models are included?",
    answer:
      "The practice passages are in English. The repository includes an English Random Forest model, a CNN stutter classifier, and a separate Nepali Random Forest model. The multilingual work is experimental and not yet exposed through the live test.",
  },
  {
    question: "How were the models trained?",
    answer:
      "The training notebooks balance 2,620 fluent clips with 2,620 synthetically stuttered clips. Audio is resampled to 16 kHz, 13 MFCCs are extracted, and a Random Forest with 100 trees is trained on the averaged features. A CNN variant is trained on spectrogram representations. The repository includes the notebooks and scripts used for augmentation.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="eyebrow">Questions</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Good to know before you record
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Short answers about privacy, accuracy, and what the numbers on your result
              card actually mean.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Still curious?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                The full source, notebooks, and model files are available in the project
                repository.
              </p>
              <a
                href="https://github.com/creationsbysonu/stutter_detector"
                target="_blank"
                rel="noreferrer"
                className="btn-soft mt-4 w-full"
              >
                View the repository <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white px-5 py-4 open:border-teal-200 open:bg-teal-50/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 group-open:text-teal-600" />
                </summary>
                <p className="mt-3 pr-6 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="brand-gradient mt-16 overflow-hidden rounded-3xl px-6 py-10 text-center shadow-xl shadow-teal-900/10 sm:px-12 sm:py-14">
          <h2 className="mx-auto max-w-2xl text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            One passage is all it takes to hear the difference.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-teal-50/90 sm:text-base">
            Take a minute, read naturally, and compare your first attempt with your second.
            Progress starts with noticing.
          </p>
          <a
            href="#test"
            className="btn mt-6 bg-white text-teal-800 shadow-sm hover:bg-teal-50 active:scale-[0.98]"
          >
            Start the fluency check <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
