import { useEffect, useRef, useState } from "react";
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

  const release = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch { /* noop */ } }
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
    const mime = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

    recorder.onstop = async () => {
      if (!active) return;
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      chunksRef.current = [];
      await sendBlob(blob);
      if (active) timerRef.current = setTimeout(() => startSegment(), 50);
    };
    recorder.onerror = () => { setError("Microphone recording error."); stop(); };

    try { recorder.start(200); } catch { setError("Could not start recording segment."); stop(); }

    timerRef.current = setTimeout(() => { try { recorder.stop(); } catch { /* noop */ } }, CHUNK_SECONDS * 1000);
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
          // Supabase save is non-fatal; prediction already shown.
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
      if (name === "NotAllowedError" || name === "SecurityError") setError("Microphone permission was blocked. Allow mic access and retry.");
      else if (name === "NotFoundError") setError("No microphone found.");
      else setError("Could not start microphone.");
    }
  };

  const stop = () => {
    setActive(false);
    release();
    setLabel("READY");
    setFluent(null);
  };

  useEffect(() => {
    // Animate screen color on state change
    if (screenRef.current && fluent !== null) {
      const target = fluent ? "#10b981" : "#ef4444";
      gsap.to(screenRef.current, { backgroundColor: target, duration: 0.4, ease: "power2.inOut" });
      gsap.to(screenRef.current.querySelectorAll(".state-text"), { color: "#ffffff", duration: 0.4 });
    }
    return () => { release(); };
  }, [fluent]);

  const levelBar = `${Math.min(100, Math.round(levelRef.current * 500))}%`;

  return (
    <div ref={screenRef} className="fixed inset-0 z-[60] flex flex-col sm:flex-row bg-white transition-colors duration-500">
      <aside className="w-full sm:w-80 border-r border-gray-200 bg-gray-50 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Mic className="size-5 text-black" />
          <span className="font-bold text-black text-lg tracking-tight">Smart Boli</span>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-gray-500">Nepali stutter detection</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">1.5 s chunks &bull; 16 kHz &bull; 13 MFCC features &bull; Random Forest</div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={active ? stop : start}
            disabled={error.length > 0 && !active}
            className={`flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              active
                ? "bg-red-600 text-white shadow-lg shadow-red-900/20 hover:bg-red-700"
                : "bg-black text-white shadow-lg hover:bg-gray-900"
            }`}
          >
            {active ? <StopCircle className="size-4" /> : <Play className="size-4" />}
            {active ? "Stop detection" : "Start detection"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
        )}

        <div className="mt-auto border-t border-gray-200 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Live chunks</p>
          <div className="text-xs text-gray-500 italic">Detection appears on screen</div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center text-center">
        <div className="relative z-10 px-6">
          <div className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm ${
            fluent === null ? "border-gray-300 bg-gray-100 text-gray-600" : fluent ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {fluent === null ? "IDLE" : fluent ? "FLUENT" : "STUTTERED"}
          </div>
          <div className="text-9xl font-black tracking-tighter text-black sm:text-[10rem]">{label}</div>
          {confidence != null && (
            <p className="mt-3 text-lg text-gray-600 font-medium">Confidence: {(confidence * 100).toFixed(1)}%</p>
          )}
          <p className="mt-2 text-sm text-gray-500">{active ? "Listening — speak in Nepali…" : "Press start to begin live detection"}</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200">
          <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-black animate-pulse" : "bg-gray-400"}`} />
          {active ? "LIVE · 1.5 s chunks" : "STANDBY"}
        </div>

        <div className="absolute bottom-4 left-4 right-4 h-1 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-black transition-[width] duration-100" style={{ width: levelBar }} />
        </div>
      </main>
    </div>
  );
}
