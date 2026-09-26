ALTER TABLE public.services DROP CONSTRAINT services_unit_check;
ALTER TABLE public.services ADD CONSTRAINT services_unit_check CHECK (unit = ANY (ARRAY['piece','kg','item','fixed']));