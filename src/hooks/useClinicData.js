import { useEffect, useState } from "react";
import { getClinicInfo, getOpeningHours, listDoctors, listServices } from "../lib/api";

const EMPTY = { clinic: null, services: [], doctors: [], hours: [], loaded: false };

export default function useClinicData() {
  const [data, setData] = useState(EMPTY);

  useEffect(() => {
    const safe = (p) => p.catch(() => null);
    Promise.all([
      safe(getClinicInfo()),
      safe(listServices()),
      safe(listDoctors()),
      safe(getOpeningHours()),
    ]).then(([clinic, services, doctors, hours]) =>
      setData({
        clinic,
        services: services ?? [],
        doctors: (doctors ?? []).map((d) => ({
          ...d,
          services: (d.services ?? []).filter((s) => s.is_active),
        })),
        hours: hours ?? [],
        loaded: true,
      }),
    );
  }, []);

  return data;
}
