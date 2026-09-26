ALTER TABLE public.waitlist_interests ADD COLUMN university text, ADD COLUMN campus text;
ALTER TABLE public.waitlist_interests ADD CONSTRAINT waitlist_campus_len CHECK (coalesce(length(university),0) <= 120 AND coalesce(length(campus),0) <= 120);

CREATE TABLE public.hostels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id text NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 80),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campus_id, name)
);
GRANT SELECT ON public.hostels TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hostels TO authenticated;
GRANT ALL ON public.hostels TO service_role;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active hostels" ON public.hostels FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage hostels" ON public.hostels FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.orders ADD COLUMN delivery_date date, ADD COLUMN delivery_slot text;

CREATE OR REPLACE FUNCTION public.set_order_delivery(_order_id uuid, _delivery_date date, _delivery_slot text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _o public.orders;
BEGIN
  SELECT * INTO _o FROM public.orders WHERE id = _order_id AND user_id = auth.uid();
  IF _o.id IS NULL THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF _o.status <> 'placed' THEN RAISE EXCEPTION 'Delivery time can only be set before pickup'; END IF;
  IF _delivery_slot NOT IN ('08:00-10:00','12:00-14:00','16:00-18:00','18:00-20:00') THEN RAISE EXCEPTION 'Invalid delivery slot'; END IF;
  IF _delivery_date < _o.pickup_date OR _delivery_date > _o.pickup_date + 14 THEN RAISE EXCEPTION 'Delivery must be on or after the pickup date'; END IF;
  UPDATE public.orders SET delivery_date = _delivery_date, delivery_slot = _delivery_slot WHERE id = _order_id;
END; $$;
REVOKE ALL ON FUNCTION public.set_order_delivery(uuid,date,text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_order_delivery(uuid,date,text) TO authenticated;