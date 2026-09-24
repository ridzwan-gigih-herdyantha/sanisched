import { WhatsAppIcon } from "../icons";
import { PHOTOS } from "../../lib/media";
import { DAY_LONG, whatsappHref, todayDow } from "../../lib/schedule";

export default function Hours({ clinic, hours }) {
  const photo = PHOTOS.hours;
  const today = DAY_LONG[todayDow()];

  return (
    <section id="hours" className="mt-28 scroll-mt-16 bg-mist py-16 lg:mt-56 lg:py-28">
      <div className="page grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
            Hours &amp; location
          </h2>
          {hours.length > 0 ? (
            <dl className="border-b border-rule text-base tabular-nums">
              {hours.map((h) => {
                const isToday = h.day === today;
                return (
                  <div
                    key={h.day}
                    className={`flex justify-between gap-4 border-t border-rule py-3.5 ${
                      isToday ? "-mx-3 rounded-btn bg-paper px-3 font-semibold" : ""
                    }`}
                  >
                    <dt>
                      {h.day}
                      {isToday && ", today"}
                    </dt>
                    <dd className={h.hours ? "" : "text-stone"}>{h.hours ?? "Closed"}</dd>
                  </div>
                );
              })}
            </dl>
          ) : (
            <p className="text-stone">Opening hours are not available right now. Please call the clinic.</p>
          )}
        </div>

        <div className="flex flex-col gap-7">
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="block aspect-[2/1] w-full rounded-img bg-paper object-cover"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {clinic?.address && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-stone">Address</span>
                <address className="text-[17px] leading-[26px] not-italic">{clinic.address}</address>
              </div>
            )}
            {clinic?.phone && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-stone">WhatsApp</span>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="text-[17px] leading-[26px] hover:text-clinic">
                  <span className="inline-flex items-center gap-2"><WhatsAppIcon size={18} className="text-[#25D366]" />Chat WhatsApp</span>
                </a>
              </div>
            )}
          </div>
          {clinic?.maps_url && (
            <a
              href={clinic.maps_url}
              target="_blank"
              rel="noreferrer"
              className="self-start text-base font-semibold text-clinic underline decoration-1 underline-offset-[6px] hover:text-clinic-deep"
            >
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
