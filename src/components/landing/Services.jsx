import { TextAction } from "./Button";

export default function Services({ services, loaded, onBook }) {
  return (
    <section id="services" className="page scroll-mt-24 pt-24 lg:pt-28">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h2 className="max-w-[620px] font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
          Every visit has its own time, and its own doctor.
        </h2>
        <p className="max-w-[360px] text-base leading-[26px] text-stone">
          Pick the visit you need. Each one shows which doctor handles it and how long to set aside.
        </p>
      </div>

      <ul className="mt-10 border-t border-ink lg:mt-14">
        {!loaded && <li className="h-[420px] border-b border-hairline" aria-hidden="true" />}
        {loaded && services.length === 0 && (
          <li className="border-b border-hairline py-8 text-stone">
            Services could not be loaded right now. You can still book through the assistant.
          </li>
        )}
        {services.map((s) => (
          <li
            key={s.id}
            className="group relative border-b border-hairline"
          >
            {/* hover / tap wash: opacity only */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -mx-5 rounded-img bg-mist/60 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 group-active:opacity-100 sm:-mx-6 lg:-mx-8"
            />
            <div className="relative grid gap-3 py-7 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-9">
              <h3 className="font-serif text-[28px] leading-[34px] font-normal lg:col-span-4 lg:text-[40px] lg:leading-[44px]">
                {s.name}
              </h3>
              <p className="text-base leading-[26px] text-stone lg:col-span-3">{s.description}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm leading-5 font-medium lg:col-span-3 lg:flex-col">
                <span>{s.doctors.map((d) => d.name).join(", ") || "Doctor to be assigned"}</span>
                <span className="text-stone tabular-nums">{s.duration_minutes} minutes</span>
              </div>
              <div className="lg:col-span-2 lg:text-right">
                <TextAction onClick={() => onBook({ serviceId: s.id })} aria-label={`Book ${s.name}`}>
                  Book
                </TextAction>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
