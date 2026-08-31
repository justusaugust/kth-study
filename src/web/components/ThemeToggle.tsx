import { useState } from "react";
import { applyTheme, resolveInitialTheme, type Theme } from "../theme";
import { StudyIcon } from "./StudyMark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = resolveInitialTheme();
    applyTheme(initial);
    return initial;
  });
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    /* Suppress every transition for the frame the palette flips. */
    document.documentElement.classList.add("theme-switching");
    applyTheme(next, { persist: true });
    setTheme(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-switching");
      });
    });
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next} theme`}
      onClick={toggle}
    >
      <span className="theme-toggle__icons" aria-hidden="true">
        <span className="theme-toggle__icon" data-active={next === "dark" || undefined}>
          <StudyIcon kind="theme-dark" />
        </span>
        <span
          className="theme-toggle__icon"
          data-active={next === "light" || undefined}
        >
          <StudyIcon kind="theme-light" />
        </span>
      </span>
      {next === "dark" ? "Mörk" : "Ljus"}
    </button>
  );
}
