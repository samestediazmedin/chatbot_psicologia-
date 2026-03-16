import { apiClient } from "./apiClient";

export interface DashboardSummary {
  totalPatients: number;
  totalAppointments: number;
  highRiskAlerts: number;
  averages: {
    anxiety: number;
    depression: number;
    stress: number;
  };
}

export async function getDashboardSummary() {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary");
  return data;
}
