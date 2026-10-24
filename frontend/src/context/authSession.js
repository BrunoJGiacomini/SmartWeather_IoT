export const SESSION_KEY = "smartweather.session";

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readSession() {
  const storage = getStorage();
  if (!storage) return null;

  let raw;
  try {
    raw = storage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (!session || session.isAuthenticated !== true) return null;
    return session;
  } catch {
    // Corrupted payload: drop it and treat the visitor as anonymous.
    clearSession();
    return null;
  }
}

export function writeSession(role) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(
      SESSION_KEY,
      JSON.stringify({ isAuthenticated: true, role: role || null }),
    );
  } catch {
    // Storage unavailable (private mode, quota): the session stays in memory.
  }
}

export function clearSession() {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(SESSION_KEY);
  } catch {
    // Nothing else to do.
  }
}
