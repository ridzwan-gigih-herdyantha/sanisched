import { createClient } from "@supabase/supabase-js";

const TZ = "+07:00";
const PHONE = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const route = new URL(req.url).pathname.replace(/^\/chat\/?/, "");

  try {
    const body = await req.json();

    if (route === "") return await handleChat(body);
    if (route === "slots") return await handleSlots(body);
    if (route === "booking") return await handleBooking(body);

    return json({ error: "Endpoint not found" }, 404);
  } catch (e) {
    console.error(route, e);
    return json({ error: "Something went wrong" }, 500);
  }
});

function isValidDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function dayOfWeek(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function buildSlots(start: string, end: string, durationMin: number, date: string) {
  const from = Date.parse(`${date}T${start}${TZ}`);
  const to = Date.parse(`${date}T${end}${TZ}`);
  const step = durationMin * 60_000;
  const out: number[] = [];
  for (let t = from; t + step <= to; t += step) out.push(t);
  return out;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEK = [1, 2, 3, 4, 5, 6, 0];

type Hours = { day_of_week: number; start_time: string; end_time: string };

const hhmm = (t: string) => t.slice(0, 5);

function openingHours(rows: Hours[]) {
  const byDay = new Map<number, { start: string; end: string }>();
  for (const r of rows) {
    const h = byDay.get(r.day_of_week);
    byDay.set(r.day_of_week, {
      start: h && h.start < r.start_time ? h.start : r.start_time,
      end: h && h.end > r.end_time ? h.end : r.end_time,
    });
  }
  return WEEK.map((i) => {
    const h = byDay.get(i);
    return `${DAYS[i]}: ${h ? `${hhmm(h.start)}–${hhmm(h.end)}` : "Closed"}`;
  }).join("\n");
}

function doctorSchedule(rows: Hours[]) {
  return [...rows]
    .sort((a, b) =>
      WEEK.indexOf(a.day_of_week) - WEEK.indexOf(b.day_of_week) ||
      a.start_time.localeCompare(b.start_time)
    )
    .map((r) => `${DAYS[r.day_of_week]} ${hhmm(r.start_time)}–${hhmm(r.end_time)}`)
    .join(", ");
}

async function availableSlots(serviceId: string, doctorId: string, date: string) {
  const { data: offer } = await supabase
    .from("doctor_services")
    .select("services!inner(duration_minutes, is_active), doctors!inner(is_active)")
    .eq("service_id", serviceId)
    .eq("doctor_id", doctorId)
    .maybeSingle();

  const service = offer?.services as any;
  const doctor = offer?.doctors as any;
  if (!service?.is_active || !doctor?.is_active) {
    return { error: "This doctor does not offer that service" };
  }

  const duration: number = service.duration_minutes;

  const { data: avail } = await supabase
    .from("doctor_availability")
    .select("start_time, end_time")
    .eq("doctor_id", doctorId)
    .eq("day_of_week", dayOfWeek(date));

  if (!avail?.length) return { slots: [], duration };

  const dayStart = Date.parse(`${date}T00:00:00${TZ}`);
  const { data: booked } = await supabase
    .from("bookings")
    .select("starts_at, ends_at")
    .eq("doctor_id", doctorId)
    .neq("status", "cancelled")
    .lt("starts_at", new Date(dayStart + 86_400_000).toISOString())
    .gt("ends_at", new Date(dayStart).toISOString());

  // bookings of any service block the doctor, so compare time ranges, not start times
  const busy = (booked ?? []).map((b: any) => [Date.parse(b.starts_at), Date.parse(b.ends_at)]);
  const step = duration * 60_000;
  const now = Date.now();

  const slots = [
    ...new Set(
      avail.flatMap((a: any) => buildSlots(a.start_time, a.end_time, duration, date)),
    ),
  ]
    .filter((t) => t > now && !busy.some(([s, e]) => t < e && t + step > s))
    .sort((a, b) => a - b)
    .map((t) => new Date(t).toISOString());

  return { slots, duration };
}

async function handleChat({ messages }: any) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: "messages is empty" }, 400);
  }

  const [{ data: clinic }, { data: faqs }, { data: services }, { data: doctors }] =
    await Promise.all([
      supabase.from("clinic_info").select("name, address, phone, maps_url").maybeSingle(),
      supabase.from("clinic_faqs").select("question, answer"),
      supabase.from("services")
        .select("id, name, description, duration_minutes")
        .eq("is_active", true),
      supabase.from("doctors")
        .select(
          "id, name, specialty, services(name, is_active), doctor_availability(day_of_week, start_time, end_time)",
        )
        .eq("is_active", true),
    ]);

  const doctorList = (doctors ?? []).map((d: any) => {
    const offered = d.services.filter((s: any) => s.is_active).map((s: any) => s.name);
    return `- ${d.name} (id: ${d.id}, ${d.specialty ?? "-"})
  Services: ${offered.join(", ") || "-"}
  Schedule: ${doctorSchedule(d.doctor_availability) || "-"}`;
  }).join("\n");

  const system = `You are an administrative assistant for a clinic. You have
exactly two jobs: answering general questions about the clinic, and helping
patients book an appointment.

STRICT RULES:
1. Answer only from the CLINIC DATA below. If the information is not there,
   say you do not have it and suggest contacting the clinic directly.
   Never make anything up.
2. Never give medical advice, diagnoses, interpretations of symptoms, or
   medication recommendations. If asked for any of those, politely decline,
   direct the patient to a qualified healthcare professional, then offer to
   help book an appointment.
3. Never assess or imply how urgent or serious a patient's condition is.
4. Never promise that a specific time is free. Open times are shown in the
   booking form.
5. Be concise and friendly. Reply in the same language the patient writes in.

CLINIC DATA — PROFILE:
Name: ${clinic?.name ?? "-"}
Address: ${clinic?.address ?? "-"}
Phone: ${clinic?.phone ?? "-"}
Maps: ${clinic?.maps_url ?? "-"}

CLINIC DATA — OPENING HOURS (WIB):
${openingHours((doctors ?? []).flatMap((d: any) => d.doctor_availability))}

CLINIC DATA — FAQ:
${faqs?.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

CLINIC DATA — SERVICES:
${services?.map((s: any) => `- ${s.name} (id: ${s.id}, ${s.duration_minutes} minutes): ${s.description ?? "-"}`).join("\n")}

CLINIC DATA — DOCTORS (schedule in WIB):
${doctorList}

RESPONSE FORMAT:
Reply with valid JSON only, no other text, no markdown fences:
{"intent":"faq"|"booking","reply":"your answer","service_id":null,"doctor_id":null}
Use intent "booking" when the patient wants to create or change an
appointment, or asks how to book one. Set service_id when the patient has
clearly named a service, and doctor_id when they have clearly named a doctor.`;

  const res = await fetch(
    `${Deno.env.get("LLM_BASE_URL")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${Deno.env.get("LLM_API_KEY")}`,
        "HTTP-Referer": Deno.env.get("APP_URL") ?? "",
        "X-Title": "Clinic Booking Assistant",
      },
      body: JSON.stringify({
        model: Deno.env.get("LLM_MODEL"),
        max_tokens: 500,
        messages: [
          { role: "system", content: system },
          ...messages.slice(-10).map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content).slice(0, 2000),
          })),
        ],
      }),
    },
  );

  if (!res.ok) {
    console.error("llm", res.status, await res.text());
    return json({ error: "Assistant is unavailable right now" }, 502);
  }

  const data = await res.json();

  if (data.error) {
    console.error("llm", data.error);
    return json({ error: "Assistant is unavailable right now" }, 502);
  }

  const raw = String(data.choices?.[0]?.message?.content ?? "")
    .replace(/```json|```/g, "")
    .trim();

  try {
    return json(JSON.parse(raw));
  } catch {
    return json({ intent: "faq", reply: raw, service_id: null, doctor_id: null });
  }
}

async function handleSlots({ service_id, doctor_id, date }: any) {
  if (!service_id || !doctor_id || !isValidDate(date)) {
    return json({ error: "service_id, doctor_id and date (YYYY-MM-DD) are required" }, 400);
  }
  const result = await availableSlots(service_id, doctor_id, date);
  return result.error ? json(result, 404) : json({ slots: result.slots });
}

async function handleBooking(body: any) {
  const { service_id, doctor_id, date, starts_at } = body;
  const name = String(body.patient_name ?? "").trim();
  const phone = String(body.patient_phone ?? "").replace(/[\s-]/g, "");
  const email = String(body.patient_email ?? "").trim().toLowerCase() || null;

  if (!service_id || !doctor_id || !isValidDate(date) || !starts_at) {
    return json({ error: "Incomplete booking data" }, 400);
  }
  if (name.length < 2 || name.length > 100) {
    return json({ error: "Invalid name" }, 400);
  }
  if (!PHONE.test(phone)) {
    return json({ error: "Invalid phone number" }, 400);
  }
  if (email && !EMAIL.test(email)) {
    return json({ error: "Invalid email" }, 400);
  }

  const { slots, duration, error } = await availableSlots(service_id, doctor_id, date);
  if (error) return json({ error }, 404);

  const requested = Date.parse(starts_at);
  const match = slots?.find((s) => Date.parse(s) === requested);

  if (!match) {
    return json({ error: "That slot is unavailable, please pick another time", slots }, 409);
  }

  const { data, error: insertError } = await supabase
    .from("bookings")
    .insert({
      service_id,
      doctor_id,
      patient_name: name,
      patient_phone: phone,
      patient_email: email,
      starts_at: match,
      ends_at: new Date(requested + duration! * 60_000).toISOString(),
    })
    .select("id, starts_at")
    .single();

  if (insertError) {
    // 23P01: bookings_no_overlap, someone took an overlapping slot in the meantime
    if (insertError.code === "23P01" || insertError.code === "23505") {
      const retry = await availableSlots(service_id, doctor_id, date);
      return json({
        error: "That slot was just taken, please pick another time",
        slots: retry.slots,
      }, 409);
    }
    throw insertError;
  }

  return json({
    booking_id: data.id,
    starts_at: data.starts_at,
    message: "Appointment booked",
  }, 201);
}
