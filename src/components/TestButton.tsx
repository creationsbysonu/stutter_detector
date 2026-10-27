import type { ReactElement } from "react";
import { Play } from "lucide-react";

interface TestButtonProps {
  onClick?: () => void;
}

export default function TestButton({ onClick }: TestButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-primary mt-8 w-full hover:scale-[1.02] active:scale-95"
      aria-label="Run test"
    >
      <Play className="mr-2 size-4" /> Run Full Test
    </button>
  );
}
