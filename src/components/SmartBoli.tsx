import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Mic, Play, Square } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { LottieAnimation } from "../lib/animations";
import { useScrollLock } from "../lib/scroll";

const API_BASE = (
  (import.meta as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_BASE_URL ?? ""
) as string;
const PREDICT_URL = `${API_BASE.replace(/\/$/, "")}/predict`;
const WARMUP_URL = `${API_BASE.replace(/\/$/, "")}/warmup`;
const CHUNK_SECONDS = 1.5;
const BACKEND_CONFIGURED = Boolean(API_BASE);

interface Prediction {
  label: string;
  fluent: boolean;
  confidence: number | null;
}

interface LogEntry {
  id: number;
  at: string;
  label: string;
  fluent: boolean;
  confidence: number | null;
}

type SmartBoliProps = { language: string; onBack: () => void };

const settings = [
  { label: "Chunk duration", value: `${CHUNK_SECONDS}s` },
  { label: "Sample rate", value: "16 kHz" },
  { label: "MFCC features", value: "13" },
  { label: "Model", value: "Random Forest" },
];

export default function SmartBoli({ language, onBack }: SmartBoliProps) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("READY");
  const [fluent, setFluent] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const levelBarRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const logIdRef = useRef(0);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  useScrollLock(true);

  useEffect(() => {
    gsap.from(".boli-item", {
      y: 26,
      opacity: 0,
      duration: 0.6,
      stagger: 0.07,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!BACKEND_CONFIGURED) {
      setError(
        "Backend not configured. Set VITE_API_BASE_URL to your deployed Smart Boli API.",
      );
    }
  }, []);

  const release = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    chunksRef.current = [];
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
    if (colorTweenRef.current) {
      colorTweenRef.current.kill();
      colorTweenRef.current = null;
    }
    if (ringRef.current) gsap.killTweensOf(ringRef.current);
  };

  /** Real mic level meter via WebAudio analyser. */
  const startLevelMeter = (stream: MediaStream) => {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;
    if (audioContext.state === "suspended") void audioContext.resume();

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);

    const buffer = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(buffer);
      let sum = 0;
      for (let index = 0; index < buffer.length; index += 1) {
        const value = (buffer[index] - 128) / 128;
        sum += value * value;
      }
      const rms = Math.sqrt(sum / buffer.length);
      if (levelBarRef.current) {
        levelBarRef.current.style.width = `${Math.min(100, Math.round(rms * 480))}%`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
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
    const recorder = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      if (!active) return;
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
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

    /* Chunk progress ring — fills over each 1.5s window */
    if (ringRef.current) {
      gsap.fromTo(
        ringRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: CHUNK_SECONDS,
          ease: "none",
          overwrite: true,
        },
      );
    }

    timerRef.current = setTimeout(() => {
      try {
        recorder.stop();
      } catch {
        /* noop */
      }
    }, CHUNK_SECONDS * 1000);
  };

  const sendBlob = async (blob: Blob) => {
    const form = new FormData();
    form.append("file", blob, "chunk.webm");
    const attempt = async (warmFirst: boolean) => {
      if (warmFirst) {
        try {
          await fetch(WARMUP_URL);
        } catch {
          /* ignore warmup failure */
        }
      }
      const res = await fetch(PREDICT_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Backend ${res.status}`);
      const data = (await res.json()) as Prediction;
      setLabel(data.label);
      setFluent(data.fluent);
      setConfidence(data.confidence ?? null);
      setError("");

      logIdRef.current += 1;
      const entry: LogEntry = {
        id: logIdRef.current,
        at: new Date().toLocaleTimeString([], {
          minute: "2-digit",
          second: "2-digit",
        }),
        label: data.label,
        fluent: data.fluent,
        confidence: data.confidence ?? null,
      };
      setLog((previous) => [entry, ...previous].slice(0, 20));

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
    } catch {
      try {
        await attempt(true);
      } catch (cause2) {
        setError(
          `Prediction failed: ${cause2 instanceof Error ? cause2.message : String(cause2)}`,
        );
      }
    }
  };

  const start = async () => {
    setError("");
    if (!BACKEND_CONFIGURED) {
      setError("Backend not configured. Please contact support.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      startLevelMeter(stream);
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
    if (levelBarRef.current) levelBarRef.current.style.width = "0%";
  };

  useEffect(() => {
    return () => {
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Screen ambience: green pulse when fluent, red when stuttered */
  useEffect(() => {
    if (!screenRef.current || fluent === null) return;
    const target = fluent ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";
    colorTweenRef.current = gsap.to(screenRef.current, {
      backgroundColor: target,
      duration: 0.35,
      ease: "power2.inOut",
    });
    return () => {
      if (colorTweenRef.current) {
        colorTweenRef.current.kill();
        colorTweenRef.current = null;
      }
    };
  }, [fluent]);

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-[color:var(--bg)]"
      role="dialog"
      aria-modal="true"
      aria-label="Live stutter detection"
    >
      <div ref={screenRef} className="absolute inset-0 transition-colors" aria-hidden="true" />

      {/* Top bar */}
      <header className="boli-item relative z-10 flex items-center justify-between border-b border-[color:var(--line)] px-5 py-4 backdrop-blur-xl sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost !px-4 !py-2 text-xs"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full border border-[color:var(--line-strong)]">
            <Mic className="size-3.5 text-[color:var(--accent)]" />
          </span>
          <div className="leading-none">
            <span className="block text-[13px] font-extrabold tracking-tight">
              Live detection
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              {language} · {CHUNK_SECONDS}s chunks
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em]">
          <span
            className={`size-1.5 rounded-full ${
              active
                ? "animate-pulse bg-[color:var(--fluent)] shadow-[0_0_10px_var(--fluent)]"
                : "bg-[color:var(--ink-faint)]"
            }`}
          />
          {active ? "Listening" : "Standby"}
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left rail */}
        <aside className="boli-item hidden w-80 shrink-0 flex-col justify-between border-r border-[color:var(--line)] p-7 lg:flex">
          <div>
            <p className="field-label">Detection settings</p>
            <div className="mt-5 space-y-2.5">
              {settings.map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between rounded-xl border border-[color:var(--line)] px-4 py-3"
                >
                  <span className="text-xs text-[color:var(--ink-muted)]">
                    {setting.label}
                  </span>
                  <span className="font-mono text-xs font-bold">{setting.value}</span>
                </div>
              ))}
            </div>

            <p className="field-label mt-9">Session log</p>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto no-scrollbar">
              {log.length === 0 && (
                <p className="text-xs italic text-[color:var(--ink-faint)]">
                  Chunk verdicts appear here…
                </p>
              )}
              {log.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] px-3.5 py-2.5 text-xs backdrop-blur-md"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`size-1.5 rounded-full ${
                        entry.fluent ? "bg-[color:var(--fluent)]" : "bg-[color:var(--stutter)]"
                      }`}
                    />
                    <span className="font-bold tabular-nums text-[color:var(--ink-faint)]">
                      {entry.at}
                    </span>
                  </span>
                  <span
                    className={`font-bold ${
                      entry.fluent ? "text-[color:var(--fluent)]" : "text-[color:var(--stutter)]"
                    }`}
                  >
                    {entry.label}
                    {entry.confidence != null &&
                      ` · ${(entry.confidence * 100).toFixed(0)}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={active ? stop : start}
            className={`btn w-full ${active ? "bg-[color:var(--stutter)] text-white" : "btn-primary"}`}
          >
            {active ? <Square className="size-4 fill-current" /> : <Play className="size-4" />}
            {active ? "Stop detection" : "Start detection"}
          </button>
        </aside>

        {/* Stage */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div
            className={`boli-item inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[11px] font-bold uppercase tracking-mega backdrop-blur-md transition-all duration-300 ${
              fluent === null
                ? "border-[color:var(--line-strong)] text-[color:var(--ink-faint)]"
                : fluent
                  ? "border-[color:var(--fluent)]/50 bg-[color:var(--fluent)]/10 text-[color:var(--fluent)] shadow-[0_0_40px_-8px_var(--fluent)]"
                  : "border-[color:var(--stutter)]/50 bg-[color:var(--stutter)]/10 text-[color:var(--stutter)] shadow-[0_0_40px_-8px_var(--stutter)]"
            }`}
          >
            {fluent === null ? "Idle" : fluent ? "Fluent" : "Stuttered"}
          </div>

          <div className="boli-item mt-8 text-[clamp(4rem,16vw,10rem)] font-extrabold leading-none tracking-[-0.05em]">
            {label}
          </div>

          {confidence != null && (
            <p className="boli-item mt-4 text-lg font-semibold text-[color:var(--ink-muted)]">
              confidence {(confidence * 100).toFixed(1)}%
            </p>
          )}

          <div className="boli-item mt-10 w-full max-w-md">
            <LottieAnimation
              name="waveform"
              className={`h-16 w-full transition-opacity duration-500 ${
                active ? "opacity-100" : "opacity-25"
              }`}
              speed={active ? 1.4 : 0.5}
            />
            <p className="mt-3 text-xs text-[color:var(--ink-faint)]">
              {active
                ? "Listening — keep reading the passage aloud…"
                : "Press start to begin live chunk detection"}
            </p>
          </div>

          {/* Chunk progress + input level */}
          <div className="boli-item mt-9 w-full max-w-md space-y-2.5">
            <div className="h-1 overflow-hidden rounded-full bg-[color:var(--line)]">
              <div
                ref={ringRef}
                className="h-full w-full origin-left rounded-full bg-[color:var(--accent)]"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              <span>Chunk window · {CHUNK_SECONDS}s</span>
              <span>Input level</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[color:var(--line)]">
              <div
                ref={levelBarRef}
                className="h-full w-0 rounded-full bg-[color:var(--ink)] transition-[width] duration-100"
              />
            </div>
          </div>

          {error && (
            <div className="boli-item mt-8 max-w-md rounded-2xl border border-[color:var(--stutter)]/30 bg-[color:var(--stutter)]/10 px-5 py-4 text-sm text-[color:var(--stutter)]">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={active ? stop : start}
            className={`boli-item btn mt-8 lg:hidden ${active ? "bg-[color:var(--stutter)] text-white" : "btn-primary"}`}
          >
            {active ? <Square className="size-4 fill-current" /> : <Play className="size-4" />}
            {active ? "Stop detection" : "Start detection"}
          </button>
        </main>
      </div>
    </div>
  );
}
