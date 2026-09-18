import { useEffect, useState } from "react";
import { JAKARTA, getClinicInfo, getOpeningHours, listServices } from "../lib/api";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  ChatIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ClockIcon,
  HeartPulseIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  ToothIcon,
} from "./icons";

const STEPS = [
  { icon: ClipboardIcon, title: "Pick a service", text: "Choose the type of visit you need." },
  { icon: CalendarIcon, title: "Choose a date", text: "See which days the clinic is open." },
  { icon: ClockIcon, title: "Select a time", text: "Only slots that are still free are shown." },
  { icon: BellIcon, title: "Get a reminder", text: "We remind you one day before your visit." },
];

const HIGHLIGHTS = [
  "Real-time slot availability",
  "Reminder one day before",
  "No account needed",
];

function serviceIcon(name) {
  if (/dental|tooth|gigi/i.test(name)) return ToothIcon;
  if (/check/i.test(name)) return HeartPulseIcon;
  return StethoscopeIcon;
}

function Logo({ name, light }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-600/20">
        <PlusIcon size={20} strokeWidth="3" />
      </span>
      <span className={`text-base font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        {name}
      </span>
    </span>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-teal-600 uppercase">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-pretty text-slate-500">{text}</p>}
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-teal-200/60 to-cyan-200/40 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-teal-900/10 ring-1 ring-slate-200">
        <div className="flex items-center gap-3 bg-linear-to-r from-teal-600 to-cyan-600 px-5 py-4 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <ChatIcon size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold">Clinic Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-teal-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Online
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 p-5 pb-16 text-sm">
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-teal-600 px-4 py-2.5 text-white">
            Is there a dental slot tomorrow?
          </div>
          <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-slate-700 ring-1 ring-slate-200">
            Yes! Here are the available times:
          </div>
          <div className="flex flex-wrap gap-2">
            {["09:00", "09:45", "10:30", "13:15"].map((t) => (
              <span
                key={t}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ${
                  t === "10:30"
                    ? "bg-teal-600 text-white ring-teal-600"
                    : "bg-white text-slate-600 ring-slate-300"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 sm:-left-10">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleIcon size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Appointment confirmed</p>
          <p className="text-xs text-slate-500">Reminder set for the day before</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onAsk, onBook }) {
  const [clinic, setClinic] = useState(null);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    getClinicInfo().then(setClinic);
    listServices().then(setServices);
    getOpeningHours().then(setHours);
  }, []);

  const name = clinic?.name ?? "Clinic";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: JAKARTA });

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#">
            <Logo name={name} />
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-teal-700">Services</a>
            <a href="#how" className="hover:text-teal-700">How it works</a>
            <a href="#visit" className="hover:text-teal-700">Hours & location</a>
          </nav>
          <button
            onClick={() => onBook()}
            className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
          >
            Book now
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-linear-to-b from-teal-50 via-cyan-50/40 to-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle, rgb(20 184 166 / 0.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-2 lg:pt-24 lg:pb-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm ring-1 ring-teal-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              Online booking assistant · available 24/7
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-[3.5rem] xl:leading-[1.1]">
              Your clinic visit,{" "}
              <span className="bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent sm:block">
                booked in a minute.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-slate-600">
              Ask about opening hours, services, or our location, then pick an
              available slot right in the chat. No phone queues, no waiting.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onBook()}
                className="group inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
              >
                Book an appointment
                <ArrowRightIcon size={16} className="transition group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onAsk}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-300"
              >
                <ChatIcon size={16} className="text-teal-600" />
                Ask a question
              </button>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <CheckCircleIcon size={18} className="text-teal-600" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <ChatPreview />
        </div>
      </section>

      <section id="services" className="scroll-mt-16 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our services"
            title="Care for everyday health needs"
            text="Choose a service and book a slot that fits your schedule."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const ServiceIcon = serviceIcon(s.name);
              return (
                <div
                  key={s.id}
                  className="group flex flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/5 hover:ring-teal-200"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
                    <ServiceIcon size={28} />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">{s.name}</h3>
                  <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <ClockIcon size={14} />
                    {s.duration_minutes} minutes
                  </span>
                  {s.description && (
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">
                      {s.description}
                    </p>
                  )}
                  <button
                    onClick={() => onBook(s.id)}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Book this service
                    <ArrowRightIcon size={16} className="transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-16 bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="Four steps to your appointment" />
          <div className="relative mt-14">
          <div className="absolute top-8 right-[12.5%] left-[12.5%] hidden border-t-2 border-dashed border-teal-200 lg:block" />
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: StepIcon, title, text }, i) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-md ring-1 ring-slate-200">
                  <StepIcon size={28} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>

      <section id="visit" className="scroll-mt-16 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Visit us" title="Hours & location" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <ClockIcon size={22} />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Opening hours</h3>
              </div>
              <dl className="mt-6 space-y-1 text-sm">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className={`flex justify-between rounded-xl px-4 py-2.5 ${
                      h.day === today ? "bg-teal-50 font-semibold" : ""
                    }`}
                  >
                    <dt className={h.day === today ? "text-teal-800" : "text-slate-600"}>
                      {h.day}
                      {h.day === today && (
                        <span className="ml-2 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                          Today
                        </span>
                      )}
                    </dt>
                    <dd className={h.hours ? "text-slate-900" : "text-rose-500"}>
                      {h.hours ? `${h.hours} WIB` : "Closed"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div
                className="relative flex h-44 items-center justify-center bg-teal-50"
                style={{
                  backgroundImage:
                    "linear-gradient(rgb(20 184 166 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(20 184 166 / 0.12) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 ring-8 ring-teal-600/15">
                  <MapPinIcon size={26} />
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7 text-sm">
                <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                {clinic && (
                  <>
                    <p className="flex gap-3 leading-relaxed text-slate-600">
                      <MapPinIcon size={18} className="mt-0.5 shrink-0 text-teal-600" />
                      {clinic.address}
                    </p>
                    {clinic.phone && (
                      <a
                        href={`tel:${clinic.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 text-slate-700 hover:text-teal-700"
                      >
                        <PhoneIcon size={18} className="shrink-0 text-teal-600" />
                        {clinic.phone}
                      </a>
                    )}
                    {clinic.maps_url && (
                      <a
                        href={clinic.maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-700"
                      >
                        Open in Maps
                        <ArrowRightIcon size={16} />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-600 via-teal-700 to-cyan-800 px-8 py-14 text-center text-white shadow-xl shadow-teal-900/20 sm:px-16">
          <PlusIcon size={220} strokeWidth="1" className="pointer-events-none absolute -top-12 -left-12 text-white/10" />
          <PlusIcon size={160} strokeWidth="1" className="pointer-events-none absolute -right-8 -bottom-10 text-white/10" />
          <h2 className="relative text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Ready to book your visit?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-teal-50">
            Pick a service and an open slot in the chat. We&apos;ll send you a reminder one day before.
          </p>
          <button
            onClick={() => onBook()}
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-teal-700 shadow-lg transition hover:bg-teal-50"
          >
            Book an appointment
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo name={name} light />
            <p className="mt-4 flex gap-2.5 text-sm leading-relaxed">
              <ShieldCheckIcon size={18} className="mt-0.5 shrink-0 text-teal-400" />
              Our assistant helps with scheduling and general questions only. It
              does not provide medical advice or diagnoses.
            </p>
          </div>
          <nav className="flex gap-8 text-sm">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#visit" className="hover:text-white">Hours & location</a>
          </nav>
        </div>
        <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {name}
        </div>
      </footer>
    </div>
  );
}
