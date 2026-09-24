import { ClinicMark, WhatsAppIcon } from "../icons";
import { whatsappHref } from "../../lib/schedule";
import { NAV } from "./nav";
import Button from "./Button";

export default function Footer({ clinic, hours, onBook }) {
  const name = clinic?.name ?? "Sanisched Clinic";
  const open = hours.filter((h) => h.hours);
  const closed = hours.filter((h) => !h.hours);

  return (
    <footer className="bg-ink text-white/70">
      <div className="page grid gap-10 pt-16 pb-12 text-[15px] leading-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:pt-20">
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-3 text-white">
            <ClinicMark size={26} />
            <span className="font-serif text-[26px] leading-none">{name}</span>
          </span>
          {clinic?.address && <address className="max-w-xs not-italic">{clinic.address}</address>}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-white">Hours</h2>
          {open.map((h) => (
            <p key={h.day} className="flex justify-between gap-4 tabular-nums sm:max-w-[240px]">
              <span>{h.day}</span>
              <span>{h.hours}</span>
            </p>
          ))}
          {closed.length > 0 && <p>{closed.map((h) => h.day).join(", ")} closed</p>}
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <h2 className="font-semibold text-white">Clinic</h2>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="self-start hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-4">
          <h2 className="font-semibold text-white">Contact</h2>
          {clinic?.phone && (
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <span className="inline-flex items-center gap-2"><WhatsAppIcon size={18} className="text-[#25D366]" />Chat WhatsApp</span>
            </a>
          )}
          <Button variant="light" size="sm" onClick={() => onBook()} className="text-ink hover:text-ink">
            Book an appointment
          </Button>
        </div>
      </div>
      <div className="page">
        <p className="border-t border-white/15 py-6 text-[13px] text-white/60">
          © {new Date().getFullYear()} {name}
        </p>
      </div>
    </footer>
  );
}
