"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "woodtag-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always starts "light" so the first client render matches the
  // server-rendered HTML exactly. The inline head script (see layout.tsx)
  // already applies the real theme class to <html> before hydration to
  // avoid a visual flash; this state is synced to match immediately after
  // mount, which is the standard hydration-safe pattern for reading
  // browser-only storage.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Reading the DOM/storage on mount to avoid an SSR hydration mismatch
    // is exactly the "sync with an external system" case this lint rule
    // exists to allow — see the rule's own message.
    if (document.documentElement.classList.contains("dark")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore write failures (private mode, etc.)
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
