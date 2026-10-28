import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative group flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] dark:bg-black/5 backdrop-blur-sm transition-all duration-300 hover:bg-[color:var(--surface-2)] dark:hover:bg-black/10 hover:scale-110 active:scale-95 ${className ?? ""}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[color:var(--ink)] dark:text-white" strokeWidth={2.5} />
      ) : (
        <Sun className="w-5 h-5 text-[color:var(--ink)] dark:text-white" strokeWidth={2.5} />
      )}
    </button>
  );
}
