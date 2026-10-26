import { ReactElement } from "react";

export const lottieAnimations = {
  pulse: "/assets/lottie/pulse.json",
  success: "/assets/lottie/success.json",
  listening: "/assets/lottie/listening.json",
};

interface LottieMarkProps {
  animation?: keyof typeof lottieAnimations;
  className?: string;
}

export default function LottieMark({
  animation = "pulse",
  className,
}: LottieMarkProps): ReactElement {
  return <div className={className} aria-hidden="true" data-animation={animation} />;
}
