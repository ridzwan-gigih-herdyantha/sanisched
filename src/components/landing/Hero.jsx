import { motion } from "motion/react";
import { PHOTOS } from "../../lib/media";
import Button from "./Button";

const LINES = ["Unhurried care", "from doctors", "who know", "your name."];
const EASE_OUT = [0.22, 1, 0.36, 1];

export default function Hero({ onBook }) {
  const photo = PHOTOS.hero;

  return (
    <section
      id="top"
      className="grid lg:grid-cols-[minmax(24px,1fr)_minmax(0,580px)_minmax(32px,60px)_minmax(0,600px)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-6 px-5 pt-12 pb-10 sm:px-6 lg:col-start-2 lg:px-0 lg:pt-24 lg:pb-16">
        <p className="text-sm font-medium text-stone lg:text-[15px]">A neighbourhood clinic in Jakarta</p>

        <h1 className="font-serif text-[44px] leading-[48px] font-normal tracking-[-0.02em] sm:text-6xl sm:leading-[1.02] xl:text-[84px] xl:leading-[86px]">
          {LINES.map((line, i) => (
            <motion.span
              key={line}
              className="mr-[0.25em] inline-block lg:mr-0 lg:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE_OUT }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <p className="max-w-[26rem] text-base leading-[26px] text-ink/80 lg:text-lg lg:leading-[30px]">
          General consultations, dental care and routine check-ups. See which doctor is in today and book a
          time that suits you.
        </p>

        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Button onClick={() => onBook()}>Book an appointment</Button>
          <a
            href="#hours"
            className="text-center text-base font-semibold underline decoration-1 underline-offset-[6px] transition-colors duration-150 hover:text-clinic"
          >
            See opening hours
          </a>
        </div>
      </div>

      <div className="mx-5 overflow-hidden rounded-img bg-mist sm:mx-6 lg:col-span-2 lg:col-start-4 lg:mx-0 lg:mt-10 lg:self-start lg:rounded-none lg:rounded-l-img-lg">
        <motion.img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          fetchPriority="high"
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="block h-[320px] w-full object-cover sm:h-[440px] lg:h-[640px]"
        />
      </div>
    </section>
  );
}
