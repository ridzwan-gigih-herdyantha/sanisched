insert into public.doctors (name, specialty, bio) values
  ('dr. Andi Pratama',   'General Practitioner', 'General consultations and routine health check-ups.'),
  ('dr. Sari Wulandari', 'General Practitioner', 'General consultations for adults and children.'),
  ('drg. Budi Santoso',  'Dentist',              'Dental and oral examinations.');

insert into public.doctor_services (doctor_id, service_id)
select d.id, s.id
from (values
  ('dr. Andi Pratama',   'General Consultation'),
  ('dr. Andi Pratama',   'Health Check-up'),
  ('dr. Sari Wulandari', 'General Consultation'),
  ('drg. Budi Santoso',  'Dental Consultation')
) as m(doctor, service)
join public.doctors d on d.name = m.doctor
join public.services s on s.name = m.service;

insert into public.doctor_availability (doctor_id, day_of_week, start_time, end_time)
select d.id, a.dow, a.start_time::time, a.end_time::time
from (values
  ('dr. Andi Pratama',   1, '09:00', '16:00'),
  ('dr. Andi Pratama',   2, '09:00', '16:00'),
  ('dr. Andi Pratama',   3, '09:00', '16:00'),
  ('dr. Andi Pratama',   4, '09:00', '16:00'),
  ('dr. Andi Pratama',   5, '09:00', '16:00'),
  ('dr. Sari Wulandari', 1, '16:00', '20:00'),
  ('dr. Sari Wulandari', 3, '16:00', '20:00'),
  ('dr. Sari Wulandari', 5, '16:00', '20:00'),
  ('dr. Sari Wulandari', 6, '09:00', '13:00'),
  ('drg. Budi Santoso',  2, '10:00', '17:00'),
  ('drg. Budi Santoso',  4, '10:00', '17:00'),
  ('drg. Budi Santoso',  6, '09:00', '14:00')
) as a(doctor, dow, start_time, end_time)
join public.doctors d on d.name = a.doctor;
