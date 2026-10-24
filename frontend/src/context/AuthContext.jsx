import { useEffect, useState, useMemo } from "react";
import { AuthContext } from "./authContextObject.js";
import { clearSession, readSession, writeSession } from "./authSession.js";
import { readThemePreference, writeThemePreference } from "./themePreference.js";

const DEFAULT_ROLE = "Gestor Municipal";

function getInitialSession() {
  const stored = readSession();
  return {
    isAuthenticated: Boolean(stored),
    role: stored?.role || DEFAULT_ROLE,
  };
}

function getInitialTheme() {
  const preference = readThemePreference();
  if (preference === "dark" || preference === "light") return preference;
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getInitialSession);
  const [theme, setTheme] = useState(getInitialTheme);
  const { isAuthenticated, role } = session;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const login = (selectedRole) => {
    const nextRole = selectedRole || role || DEFAULT_ROLE;
    writeSession(nextRole);
    setSession({ isAuthenticated: true, role: nextRole });
  };

  const logout = () => {
    clearSession();
    setSession({ isAuthenticated: false, role: DEFAULT_ROLE });
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    writeThemePreference(next);
    setTheme(next);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      role,
      theme,
      login,
      logout,
      toggleTheme,
    }),
    [isAuthenticated, role, theme],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
