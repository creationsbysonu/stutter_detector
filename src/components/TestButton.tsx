import { FC } from "react";
import { XMark } from "lucide-react";

export default function TestButton(): JSX.Element {
  return (
    <button
      className="w-full btn btn-primary mt-8 hover:scale-[1.02] active:scale-95"
      aria-label="Run test"
    >
      <XMark className="size-4 mr-2" /> Run Full Test
    </button>
  );
}
