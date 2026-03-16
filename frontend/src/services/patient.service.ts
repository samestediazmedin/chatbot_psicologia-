import { apiClient } from "./apiClient";

export interface PatientSummary {
  id: string;
  name: string;
  whatsappNumber: string;
  state: string;
  flow: string;
  helpStage: number;
  practitioner?: { id: string; name: string | null } | null;
  lastMetric?: {
    risk?: string;
    anxiety?: number;
    depression?: number;
    stress?: number;
    createdAt: string;
  } | null;
  updatedAt: string;
}

export interface PatientDetail extends PatientSummary {
  availability: Record<string, string[]>;
  appointments: Array<any>;
  evaluations: Array<any>;
  metrics: Array<any>;
}

export async function getPatients() {
  const { data } = await apiClient.get<PatientSummary[]>("/patients");
  return data;
}

export async function getPatient(patientId: string) {
  const { data } = await apiClient.get<PatientDetail>(`/patients/${patientId}`);
  return data;
}
