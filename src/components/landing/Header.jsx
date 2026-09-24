import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClinicMark, CloseIcon, MenuIcon, WhatsAppIcon } from "../icons";
import { whatsappHref } from "../../lib/schedule";
import Button from "./Button";
import { NAV } from "./nav";


export function Logo({ name, className = "" }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`}>
      <ClinicMark className="text-clinic" />
      <span className="font-serif text-[22px] leading-none whitespace-nowrap tracking-[-0.01em] sm:text-2xl">{name}</span>
    </a>
  );
}

export default function Header({ clinic, onBook }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = clinic?.name ?? "Sanisched Clinic";

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper">
      <div className="page flex h-16 items-center gap-8 lg:h-[88px]">
        <Logo name={name} />

        <nav aria-label="Main" className="hidden gap-8 text-[15px] font-medium lg:ml-4 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors duration-150 hover:text-clinic">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-6">
          {clinic?.phone && (
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[15px] font-medium text-stone transition-colors duration-150 hover:text-ink xl:inline-flex"
            >
              <span className="inline-flex items-center gap-2"><WhatsAppIcon size={18} className="text-[#25D366]" />Chat WhatsApp</span>
            </a>
          )}
          <div className="hidden sm:block">
            <Button size="sm" onClick={() => onBook()}>
              Book an appointment
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-btn border border-hairline lg:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Main"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-hairline bg-paper lg:hidden"
          >
            <ul className="page flex flex-col py-2">
              {NAV.map((n) => (
                <li key={n.href} className="border-b border-hairline last:border-0">
                  <a href={n.href} onClick={() => setMenuOpen(false)} className="block py-4 text-base font-medium">
                    {n.label}
                  </a>
                </li>
              ))}
              {clinic?.phone && (
                <li className="py-4 text-base text-stone">
                  <a href={whatsappHref()} target="_blank" rel="noopener noreferrer"><span className="inline-flex items-center gap-2"><WhatsAppIcon size={18} className="text-[#25D366]" />Chat WhatsApp</span></a>
                </li>
              )}
              <li className="pb-4 sm:hidden">
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    onBook();
                  }}
                >
                  Book an appointment
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
