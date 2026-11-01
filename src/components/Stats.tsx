import { useEffect, useRef } from "react";
import { countUp } from "../lib/animations";

const stats = [
  { value: 1.5, decimals: 1, suffix: "s", label: "Chunk length", ne: "खण्ड लम्बाइ" },
  { value: 13, decimals: 0, suffix: "", label: "MFCC features", ne: "विशेषताहरू" },
  { value: 3, decimals: 0, suffix: "", label: "Languages", ne: "भाषाहरू" },
  { value: 100, decimals: 0, suffix: "%", label: "On-device audio", ne: "आफ्नै डिभाइसमा" },
];

export default function Stats() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count ?? "0");
      const decimals = Number(element.dataset.decimals ?? "0");
      const suffix = element.dataset.suffix ?? "";
      countUp(element, target, { decimals, suffix, duration: 2.2 });
    });
  }, []);

  return (
    <section ref={rootRef} className="border-y border-[color:var(--line)] bg-[color:var(--surface-2)]">
      <div className="container-page grid grid-cols-2 gap-px lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1.5 px-4 py-12 text-center sm:py-16"
          >
            <span
              data-count={stat.value}
              data-decimals={stat.decimals}
              data-suffix={stat.suffix}
              className="text-4xl font-extrabold tabular-nums tracking-tight text-[color:var(--ink)] sm:text-5xl"
            >
              0{stat.suffix}
            </span>
            <span className="text-sm font-bold text-[color:var(--ink-2)]">
              {stat.label}
            </span>
            <span className="font-deva text-xs text-[color:var(--ink-faint)]">
              {stat.ne}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
