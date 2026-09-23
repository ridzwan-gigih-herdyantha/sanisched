const BASE = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function post(path, body) {
  const res = await fetch(`${BASE}/functions/v1/chat${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const sendChat = (messages) => post("", { messages });
export const fetchSlots = (service_id, doctor_id, date) =>
  post("/slots", { service_id, doctor_id, date });
export const createBooking = (payload) => post("/booking", payload);

async function get(path) {
  const res = await fetch(`${BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  return res.ok ? res.json() : [];
}

export const listServices = () =>
  get(
    "services?select=id,name,description,duration_minutes,doctors(id,name,specialty)&is_active=eq.true&order=name",
  );

export const getClinicInfo = () =>
  get("clinic_info?select=name,address,phone,maps_url&limit=1").then((rows) => rows[0] ?? null);

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function getOpeningHours() {
  const rows = await get(
    "doctor_availability?select=day_of_week,start_time,end_time,doctors!inner(id)",
  );
  const byDay = new Map();
  for (const r of rows) {
    const h = byDay.get(r.day_of_week);
    byDay.set(r.day_of_week, {
      start: h && h.start < r.start_time ? h.start : r.start_time,
      end: h && h.end > r.end_time ? h.end : r.end_time,
    });
  }
  return [1, 2, 3, 4, 5, 6, 0].map((i) => {
    const h = byDay.get(i);
    return {
      day: DAYS[i],
      hours: h ? `${h.start.slice(0, 5)} – ${h.end.slice(0, 5)}` : null,
    };
  });
}

export const JAKARTA = "Asia/Jakarta";

export function todayInJakarta() {
  return new Date().toLocaleDateString("en-CA", { timeZone: JAKARTA });
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: JAKARTA,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: JAKARTA,
    dateStyle: "full",
    timeStyle: "short",
  });
}

