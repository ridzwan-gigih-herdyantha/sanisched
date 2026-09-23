// Mirrors the real BookingPanel flow, step for step
const STEPS = [
  { title: "Choose a service", text: "Each visit shows how long it takes before you pick it." },
  { title: "Pick your doctor and date", text: "If only one doctor offers the service, they are chosen for you." },
  { title: "Choose a time", text: "Only times that are still free are shown." },
  { title: "Add your name and WhatsApp, then confirm", text: "Email is optional. Your slot is held as soon as you confirm." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="page scroll-mt-24 pt-28 lg:pt-40">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:sticky lg:top-32 lg:text-[56px] lg:leading-[60px]">
            Booking takes about a minute.
          </h2>
        </div>

        <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[48px_1fr] gap-4 border-b border-hairline py-6 sm:grid-cols-[96px_1fr] lg:py-8"
            >
              <span className="font-serif text-[36px] leading-9 text-clinic lg:text-[56px] lg:leading-[52px]" aria-hidden="true">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg leading-[26px] font-semibold">{s.title}</h3>
                <p className="text-base leading-[26px] text-stone">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
