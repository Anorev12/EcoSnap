import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    // Restore saved preference on page load
    return localStorage.getItem("ecosnap-theme") || "light";
  });

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    // Persist to localStorage whenever theme changes
    localStorage.setItem("ecosnap-theme", theme);

    // Toggle the CSS class on <html> so your CSS variables kick in
    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [theme, resolvedTheme]);

  const setTheme = (next) => setThemeState(next); // "light" | "dark" | "system"

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}