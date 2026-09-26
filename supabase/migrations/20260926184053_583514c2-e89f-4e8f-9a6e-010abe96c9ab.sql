ALTER TABLE public.waitlist_interests
  ADD COLUMN hostel text,
  ADD COLUMN pickup_time text,
  ADD COLUMN delivery_date date;

ALTER TABLE public.waitlist_interests
  ADD CONSTRAINT waitlist_hostel_len CHECK (hostel IS NULL OR char_length(hostel) BETWEEN 2 AND 120),
  ADD CONSTRAINT waitlist_pickup_time_len CHECK (pickup_time IS NULL OR char_length(pickup_time) BETWEEN 1 AND 40);