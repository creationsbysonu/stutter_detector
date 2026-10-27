export interface Sample {
  t: number;
  rms: number;
}

export interface PauseEvent {
  start: number;
  duration: number;
}

export interface SpeechAnalysis {
  duration: number;
  speechSeconds: number;
  voicedRatio: number;
  pauseCount: number;
  longestPause: number;
  pauseRatio: number;
  averageVolume: number;
  rhythmVariability: number;
  pace: number | null;
  score: number;
  label: string;
  tone: "good" | "ok" | "warn";
  summary: string;
  tips: string[];
  threshold: number;
  pauses: PauseEvent[];
  samples: Sample[];
}

export type AnalysisResult =
  | { ok: true; analysis: SpeechAnalysis }
  | { ok: false; error: string };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const percentile = (values: number[], ratio: number) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = clamp(Math.floor(ratio * (sorted.length - 1)), 0, sorted.length - 1);
  return sorted[index];
};

const mean = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

const standardDeviation = (values: number[]) => {
  if (values.length < 2) return 0;
  const average = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

export function analyzeSpeech(
  samples: Sample[],
  wordCount: number,
  duration: number,
): AnalysisResult {
  if (samples.length < 12 || duration < 2) {
    return {
      ok: false,
      error: "That recording was too short. Please read for at least a few seconds.",
    };
  }

  const levels = samples.map((sample) => sample.rms);
  const peak = percentile(levels, 0.95);
  const noiseFloor = percentile(levels, 0.15);

  if (peak < 0.008) {
    return {
      ok: false,
      error:
        "We could not hear enough speech. Check that the right microphone is selected, move closer, and try again.",
    };
  }

  const threshold = clamp(
    Math.max(noiseFloor * 2.4, 0.006),
    0.006,
    Math.max(peak * 0.38, 0.008),
  );

  const intervals: number[] = [];
  for (let index = 1; index < samples.length; index += 1) {
    const gap = samples[index].t - samples[index - 1].t;
    if (gap > 0 && gap < 0.5) intervals.push(gap);
  }
  const frameInterval = intervals.length > 0 ? percentile(intervals, 0.5) : 0.05;

  const rawSegments: Array<{ start: number; end: number }> = [];
  let segmentStart: number | null = null;

  samples.forEach((sample, index) => {
    const isVoiced = sample.rms > threshold;
    if (isVoiced && segmentStart === null) {
      segmentStart = sample.t;
    }
    if (!isVoiced && segmentStart !== null) {
      rawSegments.push({
        start: segmentStart,
        end: samples[index - 1]?.t ?? sample.t,
      });
      segmentStart = null;
    }
  });
  if (segmentStart !== null) {
    rawSegments.push({
      start: segmentStart,
      end: samples[samples.length - 1].t,
    });
  }

  // Bridge tiny dips so natural consonants are not counted as pauses.
  const mergeGap = Math.max(0.18, frameInterval * 3);
  const segments: Array<{ start: number; end: number }> = [];
  rawSegments.forEach((segment) => {
    const previous = segments[segments.length - 1];
    if (previous && segment.start - previous.end <= mergeGap) {
      previous.end = segment.end;
    } else {
      segments.push({ ...segment });
    }
  });

  const usableSegments = segments.filter((segment) => segment.end - segment.start >= 0.08);

  if (usableSegments.length === 0) {
    return {
      ok: false,
      error:
        "We could not pick out any speech. Try speaking a little louder and check your microphone level.",
    };
  }

  const speechSeconds = usableSegments.reduce(
    (total, segment) => total + (segment.end - segment.start),
    0,
  );
  const spanStart = usableSegments[0].start;
  const spanEnd = usableSegments[usableSegments.length - 1].end;
  const speechSpan = Math.max(spanEnd - spanStart, speechSeconds);

  if (speechSeconds < 1.5) {
    return {
      ok: false,
      error: "We only detected a moment of speech. Please read the full passage and try again.",
    };
  }

  const pauses: PauseEvent[] = [];
  for (let index = 1; index < usableSegments.length; index += 1) {
    const gap = usableSegments[index].start - usableSegments[index - 1].end;
    if (gap >= 0.3) {
      pauses.push({ start: usableSegments[index - 1].end, duration: gap });
    }
  }

  const pauseTotal = pauses.reduce((total, pause) => total + pause.duration, 0);
  const longestPause = pauses.reduce(
    (longest, pause) => Math.max(longest, pause.duration),
    0,
  );
  const pauseRatio = clamp(pauseTotal / speechSpan, 0, 1);
  const voicedRatio = clamp(speechSeconds / Math.max(duration, 0.001), 0, 1);

  const segmentDurations = usableSegments.map((segment) => segment.end - segment.start);
  const segmentMean = mean(segmentDurations);
  const segmentVariation = segmentMean > 0 ? standardDeviation(segmentDurations) / segmentMean : 0;
  const voicedLevels = samples.filter((sample) => sample.rms > threshold).map((s) => s.rms);
  const levelMean = mean(voicedLevels);
  const levelVariation = levelMean > 0 ? standardDeviation(voicedLevels) / levelMean : 0;
  const rhythmVariability = clamp(segmentVariation * 0.7 + levelVariation * 0.3, 0, 1.5);

  const pace =
    wordCount > 0 && speechSeconds > 0
      ? Math.round(wordCount / (speechSeconds / 60))
      : null;

  let score = 100;
  score -= Math.min(pauseRatio * 55, 26);
  score -= Math.min(pauses.length * 0.8, 8);
  score -= Math.min(rhythmVariability * 10, 11);
  score -= Math.min(Math.max(longestPause - 2.5, 0) * 3, 8);

  if (pace !== null) {
    if (pace < 95) score -= Math.min((95 - pace) * 0.35, 12);
    if (pace > 200) score -= Math.min((pace - 200) * 0.3, 10);
  }
  if (voicedRatio < 0.45) score -= Math.min((0.45 - voicedRatio) * 30, 8);

  score = Math.round(clamp(score, 28, 99));

  const label =
    score >= 88
      ? "Smooth and steady"
      : score >= 74
        ? "Mostly fluent"
        : score >= 60
          ? "Some interruptions"
          : score >= 45
            ? "Frequent pauses"
            : "Lots of interruptions";

  const tone: SpeechAnalysis["tone"] =
    score >= 74 ? "good" : score >= 55 ? "ok" : "warn";

  const summary =
    tone === "good"
      ? "Your reading had a comfortable flow with only brief breaks. Keep this steady rhythm as your baseline."
      : tone === "ok"
        ? "Your delivery was understandable, with a few pauses or changes in rhythm that broke the flow. A little practice with phrasing can help."
        : "There were several long breaks or uneven phrases in this recording. Short, planned pauses at punctuation will make the delivery easier to follow than sudden stops.";

  const tips: string[] = [];
  if (pauseRatio > 0.2) {
    tips.push(
      "Plan your pauses at commas and full stops. A breath taken before a phrase feels intentional; a stop in the middle of one feels like a block.",
    );
  }
  if (longestPause > 2) {
    tips.push(
      `Your longest silence was ${longestPause.toFixed(1)}s. When you feel a block coming, gently stretch the first sound of the next word instead of stopping completely.`,
    );
  }
  if (rhythmVariability > 0.65) {
    tips.push(
      "Group four to six words into one smooth phrase, then pause briefly. Even phrasing is easier to follow than a stop-start rhythm.",
    );
  }
  if (pace !== null && pace > 190) {
    tips.push(
      `You were speaking at about ${pace} words per minute. Slow down by roughly ten percent and let your jaw stay relaxed.`,
    );
  }
  if (pace !== null && pace < 95) {
    tips.push(
      `Your speaking pace was about ${pace} words per minute. Try moving through the passage a little more freely rather than sounding out each word.`,
    );
  }
  if (voicedRatio < 0.55) {
    tips.push(
      "Aim to keep your voice active through the phrase. Quiet gaps between words are where listeners often hear hesitation.",
    );
  }
  tips.push(
    "Read the same passage once more and compare. Repeating familiar text reduces the mental load and lets you focus on rhythm.",
  );

  return {
    ok: true,
    analysis: {
      duration,
      speechSeconds,
      voicedRatio,
      pauseCount: pauses.length,
      longestPause,
      pauseRatio,
      averageVolume: levelMean,
      rhythmVariability,
      pace,
      score,
      label,
      tone,
      summary,
      tips: tips.slice(0, 4),
      threshold,
      pauses,
      samples,
    },
  };
}
