CREATE OR REPLACE FUNCTION public.validate_service_unit()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.unit NOT IN ('piece','kg') THEN
    RAISE EXCEPTION 'Pricing unit must be piece or kg';
  END IF;
  IF NEW.price < 0 THEN RAISE EXCEPTION 'Price cannot be negative'; END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER services_validate_unit BEFORE INSERT OR UPDATE OF unit, price ON public.services
FOR EACH ROW EXECUTE FUNCTION public.validate_service_unit();

ALTER TABLE public.services ALTER COLUMN unit SET DEFAULT 'piece';

CREATE OR REPLACE FUNCTION public.place_order(_items jsonb, _pickup_location text, _pickup_date date, _pickup_slot text, _delivery_speed text, _notes text, _payment_method text)
 RETURNS TABLE(id uuid, code text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
  _order public.orders;
  _item jsonb;
  _svc public.services;
  _qty numeric;
  _subtotal numeric := 0;
  _fee numeric := 0;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Please sign in'; END IF;
  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) = 0 OR jsonb_array_length(_items) > 40 THEN RAISE EXCEPTION 'Add at least one item'; END IF;
  IF _pickup_date < current_date OR _pickup_date > current_date + 14 THEN RAISE EXCEPTION 'Pick a date within the next 14 days'; END IF;
  IF _pickup_slot NOT IN ('08:00-10:00','12:00-14:00','16:00-18:00','18:00-20:00') THEN RAISE EXCEPTION 'Invalid pickup slot'; END IF;
  IF _delivery_speed NOT IN ('standard','express') THEN RAISE EXCEPTION 'Invalid delivery speed'; END IF;
  IF _payment_method NOT IN ('cash','upi_on_delivery') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;

  INSERT INTO public.orders (user_id, pickup_location, pickup_date, pickup_slot, delivery_speed, notes, payment_method)
  VALUES (_uid, trim(_pickup_location), _pickup_date, _pickup_slot, _delivery_speed, left(coalesce(_notes,''),500), _payment_method)
  RETURNING * INTO _order;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    SELECT * INTO _svc FROM public.services s WHERE s.id = (_item->>'service_id')::uuid AND s.active;
    IF _svc.id IS NULL THEN RAISE EXCEPTION 'A selected item is no longer available'; END IF;
    _qty := (_item->>'quantity')::numeric;
    IF _qty IS NULL OR _qty <= 0 OR _qty > 100 THEN RAISE EXCEPTION 'Quantity for % must be a positive number', _svc.name; END IF;
    IF _svc.unit = 'kg' THEN
      _qty := round(_qty, 1);
      IF _qty <= 0 THEN RAISE EXCEPTION 'Weight for % must be positive', _svc.name; END IF;
    ELSE
      IF _qty <> trunc(_qty) THEN RAISE EXCEPTION '% is priced per piece, enter whole pieces', _svc.name; END IF;
    END IF;
    INSERT INTO public.order_items (order_id, service_id, service_name, unit, unit_price, quantity, line_total)
    VALUES (_order.id, _svc.id, _svc.name, _svc.unit, _svc.price, _qty, round(_svc.price * _qty, 2));
    _subtotal := _subtotal + round(_svc.price * _qty, 2);
  END LOOP;

  IF _delivery_speed = 'express' THEN _fee := 40; END IF;
  UPDATE public.orders SET subtotal = _subtotal, express_fee = _fee, total = _subtotal + _fee WHERE orders.id = _order.id;
  RETURN QUERY SELECT _order.id, _order.code;
END; $function$;