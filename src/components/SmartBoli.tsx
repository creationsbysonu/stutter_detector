import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Mic, StopCircle, Play } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const API_BASE =
  ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ??
    "/api") as string;
const PREDICT_URL = `${API_BASE.replace(/\/$/, "")}/predict`;
const WARMUP_URL = `${API_BASE.replace(/\/$/, "")}/warmup`;
const CHUNK_SECONDS = 1.5;

interface Prediction { label: string; fluent: boolean; confidence: number | null; }

type SmartBoliProps = { language: string };

export default function SmartBoli({ language }: SmartBoliProps) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("READY");
  const [fluent, setFluent] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const levelRef = useRef(0);
  const screenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.from(".boli-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
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

  useEffect(() => {
    if (screenRef.current && fluent !== null) {
      const target = fluent ? "#10b981" : "#ef4444";
      gsap.to(screenRef.current, { backgroundColor: target, duration: 0.5, ease: "power2.inOut" });
      gsap.to(screenRef.current.querySelectorAll(".boli-text"), {
        color: "#ffffff",
        duration: 0.5,
      });
    }
    return () => {
      release();
    };
  }, [fluent]);

  const levelBar = `${Math.min(100, Math.round(levelRef.current * 500))}%`;

  return (
    <div ref={screenRef} className="fixed inset-0 z-[60] flex flex-col sm:flex-row bg-black transition-colors duration-700">
      <aside className="w-full sm:w-80 border-r border-white/5 bg-black/80 backdrop-blur-md p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3 boli-item">
          <Mic className="size-5 text-white" />
          <span className="font-bold text-white text-lg tracking-tight">Smart Boli</span>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Live chunk detection
          </span>
        </div>
        <div className="mt-2 text-xs text-white/40 boli-item">
          1.5 s chunks &bull; 16 kHz &bull; 13 MFCC features &bull; Random Forest
        </div>

        <div className="flex items-center justify-between gap-2 boli-item">
          <button
            type="button"
            onClick={active ? stop : start}
            disabled={error.length > 0 && !active}
            className={`flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
              active
                ? "bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700"
                : "bg-white text-black shadow-lg shadow-white/20 hover:bg-gray-200"
            }`}
          >
            {active ? <StopCircle className="size-5" /> : <Play className="size-5" />}
            {active ? "Stop detection" : "Start detection"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 boli-item">
            {error}
          </div>
        )}

        <div className="mt-auto border-t border-white/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3">Session log</p>
          <div className="text-xs text-white/40 italic boli-item">Detection appears on screen</div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center text-center">
        <div className="relative z-10 px-8">
          <div className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm border ${
            fluent === null
              ? "border-white/20 bg-white/5 text-white/40"
              : fluent
                ? "border-green-500/50 bg-green-500/20 text-green-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                : "border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          }`}>
            {fluent === null ? "IDLE" : fluent ? "FLUENT" : "STUTTERED"}
          </div>
          <div className="text-[8xl] font-black tracking-tighter text-white sm:text-[10rem]">{label}</div>
          {confidence != null && (
            <p className="mt-4 text-lg text-white/60 font-medium">
              Confidence: {(confidence * 100).toFixed(1)}%
            </p>
          )}
          <p className="mt-3 text-sm text-white/40">
            {active ? "Listening — speak now…" : "Press start to begin live detection"}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-bold text-white/40 bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white/10">
          <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(14,165,230,0.6)]" : "bg-white/20"}`} />
          {active ? "LIVE · 1.5 s chunks" : "STANDBY"}
        </div>

        <div className="absolute bottom-6 left-6 right-6 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-white transition-[width] duration-100" style={{ width: levelBar }} />
        </div>
      </main>
    </div>
  );
}
