import { Lottie } from "lottie-react";
import { type CSSProperties } from "react";

// Premium Lottie animation URLs (public, free)
export const LOTTIE_MIC = "https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json";
export const LOTTIE_AUDIO = "https://assets9.lottiefiles.com/packages/lf20_tut5d4yd.json";
export const LOTTIE_SUCCESS = "https://assets9.lottiefiles.com/packages/lf20_4k9y3xrh.json";
export const LOTTIE_LISTENING = "https://assets9.lottiefiles.com/packages/lf20_x1ed4y1k.json";

interface LottieAnimationProps {
  src: string;
  className?: string;
  speed?: number;
  loop?: boolean;
  style?: CSSProperties;
}

export function LottieAnimation({ src, className = "", speed = 1, loop = true, style }: LottieAnimationProps) {
  return (
    <Lottie
      className={className}
      src={src}
      speed={speed}
      loop={loop}
      style={style}
    />
  );
}
