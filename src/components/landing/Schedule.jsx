import { DAY_SHORT, WEEK, todayDow, weeklyGrid } from "../../lib/schedule";

export default function Schedule({ doctors }) {
  if (doctors.length === 0) return null;
  const today = todayDow();

  return (
    <section id="schedule" className="page scroll-mt-24 pt-28 lg:pt-36">
      <h2 className="font-serif text-[34px] leading-10 font-normal tracking-[-0.015em] lg:text-[56px] lg:leading-[60px]">
        Who is in, and when.
      </h2>

      <div className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:mt-10" tabIndex={0} role="region" aria-label="Weekly doctor timetable">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm leading-5 tabular-nums">
          <caption className="sr-only">Practice hours for each doctor, Monday to Sunday</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="sticky left-0 w-[220px] bg-paper py-3 pr-4 font-medium text-stone">
                Doctor
              </th>
              {WEEK.map((dow) => (
                <th
                  key={dow}
                  scope="col"
                  className={`px-3 py-3 font-medium ${dow === today ? "bg-mist text-ink" : "text-stone"}`}
                >
                  {DAY_SHORT[dow]}
                  {dow === today && <span className="font-semibold">, today</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-b border-hairline">
                <th scope="row" className="sticky left-0 bg-paper py-5 pr-4 align-top">
                  <span className="block font-semibold">{d.name}</span>
                  {d.specialty && <span className="mt-0.5 block text-[13px] font-normal text-stone">{d.specialty}</span>}
                </th>
                {weeklyGrid(d.doctor_availability).map((ranges, i) => (
                  <td
                    key={WEEK[i]}
                    className={`px-3 py-5 align-top ${WEEK[i] === today ? "bg-mist font-semibold" : ""}`}
                  >
                    {ranges.length ? (
                      ranges.map((r) => (
                        <span key={r} className="block whitespace-nowrap">
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone/60">
                        <span aria-hidden="true">–</span>
                        <span className="sr-only">Not practising</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
