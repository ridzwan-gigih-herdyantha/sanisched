insert into public.service_availability (service_id, day_of_week, start_time, end_time)
select s.id, d.dow, '09:00', '16:00'
from public.services s
cross join (values (1),(2),(3),(4),(5)) as d(dow);
