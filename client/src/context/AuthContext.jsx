import { createContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (mounted) {
          setToken(session.token);
          setUser(session.user);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initialize();

    const { data: subscription } = authService.onAuthStateChange((session) => {
      setToken(session.token);
      setUser(session.user);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const data = await authService.updateProfile(payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      updateProfile,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}