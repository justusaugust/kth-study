export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "kth-study-theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveInitialTheme(): Theme {
  const applied = document.documentElement.dataset.theme;
  if (isTheme(applied)) return applied;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // storage unavailable — fall through to the system preference
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme, options?: { persist?: boolean }) {
  document.documentElement.dataset.theme = theme;
  if (options?.persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage unavailable — the theme still applies for this visit
    }
  }
}
