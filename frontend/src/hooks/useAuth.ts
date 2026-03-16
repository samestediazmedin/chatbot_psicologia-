import { useState } from "react";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const { token, user, setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await login(email, password);
      setToken(newToken);
      setUser({ name: email.split("@")[0], role: "Practicante" });
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return { token, user, login: handleLogin, logout, loading, error };
}
