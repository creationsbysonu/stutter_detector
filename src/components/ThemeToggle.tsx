import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { gsap } from "gsap";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    gsap.from(".theme-toggle-ring", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative group theme-toggle-ring flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95 ${className ?? ""}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "light"
            ? "opacity-0 scale-0 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        }`}
        strokeWidth={2.5}
      />
      <Sun
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "light"
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-0 rotate-90"
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
}
