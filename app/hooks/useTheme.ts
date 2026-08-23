"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "../utils/constant";

export type Theme = "light" | "dark";

/**
 * The applied theme is already on <html> before hydration (see the bootstrap
 * script in layout.tsx). This hook only mirrors it into React state so the
 * toggle can render the right icon.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing modes can refuse writes; the theme still applies.
    }
    setTheme(next);
  }, []);

  const toggle = useCallback(
    () => apply(theme === "dark" ? "light" : "dark"),
    [apply, theme]
  );

  return { theme, setTheme: apply, toggle, mounted };
}
