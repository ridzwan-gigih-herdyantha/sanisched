import { PHOTOS } from "../../lib/media";
import { openDaysPhrase } from "../../lib/schedule";

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function listPhrase(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export default function About({ clinic, doctors, services, hours }) {
  const photo = PHOTOS.about;
  const count = doctors.length;
  const openDays = openDaysPhrase(hours);

  return (
    <section id="about" className="page relative mt-28 lg:mt-40">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        className="block h-[260px] w-full rounded-img bg-mist object-cover sm:h-[420px] lg:h-[620px] lg:rounded-img-lg"
      />
      <div className="lg:absolute lg:bottom-0 lg:left-6 lg:translate-y-24">
        <div className="flex max-w-[620px] flex-col gap-5 bg-paper pt-8 lg:max-w-[676px] lg:gap-6 lg:rounded-tr-img-lg lg:py-14 lg:pr-14 lg:pl-14">
          <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
            A small clinic for everyday health.
          </h2>
          <p className="text-base leading-[26px] text-ink/80 lg:text-lg lg:leading-[30px]">
            {count > 0 && `${WORDS[count] ?? count} ${count === 1 ? "doctor" : "doctors"} and one front desk at ${clinic?.name ?? "the clinic"}. `}
            {services.length > 0 && `We offer ${listPhrase(services.map((s) => s.name.toLowerCase()))}`}
            {services.length > 0 && (openDays ? `, ${openDays}. ` : ". ")}
            Bring a valid ID and arrive ten minutes before your appointment.
          </p>
        </div>
      </div>
    </section>
  );
}
