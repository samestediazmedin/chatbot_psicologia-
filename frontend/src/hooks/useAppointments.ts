import { useEffect, useState } from "react";
import { getAppointments, type AppointmentSummary } from "../services/appointment.service";

export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAppointments(date);
        if (mounted) setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [date]);

  return { appointments, loading };
}
