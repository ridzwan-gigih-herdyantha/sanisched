import { doctorName, practiceDays } from "../../lib/schedule";
import { TextAction } from "./Button";

function Portrait({ doctor, initials }) {
  if (doctor.photo_url) {
    return (
      <img
        src={doctor.photo_url}
        alt={`Portrait of ${doctor.name}`}
        loading="lazy"
        width="400"
        height="500"
        className="aspect-[4/5] w-full rounded-img bg-mist object-cover"
      />
    );
  }
  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center rounded-img bg-mist" aria-hidden="true">
      <span className="font-serif text-[96px] leading-none tracking-[-0.03em] text-clinic lg:text-[112px]">
        {initials}
      </span>
    </div>
  );
}

export default function Doctors({ doctors, loaded, onBook }) {
  return (
    <section id="doctors" className="page scroll-mt-24 pt-28 lg:pt-40">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
            Our doctors
          </h2>
          <p className="max-w-md text-base leading-[26px] text-stone">
            Each doctor keeps their own days, so you can come back to the one you already know.
          </p>
        </div>

        <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:col-span-9 lg:grid-cols-3">
          {!loaded && <li className="aspect-[4/5] w-full" aria-hidden="true" />}
          {doctors.map((d) => {
            const { short, initials } = doctorName(d.name);
            const days = practiceDays(d.doctor_availability);
            // a doctor with a single service can be booked straight into it
            const serviceId = d.services.length === 1 ? d.services[0].id : "";
            return (
              <li key={d.id} className="flex w-[78%] shrink-0 snap-start flex-col gap-4 sm:w-auto">
                <Portrait doctor={d} initials={initials} />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg leading-[26px] font-semibold">{d.name}</h3>
                  {d.specialty && <p className="text-sm text-stone">{d.specialty}</p>}
                </div>
                {days.length > 0 && (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm leading-5 tabular-nums">
                    {days.map((line) => (
                      <div key={line.days} className="contents">
                        <dt className="font-medium">{line.days}</dt>
                        <dd className="text-stone">{line.hours}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {d.bio && <p className="text-[15px] leading-6 text-stone">{d.bio}</p>}
                <TextAction className="mt-1" onClick={() => onBook({ serviceId, doctorId: d.id })}>
                  Book with {short}
                </TextAction>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
