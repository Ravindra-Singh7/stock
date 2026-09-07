import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthUserId } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "stockit-auth-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setAuthUserId(parsed.id);
    }
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      async login(payload) {
        const response = await api.login(payload);
        setUser(response.user);
        setAuthUserId(response.user.id);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
        return response.user;
      },
      async register(payload) {
        const response = await api.register(payload);
        setUser(response.user);
        setAuthUserId(response.user.id);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
        return response.user;
      },
      logout() {
        setUser(null);
        setAuthUserId(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
