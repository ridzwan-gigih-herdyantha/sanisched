import { PHOTOS } from "../../lib/media";
import Button from "./Button";

export default function FinalCta({ onBook }) {
  const photo = PHOTOS.cta;

  return (
    <section className="page py-20 lg:py-36">
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        <div className="flex flex-col gap-5 rounded-img bg-clinic px-6 py-10 text-white sm:px-10 lg:min-h-[440px] lg:rounded-img-lg lg:gap-6 lg:px-14 lg:py-16">
          <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
            Need to see a doctor this week?
          </h2>
          <p className="max-w-[440px] text-base leading-[26px] text-white/85 lg:text-lg lg:leading-[30px]">
            Pick a service and a time that is still open. It takes about a minute.
          </p>
          <Button variant="light" onClick={() => onBook()} className="mt-4 self-stretch sm:self-start lg:mt-auto">
            Book an appointment
          </Button>
        </div>
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="block h-[220px] w-full rounded-img bg-mist object-cover sm:h-[320px] lg:h-full lg:rounded-img-lg"
        />
      </div>
    </section>
  );
}
