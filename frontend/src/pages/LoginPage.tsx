import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("practicante@iudc.edu.co");
  const [password, setPassword] = useState("psico123");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-night via-slate-900 to-ocean px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-3xl bg-white/90 p-8 shadow-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-night/50">Acceso seguro</p>
          <h1 className="text-2xl font-semibold text-night">Dashboard ChatBot Psico</h1>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-night/70">
            Correo institucional
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-night/10 bg-white px-3 py-2 text-night focus:border-ocean focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm text-night/70">
            Contraseña
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-night/10 bg-white px-3 py-2 text-night focus:border-ocean focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-night px-4 py-2 text-sand transition hover:bg-night/90 disabled:opacity-50"
        >
          {loading ? "Validando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
