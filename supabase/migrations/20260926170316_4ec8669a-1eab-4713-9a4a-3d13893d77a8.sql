CREATE TYPE public.app_role AS ENUM ('admin','staff','user');
CREATE TYPE public.order_status AS ENUM ('placed','pickup_scheduled','picked_up','received','washing','drying','ironing','quality_check','packed','out_for_delivery','delivered','cancelled');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  mobile text NOT NULL DEFAULT '',
  member_type text NOT NULL DEFAULT 'student' CHECK (member_type IN ('student','staff')),
  institution_id text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT 'North-Eastern Hill University',
  campus text NOT NULL DEFAULT 'Tura Campus',
  hostel text NOT NULL DEFAULT '',
  room text NOT NULL DEFAULT '',
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- users cannot self-verify
CREATE OR REPLACE FUNCTION public.guard_profile_verification() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status AND NOT public.has_role(auth.uid(),'admin') THEN
    NEW.verification_status := OLD.verification_status;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER profiles_guard BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_verification();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, mobile, member_type, institution_id, campus, hostel)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.raw_user_meta_data->>'mobile',''),
    CASE WHEN NEW.raw_user_meta_data->>'member_type' = 'staff' THEN 'staff' ELSE 'student' END,
    COALESCE(NEW.raw_user_meta_data->>'institution_id',''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'campus',''),'Tura Campus'),
    COALESCE(NEW.raw_user_meta_data->>'hostel',''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'laundry',
  unit text NOT NULL CHECK (unit IN ('kg','item','fixed')),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  turnaround text NOT NULL DEFAULT '48 hours',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active services" ON public.services FOR SELECT USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.services (slug,name,description,category,unit,price,turnaround,sort_order) VALUES
('wash','Wash','Machine wash, sorted by colour and fabric.','laundry','kg',60,'48 hours',1),
('wash-dry','Wash and Dry','Washed and fully machine dried.','laundry','kg',80,'48 hours',2),
('wash-iron','Wash and Iron','Washed, pressed and folded.','laundry','kg',100,'48 hours',3),
('wash-dry-iron','Wash, Dry and Iron','Washed, machine dried, pressed and folded.','laundry','kg',120,'48 hours',4),
('express','Express Laundry','Priority wash, dry and fold, back the same day if booked before 10 am.','laundry','kg',160,'Same day',5),
('iron-only','Iron Only','Pressing only, for clothes that are already clean.','ironing','item',12,'24 hours',6),
('starch-iron','Starch and Iron','Light starch and press for shirts, kurtas and uniforms.','ironing','item',20,'24 hours',7),
('dry-clean-blazer','Dry Clean: Blazer or Jacket','Solvent cleaning and steam press.','dry_clean','item',250,'4 days',8),
('dry-clean-saree','Dry Clean: Saree or Mekhela','Gentle dry clean for silk and fine fabrics.','dry_clean','item',220,'4 days',9),
('delicate','Delicate Care','Hand care for woollens and fragile fabrics.','specialty','item',90,'72 hours',10),
('blanket','Blanket or Quilt','Heavy item wash and full dry.','home','fixed',150,'72 hours',11),
('bedsheet','Bedsheet Set','Bedsheet with two pillow covers, washed and pressed.','home','fixed',70,'48 hours',12),
('curtains','Curtains','Per panel, washed and pressed.','home','item',60,'72 hours',13),
('shoes','Shoe Cleaning','Deep clean for sneakers and canvas shoes.','specialty','fixed',180,'72 hours',14),
('bag','Backpack Cleaning','Hand wash for college bags.','specialty','fixed',150,'72 hours',15);

-- plans
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  period_days int NOT NULL CHECK (period_days > 0),
  kg_allowance numeric(6,2) NOT NULL DEFAULT 0,
  pickups_included int NOT NULL DEFAULT 0,
  features text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active plans" ON public.plans FOR SELECT USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage plans" ON public.plans FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.plans (slug,name,description,price,period_days,kg_allowance,pickups_included,features,sort_order) VALUES
('weekly','Weekly','For light, regular laundry.',249,7,4,1,ARRAY['4 kg wash and fold','1 pickup and delivery','48 hour turnaround'],1),
('monthly','Monthly','Most students pick this one.',899,30,16,4,ARRAY['16 kg wash and fold','4 pickups and deliveries','Ironing on 10 items','48 hour turnaround'],2),
('semester','Semester Saver','One payment for a full semester.',4299,150,80,20,ARRAY['80 kg wash and fold','20 pickups and deliveries','Ironing on 50 items','Priority slot booking'],3);

-- subscriptions
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','cancelled','expired')),
  price numeric(10,2) NOT NULL,
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','upi_on_pickup')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid')),
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own subs read" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own subs create" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending' AND payment_status = 'unpaid');
CREATE POLICY "Admins update subs" ON public.subscriptions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.subscription_price() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  SELECT price INTO NEW.price FROM public.plans WHERE id = NEW.plan_id AND active;
  IF NEW.price IS NULL THEN RAISE EXCEPTION 'Plan not available'; END IF;
  IF EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id = NEW.user_id AND status IN ('pending','active')) THEN
    RAISE EXCEPTION 'You already have a pending or active plan';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER subs_price BEFORE INSERT ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.subscription_price();

CREATE OR REPLACE FUNCTION public.cancel_my_subscription(_id uuid) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.subscriptions SET status = 'cancelled' WHERE id = _id AND user_id = auth.uid() AND status = 'pending' $$;

-- orders
CREATE SEQUENCE public.order_seq START 1;
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT ('CC-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_seq')::text, 6, '0')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'placed',
  pickup_location text NOT NULL CHECK (length(pickup_location) BETWEEN 2 AND 200),
  pickup_date date NOT NULL,
  pickup_slot text NOT NULL,
  delivery_speed text NOT NULL DEFAULT 'standard' CHECK (delivery_speed IN ('standard','express')),
  notes text NOT NULL DEFAULT '' CHECK (length(notes) <= 500),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  express_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','upi_on_delivery','subscription')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','covered')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT USAGE ON SEQUENCE public.order_seq TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own orders read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id),
  service_name text NOT NULL,
  unit text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity numeric(8,2) NOT NULL CHECK (quantity > 0),
  line_total numeric(10,2) NOT NULL
);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items read" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'))));

CREATE TABLE public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  note text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order events read" ON public.order_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'))));

CREATE OR REPLACE FUNCTION public.log_order_status() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_events (order_id, status, created_by) VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER orders_log AFTER INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

-- place order: prices computed server-side from the services table
CREATE OR REPLACE FUNCTION public.place_order(_items jsonb, _pickup_location text, _pickup_date date, _pickup_slot text, _delivery_speed text, _notes text, _payment_method text)
RETURNS TABLE (id uuid, code text) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) = 0 OR jsonb_array_length(_items) > 20 THEN RAISE EXCEPTION 'Add at least one service'; END IF;
  IF _pickup_date < current_date OR _pickup_date > current_date + 14 THEN RAISE EXCEPTION 'Pick a date within the next 14 days'; END IF;
  IF _pickup_slot NOT IN ('08:00-10:00','12:00-14:00','16:00-18:00','18:00-20:00') THEN RAISE EXCEPTION 'Invalid pickup slot'; END IF;
  IF _delivery_speed NOT IN ('standard','express') THEN RAISE EXCEPTION 'Invalid delivery speed'; END IF;
  IF _payment_method NOT IN ('cash','upi_on_delivery') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;

  INSERT INTO public.orders (user_id, pickup_location, pickup_date, pickup_slot, delivery_speed, notes, payment_method)
  VALUES (_uid, trim(_pickup_location), _pickup_date, _pickup_slot, _delivery_speed, left(coalesce(_notes,''),500), _payment_method)
  RETURNING * INTO _order;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    SELECT * INTO _svc FROM public.services s WHERE s.id = (_item->>'service_id')::uuid AND s.active;
    IF _svc.id IS NULL THEN RAISE EXCEPTION 'A selected service is no longer available'; END IF;
    _qty := (_item->>'quantity')::numeric;
    IF _qty IS NULL OR _qty <= 0 OR _qty > 100 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    IF _svc.unit <> 'kg' THEN _qty := ceil(_qty); END IF;
    INSERT INTO public.order_items (order_id, service_id, service_name, unit, unit_price, quantity, line_total)
    VALUES (_order.id, _svc.id, _svc.name, _svc.unit, _svc.price, _qty, round(_svc.price * _qty, 2));
    _subtotal := _subtotal + round(_svc.price * _qty, 2);
  END LOOP;

  IF _delivery_speed = 'express' THEN _fee := 40; END IF;
  UPDATE public.orders SET subtotal = _subtotal, express_fee = _fee, total = _subtotal + _fee WHERE orders.id = _order.id;
  RETURN QUERY SELECT _order.id, _order.code;
END; $$;
REVOKE ALL ON FUNCTION public.place_order(jsonb,text,date,text,text,text,text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb,text,date,text,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.cancel_my_order(_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.orders SET status = 'cancelled' WHERE id = _id AND user_id = auth.uid() AND status IN ('placed','pickup_scheduled');
  IF NOT FOUND THEN RAISE EXCEPTION 'This order can no longer be cancelled'; END IF;
END; $$;
REVOKE ALL ON FUNCTION public.cancel_my_order(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cancel_my_order(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.cancel_my_subscription(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cancel_my_subscription(uuid) TO authenticated;

-- public tracking by code: status only, no personal data
CREATE OR REPLACE FUNCTION public.track_order(_code text) RETURNS TABLE (code text, status public.order_status, pickup_date date, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.code, o.status, o.pickup_date, o.updated_at FROM public.orders o WHERE o.code = upper(trim(_code)) LIMIT 1 $$;
GRANT EXECUTE ON FUNCTION public.track_order(text) TO anon, authenticated;