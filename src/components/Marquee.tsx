const items = [
  "नेपाली",
  "Nepali-first model",
  "हिन्दी",
  "1.5s chunk analysis",
  "English",
  "13 MFCC features",
  "स्मार्ट बोली",
  "100% on-device audio",
  "धाराप्रवाह बोल्नुहोस्",
  "Open source",
];

export default function Marquee() {
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[color:var(--line)] py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap will-change-transform">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-10 text-sm font-bold uppercase tracking-[0.22em] text-[color:var(--ink-faint)]"
          >
            <span className={/[\u0900-\u097F]/.test(item) ? "font-deva tracking-normal" : ""}>
              {item}
            </span>
            <span className="size-1 rounded-full bg-[color:var(--accent)]" aria-hidden="true" />
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[color:var(--bg)] to-transparent sm:w-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[color:var(--bg)] to-transparent sm:w-40"
        aria-hidden="true"
      />
    </div>
  );
}
