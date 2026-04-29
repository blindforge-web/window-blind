-- Adds broader Nigeria delivery coverage without touching unrelated records.

begin;

insert into public.delivery_states (code, name, is_active, eta)
values
  ('abia', 'Abia', true, '2 to 4 working days'),
  ('adamawa', 'Adamawa', true, '3 to 6 working days'),
  ('akwa-ibom', 'Akwa Ibom', true, '3 to 6 working days'),
  ('anambra', 'Anambra', true, '2 to 4 working days'),
  ('bauchi', 'Bauchi', true, '3 to 6 working days'),
  ('bayelsa', 'Bayelsa', true, '3 to 6 working days'),
  ('benue', 'Benue', true, '3 to 6 working days'),
  ('borno', 'Borno', true, '3 to 6 working days'),
  ('cross-river', 'Cross River', true, '3 to 6 working days'),
  ('delta', 'Delta', true, '2 to 4 working days'),
  ('ebonyi', 'Ebonyi', true, '2 to 4 working days'),
  ('edo', 'Edo', true, '3 to 5 working days'),
  ('ekiti', 'Ekiti', true, '3 to 6 working days'),
  ('enugu', 'Enugu', true, '2 to 4 working days'),
  ('gombe', 'Gombe', true, '3 to 6 working days'),
  ('imo', 'Imo', true, '2 to 4 working days'),
  ('jigawa', 'Jigawa', true, '3 to 6 working days'),
  ('kaduna', 'Kaduna', true, '3 to 6 working days'),
  ('kano', 'Kano', true, '3 to 6 working days'),
  ('katsina', 'Katsina', true, '3 to 6 working days'),
  ('kebbi', 'Kebbi', true, '3 to 6 working days'),
  ('kogi', 'Kogi', true, '3 to 6 working days'),
  ('kwara', 'Kwara', true, '3 to 6 working days'),
  ('lagos', 'Lagos', true, '3 to 5 working days'),
  ('nasarawa', 'Nasarawa', true, '3 to 6 working days'),
  ('niger', 'Niger', true, '3 to 6 working days'),
  ('ogun', 'Ogun', true, '3 to 5 working days'),
  ('ondo', 'Ondo', true, '3 to 6 working days'),
  ('osun', 'Osun', true, '3 to 6 working days'),
  ('oyo', 'Oyo', true, '3 to 5 working days'),
  ('plateau', 'Plateau', true, '3 to 6 working days'),
  ('rivers', 'Rivers', true, '3 to 5 working days'),
  ('sokoto', 'Sokoto', true, '3 to 6 working days'),
  ('taraba', 'Taraba', true, '3 to 6 working days'),
  ('yobe', 'Yobe', true, '3 to 6 working days'),
  ('zamfara', 'Zamfara', true, '3 to 6 working days'),
  ('abuja', 'Abuja', true, '3 to 5 working days')
on conflict (code) do update
set
  name = excluded.name,
  is_active = excluded.is_active,
  eta = excluded.eta;

commit;
