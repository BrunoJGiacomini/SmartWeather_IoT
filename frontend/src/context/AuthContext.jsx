import { useEffect, useState, useMemo } from "react";
import { AuthContext } from "./authContextObject.js";

const DEFAULT_ROLE = "Gestor Municipal";

function getInitialTheme() {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const login = (selectedRole) => {
    if (selectedRole) setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(DEFAULT_ROLE);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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