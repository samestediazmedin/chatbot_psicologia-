import { useEffect, useState } from "react";
import { DashboardSummary, getDashboardSummary } from "../services/dashboard.service";

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const summary = await getDashboardSummary();
        if (mounted) setData(summary);
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

  return { data, loading };
}
