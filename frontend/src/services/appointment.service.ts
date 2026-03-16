import { apiClient } from "./apiClient";

export interface AppointmentSummary {
  id: string;
  scheduledAt: string;
  status: string;
  patient: { id?: string; name: string };
  practitioner: { id?: string; name: string };
  consultingRoom: { id: string; name: string } | null;
  timeframe: string;
}

export async function getAppointments(date?: string) {
  const params = date ? { params: { date } } : undefined;
  const { data } = await apiClient.get<AppointmentSummary[]>("/appointments", params);
  return data;
}
