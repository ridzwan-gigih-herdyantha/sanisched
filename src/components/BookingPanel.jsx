import { useEffect, useState } from "react";
import {
  createBooking,
  fetchSlots,
  formatDateTime,
  formatTime,
  listServices,
  todayInJakarta,
} from "../lib/api";

export default function BookingPanel({ initialServiceId, initialDoctorId, onDone, onCancel }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(initialServiceId || "");
  const [doctorId, setDoctorId] = useState(initialDoctorId || "");
  const [date, setDate] = useState(todayInJakarta());
  const [slots, setSlots] = useState(null);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listServices().then(setServices);
  }, []);

  const service = services.find((s) => s.id === serviceId);
  const doctors = service?.doctors ?? [];
  // keep the picked doctor only if they offer this service; auto-pick when there's just one
  const activeDoctorId = doctors.some((d) => d.id === doctorId)
    ? doctorId
    : doctors.length === 1
      ? doctors[0].id
      : "";

  useEffect(() => {
    if (!serviceId || !activeDoctorId || !date) return;
    setSlots(null);
    setSlot("");
    setError("");
    setLoading(true);
    fetchSlots(serviceId, activeDoctorId, date)
      .then(({ ok, data }) => {
        if (!ok) setError(data.error || "Failed to load slots");
        setSlots(data.slots || []);
      })
      .finally(() => setLoading(false));
  }, [serviceId, activeDoctorId, date]);

  async function submit() {
    setError("");
    setLoading(true);
    const { ok, data } = await createBooking({
      service_id: serviceId,
      doctor_id: activeDoctorId,
      date,
      starts_at: slot,
      patient_name: name,
      patient_phone: phone,
      patient_email: email,
    });
    setLoading(false);

    if (!ok) {
      setError(data.error || "Booking failed");
      if (data.slots) {
        setSlots(data.slots);
        setSlot("");
      }
      return;
    }

    const doctor = doctors.find((d) => d.id === activeDoctorId);
    onDone(
      `${service?.name || "Appointment"} with ${doctor?.name || "the doctor"} — ${formatDateTime(data.starts_at)}`,
    );
  }

  const ready = serviceId && activeDoctorId && slot && name.trim().length >= 2 && phone.trim();

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-5">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-900">Book an appointment</h2>
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>

        <div className="grid gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Service</span>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes} min)
                </option>
              ))}
            </select>
          </label>

          {serviceId && (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-500">Doctor</span>
              <select
                value={activeDoctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                disabled={doctors.length < 2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
              >
                {doctors.length === 0 && <option value="">No doctor available</option>}
                {doctors.length > 1 && <option value="">Select a doctor</option>}
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}{d.specialty ? ` — ${d.specialty}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Date</span>
            <input
              type="date"
              value={date}
              min={todayInJakarta()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        {activeDoctorId && (
          <div>
            <span className="mb-2 block text-xs text-slate-500">Available times</span>
            {loading && !slots && (
              <p className="text-sm text-slate-400">Loading…</p>
            )}
            {slots?.length === 0 && (
              <p className="text-sm text-slate-500">
                No open slots on this date. Try another day.
              </p>
            )}
            {slots?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg px-3 py-1.5 text-sm ring-1 transition ${
                      slot === s
                        ? "bg-teal-600 text-white ring-teal-600"
                        : "bg-white text-slate-700 ring-slate-300 hover:ring-teal-400"
                    }`}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {slot && (
          <div className="grid gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number (e.g. 0812…)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={submit}
          disabled={!ready || loading}
          className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Booking…" : "Confirm appointment"}
        </button>
      </div>
    </div>
  );
}