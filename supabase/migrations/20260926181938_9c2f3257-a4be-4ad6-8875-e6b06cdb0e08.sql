CREATE TABLE public.waitlist_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service text NOT NULL,
  name text NOT NULL,
  contact text NOT NULL,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waitlist_interests TO anon, authenticated;
GRANT SELECT ON public.waitlist_interests TO authenticated;
GRANT ALL ON public.waitlist_interests TO service_role;
ALTER TABLE public.waitlist_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist_interests FOR INSERT TO anon, authenticated WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));
CREATE POLICY "Admins read waitlist" ON public.waitlist_interests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.validate_waitlist_service() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.service NOT IN ('tiffin','pg_rental','nehu_points','backpackers','wallet','rewards','notifications','online_payment') THEN
    RAISE EXCEPTION 'Unknown waitlist service';
  END IF;
  NEW.name := left(trim(NEW.name), 100);
  NEW.contact := left(trim(NEW.contact), 255);
  IF length(NEW.name) < 2 OR length(NEW.contact) < 5 THEN
    RAISE EXCEPTION 'Enter your name and a phone number or email';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER waitlist_validate BEFORE INSERT ON public.waitlist_interests FOR EACH ROW EXECUTE FUNCTION public.validate_waitlist_service();