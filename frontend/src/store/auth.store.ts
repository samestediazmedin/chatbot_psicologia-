import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { name: string; role: string } | null;
  setToken: (token: string | null) => void;
  setUser: (user: { name: string; role: string } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user })
}));
