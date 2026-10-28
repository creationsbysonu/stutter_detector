import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Mic, StopCircle, Play, ArrowLeft } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const API_BASE =
  ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ??
    "") as string;
const PREDICT_URL = `${API_BASE.replace(/\/$/, "")}/predict`;
const WARMUP_URL = `${API_BASE.replace(/\/$/, "")}/warmup`;
const CHUNK_SECONDS = 1.5;
const BACKEND_CONFIGURED = Boolean(API_BASE);

interface Prediction { label: string; fluent: boolean; confidence: number | null; }

type SmartBoliProps = { language: string; onBack: () => void };

export default function SmartBoli({ language, onBack }: SmartBoliProps) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("READY");
  const [fluent, setFluent] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [backendReady, setBackendReady] = useState(BACKEND_CONFIGURED);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const levelRef = useRef(0);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    gsap.from(".boli-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!BACKEND_CONFIGURED) {
      setBackendReady(false);
      setError("Backend not configured. Set VITE_API_BASE_URL to your deployed API.");
    }
  }, []);

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
    if (colorTweenRef.current) {
      colorTweenRef.current.kill();
      colorTweenRef.current = null;
    }
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
        timerRef.current = setTimeout(() => startSegment(), 100);
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
    const attempt = async (warmFirst: boolean) => {
      if (warmFirst) {
        try { await fetch(WARMUP_URL); } catch { /* ignore warmup failure */ }
      }
      const res = await fetch(PREDICT_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Backend ${res.status}`);
      const data = (await res.json()) as Prediction;
      setLabel(data.label);
      setFluent(data.fluent);
      setConfidence(data.confidence ?? null);
      setError("");

      if (isSupabaseConfigured) {
        try {
          await supabase.from("sessions").insert({
            language,
            label: data.label,
            fluent: data.fluent,
            confidence: data.confidence ?? null,
            chunk_seconds: CHUNK_SECONDS,
          });
        } catch {
          // Supabase save is non-fatal
        }
      }
    };
    try {
      await attempt(false);
    } catch (cause) {
      try {
        await attempt(true);
      } catch (cause2) {
        setError(`Prediction failed: ${cause2 instanceof Error ? cause2.message : String(cause2)}`);
      }
    }
  };

  const start = async () => {
    setError("");
    if (!backendReady) {
      setError("Backend not configured. Please contact support.");
      return;
    }
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
    setFluent(null);
  };

  // Animate full-screen color on state change
  useEffect(() => {
    if (!backendReady || !screenRef.current || fluent === null) return;
    const target = fluent ? "#10b981" : "#ef4444";
    colorTweenRef.current = gsap.to(screenRef.current, {
      backgroundColor: target,
      duration: 0.3,
      ease: "power2.inOut",
    });
    return () => {
      if (colorTweenRef.current) {
        colorTweenRef.current.kill();
        colorTweenRef.current = null;
      }
    };
  }, [fluent, backendReady]);

  const levelBar = `${Math.min(100, Math.round(levelRef.current * 500))}%`;

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[60] flex flex-col sm:flex-row bg-black dark:bg-white transition-colors duration-300 theme-transition"
    >
      {/* Header bar with back button */}
      <header className="z-[70] w-full border-b border-white/10 dark:border-black/10 bg-black/40 dark:bg-white/5 backdrop-blur-sm px-6 py-4 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5 px-3 py-2 text-xs font-bold text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 dark:bg-black/10 text-white dark:text-black">
            <Mic className="size-4" />
          </span>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400 dark:text-cyan-600">
              Smart Boli
            </span>
            <span className="block text-[10px] text-white/50 dark:text-black/50">
              Live chunk detection · {language.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="w-16" />
      </header>

      <aside className="w-full sm:w-80 border-r border-white/10 dark:border-black/10 bg-black/80 dark:bg-white/5 backdrop-blur-md p-6 shrink-0">
        <div className="mb-6 text-xs font-bold uppercase tracking-wider text-cyan-400 dark:text-cyan-600">
          Detection settings
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5">
            <span className="text-xs text-white/60 dark:text-black/60">Chunk duration</span>
            <span className="text-xs font-mono text-white dark:text-black">{CHUNK_SECONDS}s</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5">
            <span className="text-xs text-white/60 dark:text-black/60">Sample rate</span>
            <span className="text-xs font-mono text-white dark:text-black">16 kHz</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5">
            <span className="text-xs text-white/60 dark:text-black/60">MFCC features</span>
            <span className="text-xs font-mono text-white dark:text-black">13</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5">
            <span className="text-xs text-white/60 dark:text-black/60">Model</span>
            <span className="text-xs font-mono text-white dark:text-black">Random Forest</span>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 dark:border-black/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-white/30 dark:text-black/30 mb-3">Session log</p>
          <div className="text-xs text-white/40 dark:text-black/40 italic">
            Detection appears on screen
          </div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center text-center">
        <div className="relative z-10 px-8">
          <div className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest mb-10 backdrop-blur-sm border ${
            fluent === null
              ? "border-white/20 dark:border-black/20 bg-white/5 dark:bg-black/5 text-white/40 dark:text-black/40"
              : fluent
                ? "border-green-500/50 bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
          }`}>
            {fluent === null ? "IDLE" : fluent ? "FLUENT" : "STUTTERED"}
          </div>
          <div className="text-[9xl] font-black tracking-tighter text-white dark:text-black sm:text-[11rem]">{label}</div>
          {confidence != null && (
            <p className="mt-5 text-xl text-white/60 dark:text-black/60 font-medium">
              Confidence: {(confidence * 100).toFixed(1)}%
            </p>
          )}
          <p className="mt-4 text-sm text-white/40 dark:text-black/40">
            {active ? "Listening — speak now…" : "Press start to begin live detection"}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 text-xs font-bold text-white/40 dark:text-black/40 bg-white/5 dark:bg-black/5 backdrop-blur px-4 py-2.5 rounded-full border border-white/10 dark:border-black/10 shadow-lg">
          <span
            className={`h-3 w-3 rounded-full ${active ? "bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.6)] dark:shadow-[0_0_12px_rgba(0,0,0,0.4)]" : "bg-white/20 dark:bg-black/20"}`}
          />
          {active ? "LIVE · 1.5 s chunks" : "STANDBY"}
        </div>

        <div className="absolute bottom-6 left-6 right-6 h-1 overflow-hidden rounded-full bg-white/10 dark:bg-black/10">
          <div className="h-full rounded-full bg-white dark:bg-black transition-[width] duration-100 shadow-[0_0_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ width: levelBar }} />
        </div>
      </main>

      {/* Control panel floating at bottom */}
      <div className="z-[70] w-full sm:w-80 bg-black/90 dark:bg-white/90 backdrop-blur-md border-t border-white/10 dark:border-black/10 p-6 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40 dark:text-black/40 mb-2">Control</p>
            <button
              type="button"
              onClick={active ? stop : start}
              disabled={error.length > 0 && !active}
              className={`w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-all duration-300 ${
                active
                  ? "bg-red-600 dark:bg-red-700 text-white shadow-lg shadow-red-500/40 hover:bg-red-700"
                  : "bg-white dark:bg-black text-black dark:text-white shadow-lg shadow-white/20 dark:shadow-black/20 hover:bg-gray-200 dark:hover:bg-gray-100"
              }`}
            >
              {active ? <StopCircle className="size-5" /> : <Play className="size-5" />}
              {active ? "Stop detection" : "Start detection"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
