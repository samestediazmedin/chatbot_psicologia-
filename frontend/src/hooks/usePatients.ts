import { useEffect, useState } from "react";
import { getPatients, type PatientSummary } from "../services/patient.service";

export function usePatients() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPatients();
        if (mounted) setPatients(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { patients, loading };
}
