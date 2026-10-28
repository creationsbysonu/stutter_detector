import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="size-6 text-cyan-400 animate-spin" />
      <p className="text-sm text-[color:var(--ink-muted)]/50">Loading…</p>
    </div>
  );
}
