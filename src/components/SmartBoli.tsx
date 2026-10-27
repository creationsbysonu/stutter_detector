import { useEffect, useRef, useState } from "react";
import { Mic, StopCircle, Play } from "lucide-react";

const API_BASE =
  ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ??
    "/api") as string;
const PREDICT_URL = `${API_BASE.replace(/\/$/, "")}/predict`;
const CHUNK_SECONDS = 1.5;

interface Prediction {
  label: string;
  color: string;
  fluent: boolean;
  confidence: number | null;
}

export default function SmartBoli() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("READY");
  const [color, setColor] = useState("#e2e8f0");
  const [fluent, setFluent] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Prediction[]>([]);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const levelRef = useRef(0);

  const release = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      try { rec.stop(); } catch { /* noop */ }
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    chunksRef.current = [];
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const addHistory = (p: Prediction) => {
    setHistory((prev) => [p, ...prev].slice(0, 12));
  };

  const startSegment = () => {
    if (!active) return;
    const stream = streamRef.current;
    if (!stream) return;

    const mime =
      MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      if (!active) return;
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      chunksRef.current = [];
      await sendBlob(blob);
      if (active) {
        timerRef.current = setTimeout(() => startSegment(), 50);
      }
    };

    recorder.onerror = () => {
      setError("Microphone recording error.");
      stop();
    };

    try {
      recorder.start(200);
    } catch {
      setError("Could not start recording segment.");
      stop();
    }

    timerRef.current = setTimeout(() => {
      try { recorder.stop(); } catch { /* noop */ }
    }, CHUNK_SECONDS * 1000);
  };

  const sendBlob = async (blob: Blob) => {
    const form = new FormData();
    form.append("file", blob, "chunk.webm");
    try {
      const res = await fetch(PREDICT_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Backend ${res.status}`);
      const data = (await res.json()) as Prediction;
      setLabel(data.label);
      setColor(data.color);
      setFluent(data.fluent);
      setConfidence(data.confidence ?? null);
      addHistory(data);
      setError("");
    } catch (cause) {
      setError(`Prediction failed: ${cause instanceof Error ? cause.message : String(cause)}`);
    }
  };

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      setActive(true);
      startSegment();
    } catch (cause) {
      const name = cause instanceof DOMException ? cause.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission was blocked. Allow mic access and retry.");
      } else if (name === "NotFoundError") {
        setError("No microphone found.");
      } else {
        setError("Could not start microphone.");
      }
    }
  };

  const stop = () => {
    setActive(false);
    release();
    setLabel("READY");
    setColor("#e2e8f0");
    setFluent(null);
  };

  useEffect(() => {
    return () => {
      release();
    };
  }, []);

  const levelBar = `${Math.min(100, Math.round(levelRef.current * 500))}%`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col sm:flex-row bg-slate-50 font-sans">
      <aside className="w-full sm:w-80 border-r border-slate-200 bg-slate-50/60 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Mic className="size-5 text-teal-600" />
          <span className="font-bold text-teal-900 text-lg tracking-tight">Smart Boli</span>
          <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider text-teal-700">
            Nepali stutter detection
          </span>
        </div>

        <div className="mt-2 text-xs text-slate-500">
          1.5 s chunks &bull; 16 kHz &bull; 13 MFCC features &bull; Random Forest
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={active ? stop : start}
            disabled={error.length > 0 && !active}
            className={`flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              active
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-700"
                : "bg-teal-600 text-white shadow-lg shadow-teal-900/20 hover:bg-teal-700"
            }`}
          >
            {active ? <StopCircle className="size-4" /> : <Play className="size-4" />}
            {active ? "Stop detection" : "Start detection"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Last chunks</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No predictions yet</p>
            ) : (
              history.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white/50 text-sm">
                  <span className={`font-bold ${p.fluent ? "text-teal-700" : "text-rose-700"}`}>
                    {p.label}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    {p.confidence != null && (
                      <span className="font-mono">{`${(p.confidence * 100).toFixed(0)}%`}</span>
                    )}
                    <span className="font-mono">{CHUNK_SECONDS}s</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center transition-colors duration-300"
          style={{ backgroundColor: color }}
        >
          <div className="relative z-10 px-6">
            <div className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white mb-6 backdrop-blur-sm">
              {fluent === null ? "IDLE" : fluent ? "FLUENT" : "STUTTERED"}
            </div>
            <div className="text-9xl font-black tracking-tighter text-white sm:text-[10rem]">{label}</div>
            {confidence != null && (
              <p className="mt-3 text-lg text-white/90 font-medium">
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            )}
            <p className="mt-2 text-sm text-white/70">
              {active ? "Listening — speak in Nepali…" : "Press start to begin live detection"}
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-semibold text-white/80 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-teal-400 animate-pulse" : "bg-white/40"}`} />
            {active ? "LIVE · 1.5 s chunks" : "STANDBY"}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-teal-500 transition-[width] duration-100"
            style={{ width: levelBar }}
          />
        </div>
      </main>
    </div>
  );
}
