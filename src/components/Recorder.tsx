import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ClipboardCheck,
  Copy,
  Mic,
  RotateCcw,
  ShieldCheck,
  Square,
  Timer,
  Volume2,
} from "lucide-react";
import type { Passage } from "../data/passages";
import { analyzeSpeech, type Sample, type SpeechAnalysis } from "../lib/analysis";

type Phase = "idle" | "starting" | "recording" | "analyzing" | "results";

const BAR_COUNT = 150;

const formatClock = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
};

const drawWave = (canvas: HTMLCanvasElement | null, samples: Sample[]) => {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  context.strokeStyle = "rgba(148, 163, 184, 0.15)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  const visible = samples.slice(-BAR_COUNT);
  if (visible.length === 0) return;

  const step = width / BAR_COUNT;
  const barWidth = Math.max(2, step * 0.58);

  visible.forEach((sample, index) => {
    const amplitude = Math.min(1, sample.rms * 5.5);
    const barHeight = Math.max(2, amplitude * height * 0.86);
    const x = index * step + (step - barWidth) / 2;
    const y = (height - barHeight) / 2;

    context.fillStyle =
      amplitude > 0.55 ? "rgba(34, 211, 238, 0.9)" : "rgba(34, 211, 238, 0.45)";
    context.beginPath();
    context.roundRect(x, y, barWidth, barHeight, barWidth / 2);
    context.fill();
  });
};

const scoreColor = (tone: SpeechAnalysis["tone"]) =>
  tone === "good" ? "#10b981" : tone === "ok" ? "#f59e0b" : "#ef4444";

const scoreBg = (tone: SpeechAnalysis["tone"]) =>
  tone === "good"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : tone === "ok"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
      : "border-rose-500/30 bg-rose-500/10 text-rose-400";

function ScoreRing({ score, tone }: { score: number; tone: SpeechAnalysis["tone"] }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 110 110" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="white/10" strokeWidth="8" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={scoreColor(tone)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{
            boxShadow: `0 0 30px ${scoreColor(tone)}40`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
          / 100
        </span>
      </div>
    </div>
  );
}

function WaveTimeline({ analysis }: { analysis: SpeechAnalysis }) {
  const bucketCount = 110;
  const samples = analysis.samples;
  const buckets: number[] = [];

  for (let index = 0; index < bucketCount; index += 1) {
    const start = Math.floor((index / bucketCount) * samples.length);
    const end = Math.max(start + 1, Math.floor(((index + 1) / bucketCount) * samples.length));
    const slice = samples.slice(start, end);
    buckets.push(slice.length > 0 ? Math.max(...slice.map((sample) => sample.rms)) : 0);
  }

  const maxLevel = Math.max(...buckets, 0.001);

  return (
    <div>
      <div className="flex h-16 items-center gap-[2px] rounded-xl bg-white/5 px-2.5 border border-white/10">
        {buckets.map((level, index) => {
          const height = Math.max(4, (level / maxLevel) * 100);
          const voiced = level > analysis.threshold;
          return (
            <span
              key={index}
              className={`flex-1 rounded-full transition-all duration-100 ${
                voiced ? "bg-cyan-500" : "bg-white/20"
              }`}
              style={{
                height: `${height}%`,
                opacity: voiced ? 0.9 : 0.4,
                boxShadow: voiced ? `0 0 12px rgba(34, 211, 238, ${0.4 + height / 200})` : "none",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-white/50">
        <span>0s</span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-cyan-500" /> voice
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-white/20" /> silence / pause
          </span>
        </span>
        <span>{analysis.duration.toFixed(1)}s</span>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="field-label">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] leading-snug text-white/40">{hint}</p>}
    </div>
  );
}

export default function Recorder({ passage }: { passage: Passage }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const analysisTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const samplesRef = useRef<Sample[]>([]);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const mountedRef = useRef(true);

  const clearTimers = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (analysisTimerRef.current !== null) window.clearTimeout(analysisTimerRef.current);
    rafRef.current = null;
    timerRef.current = null;
    analysisTimerRef.current = null;
  };

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
      releaseStream();
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError("");
    setAnalysis(null);
    setCopied(false);
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setPhase("starting");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error("unsupported");
      }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      if (audioContext.state === "suspended") await audioContext.resume();

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.55;
      source.connect(analyser);

      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const mimeType = preferredTypes.find(
        (type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type),
      );
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        if (mountedRef.current) setAudioUrl(url);
      };

      recorder.start(100);

      samplesRef.current = [];
      startedAtRef.current = performance.now();
      setElapsed(0);
      setLevel(0);
      setPhase("recording");

      timerRef.current = window.setInterval(() => {
        setElapsed((performance.now() - startedAtRef.current) / 1000);
      }, 100);

      const buffer = new Uint8Array(analyser.fftSize);
      let lastSampleAt = 0;
      let levelTick = 0;

      const loop = () => {
        analyser.getByteTimeDomainData(buffer);
        let sum = 0;
        for (let index = 0; index < buffer.length; index += 1) {
          const value = (buffer[index] - 128) / 128;
          sum += value * value;
        }
        const rms = Math.sqrt(sum / buffer.length);
        const now = (performance.now() - startedAtRef.current) / 1000;

        if (now - lastSampleAt >= 0.05) {
          samplesRef.current.push({ t: now, rms });
          lastSampleAt = now;
        }

        drawWave(canvasRef.current, samplesRef.current);

        levelTick += 1;
        if (levelTick % 6 === 0) setLevel(rms);

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    } catch (cause) {
      clearTimers();
      releaseStream();
      setPhase("idle");

      const name = cause instanceof DOMException ? cause.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError(
          "Microphone permission was blocked. Allow microphone access for this site in your browser settings, then try again.",
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone was found. Connect a microphone and check your system input settings.");
      } else if (name === "NotReadableError") {
        setError("The microphone is busy in another app. Close other recording apps and try again.");
      } else {
        setError(
          "We could not start recording. Make sure you are on a secure (https) connection and that a microphone is available.",
        );
      }
    }
  };

  const stopAndAnalyze = () => {
    if (phase !== "recording") return;

    const duration = Math.max((performance.now() - startedAtRef.current) / 1000, 0.1);
    const captured = [...samplesRef.current];

    clearTimers();
    setPhase("analyzing");

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Recorder may already be stopping.
      }
    }

    releaseStream();
    setLevel(0);

    const result = analyzeSpeech(captured, passage.words, duration);

    analysisTimerRef.current = window.setTimeout(() => {
      analysisTimerRef.current = null;
      if (!mountedRef.current) return;
      if (result.ok) {
        setAnalysis(result.analysis);
        setPhase("results");
      } else {
        setError(result.error);
        setPhase("idle");
      }
    }, 750);
  };

  const cancelRecording = () => {
    clearTimers();
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        // Ignore stop errors while cancelling.
      }
    }
    recorderRef.current = null;
    releaseStream();
    samplesRef.current = [];
    chunksRef.current = [];
    setElapsed(0);
    setLevel(0);
    setPhase("idle");
    drawWave(canvasRef.current, []);
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAnalysis(null);
    setError("");
    setElapsed(0);
    setLevel(0);
    setCopied(false);
    samplesRef.current = [];
    setPhase("idle");
    drawWave(canvasRef.current, []);
  };

  const copySummary = async () => {
    if (!analysis) return;
    const lines = [
      `Smart Boli — ${passage.title}`,
      `Fluency score: ${analysis.score}/100 (${analysis.label})`,
      `Pace: ${analysis.pace ?? "—"} wpm`,
      `Pauses: ${analysis.pauseCount} (longest ${analysis.longestPause.toFixed(1)}s)`,
      `Speech time: ${analysis.speechSeconds.toFixed(1)}s`,
      "Browser-based practice insight, not a clinical assessment.",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copying is not available in this browser.");
    }
  };

  const rhythmLabel = analysis
    ? analysis.rhythmVariability < 0.45
      ? "Steady"
      : analysis.rhythmVariability < 0.8
        ? "Varying"
        : "Uneven"
    : "—";

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Mic className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Your recording</p>
            <p className="text-xs text-white/40">
              {phase === "results" ? "Session complete" : `${passage.title} · ${passage.words} words`}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
            phase === "recording"
              ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : phase === "analyzing"
                ? "bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                : phase === "results"
                  ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              phase === "recording"
                ? "animate-pulse bg-red-600"
                : phase === "analyzing"
                  ? "animate-pulse bg-amber-600"
                  : phase === "results"
                    ? "bg-emerald-600"
                    : "bg-white/20"
            }`}
          />
          {phase === "recording"
            ? "Recording"
            : phase === "analyzing"
              ? "Analyzing"
              : phase === "results"
                ? "Complete"
                : "Ready"}
        </span>
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-400" />
            <p>{error}</p>
          </div>
        )}

        {phase === "results" && analysis ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
              <ScoreRing score={analysis.score} tone={analysis.tone} />
              <div className="text-center sm:text-left">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${scoreBg(
                    analysis.tone,
                  )}`}
                >
                  {analysis.label}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{analysis.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Metric
                label="Pace"
                value={analysis.pace !== null ? `${analysis.pace} wpm` : "—"}
                hint="while speaking"
              />
              <Metric label="Speech" value={`${analysis.speechSeconds.toFixed(1)}s`} hint="voiced time" />
              <Metric label="Pauses" value={String(analysis.pauseCount)} hint="0.3s or longer" />
              <Metric
                label="Longest"
                value={`${analysis.longestPause.toFixed(1)}s`}
                hint="single pause"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  <Volume2 className="size-4 text-cyan-400" /> Rhythm
                </span>
                <span className="text-sm font-bold text-white">{rhythmLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  <Timer className="size-4 text-cyan-400" /> Speaking
                </span>
                <span className="text-sm font-bold text-white">
                  {Math.round(analysis.voicedRatio * 100)}%
                </span>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Session timeline
                </p>
                <span className="text-[10px] text-white/30">browser energy analysis</span>
              </div>
              <WaveTimeline analysis={analysis} />
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Practice suggestions
              </p>
              <ul className="mt-3 space-y-3">
                {analysis.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {audioUrl && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
                  Replay your recording
                </p>
                <audio controls src={audioUrl} className="h-10 w-full rounded-lg" />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="btn-primary">
                <RotateCcw className="size-4" /> Take the test again
              </button>
              <button type="button" onClick={copySummary} className="btn-ghost">
                {copied ? <ClipboardCheck className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy summary"}
              </button>
            </div>

            <p className="text-[10px] leading-relaxed text-white/40">
              This is a practice insight based on timing and energy, not a diagnosis.
              Stuttering is a complex speech condition; only a qualified speech-language
              professional can assess it.
            </p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <canvas
                ref={canvasRef}
                className="h-28 w-full"
                aria-label="Live microphone waveform"
                role="img"
              />
              {phase === "idle" && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <Mic className="size-5" />
                  </span>
                  <p className="text-sm font-semibold text-white">
                    Your waveform will appear here
                  </p>
                  <p className="text-xs text-white/40">Microphone access is requested only when you start.</p>
                </div>
              )}
              {phase === "analyzing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 backdrop-blur-sm">
                  <span className="size-6 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                  <p className="text-sm font-semibold text-white">
                    Analyzing pace, pauses, and rhythm…
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="field-label">
                  {phase === "recording" ? "Elapsed time" : "Ready when you are"}
                </p>
                <p className="text-[3rem] font-extrabold tabular-nums tracking-tight text-white">
                  {formatClock(elapsed)}
                </p>
              </div>
              <div className="w-32">
                <p className="mb-1.5 text-right text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Input level
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-[width] duration-100 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                    style={{ width: `${Math.min(100, Math.round(level * 450))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {phase === "idle" && (
                <button type="button" onClick={startRecording} className="btn-primary flex-1">
                  <Mic className="size-4" /> Start recording
                </button>
              )}
              {phase === "starting" && (
                <button type="button" disabled className="btn-primary flex-1">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Requesting microphone…
                </button>
              )}
              {phase === "recording" && (
                <>
                  <button
                    type="button"
                    onClick={stopAndAnalyze}
                    disabled={elapsed < 3}
                    className="btn-primary flex-1"
                  >
                    <Square className="size-3.5 fill-current" />
                    {elapsed < 3 ? "Keep reading…" : "Finish & analyze"}
                  </button>
                  <button type="button" onClick={cancelRecording} className="btn-ghost">
                    Cancel
                  </button>
                </>
              )}
              {phase === "analyzing" && (
                <button type="button" disabled className="btn-primary flex-1">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing…
                </button>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-[10px] leading-relaxed text-white/40">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-cyan-400" />
              <p>
                Audio is processed locally in this browser and is not uploaded or stored.
                Read at your own pace; there is no time limit.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
