import { apiClient } from "./apiClient";

interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  return data;
}
