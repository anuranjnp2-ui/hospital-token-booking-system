
-- Create admin role check using user_roles pattern
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Hospital info
CREATE TABLE public.hospital_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'City Hospital',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  description TEXT DEFAULT '',
  operating_hours TEXT DEFAULT '9:00 AM - 5:00 PM',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read hospital info" ON public.hospital_info FOR SELECT USING (true);
CREATE POLICY "Admins can manage hospital info" ON public.hospital_info FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Doctors
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualification TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Admins can insert doctors" ON public.doctors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update doctors" ON public.doctors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete doctors" ON public.doctors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'activity',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Tokens
CREATE TABLE public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number INTEGER NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'consulting', 'completed', 'cancelled')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (date, token_number)
);
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can book tokens" ON public.tokens FOR INSERT TO public WITH CHECK (created_by IS NULL OR created_by = auth.uid());
CREATE POLICY "Authenticated owners can update tokens" ON public.tokens FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "Authenticated owners can delete tokens" ON public.tokens FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Admins can update tokens" ON public.tokens FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tokens" ON public.tokens FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Doctor breaks
CREATE TABLE public.doctor_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  break_type TEXT NOT NULL DEFAULT 'Tea Break' CHECK (break_type IN ('Tea Break', 'Lunch Break', 'Other')),
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.doctor_breaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read breaks" ON public.doctor_breaks FOR SELECT USING (true);
CREATE POLICY "Admins can insert breaks" ON public.doctor_breaks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update breaks" ON public.doctor_breaks FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete breaks" ON public.doctor_breaks FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Function to get next token number for today
CREATE OR REPLACE FUNCTION public.get_next_token_number()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(token_number), 0) + 1 FROM public.tokens WHERE date = CURRENT_DATE
$$;

-- Function to book a token in a safe serialized way
CREATE OR REPLACE FUNCTION public.book_token(_patient_name TEXT, _phone TEXT, _created_by UUID)
RETURNS public.tokens
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(283728);
  next_number := (SELECT COALESCE(MAX(token_number), 0) + 1 FROM public.tokens WHERE date = CURRENT_DATE);

  RETURN QUERY
  INSERT INTO public.tokens (token_number, patient_name, phone, date, created_by)
  VALUES (next_number, _patient_name, _phone, CURRENT_DATE, _created_by)
  RETURNING *;
END;
$$;

-- Seed hospital info
INSERT INTO public.hospital_info (name, address, phone, email, description, operating_hours)
VALUES ('City General Hospital', '123 Medical Avenue, Healthcare City', '+91 98765 43210', 'info@cityhospital.com', 'City General Hospital is a multi-specialty hospital providing quality healthcare services since 1995. We are committed to delivering the best medical care with state-of-the-art facilities and experienced doctors.', '9:00 AM - 6:00 PM, Monday - Saturday');

-- Seed doctors
INSERT INTO public.doctors (name, specialty, qualification) VALUES
('Dr. Rajesh Kumar', 'General Medicine', 'MBBS, MD'),
('Dr. Priya Sharma', 'Pediatrics', 'MBBS, DCH'),
('Dr. Anand Patel', 'Cardiology', 'MBBS, DM Cardiology');

-- Seed services
INSERT INTO public.services (name, description, icon) VALUES
('ECG', 'Electrocardiogram testing for heart monitoring', 'heart-pulse'),
('Lab Test', 'Complete blood work and pathology testing', 'test-tubes'),
('X-Ray', 'Digital X-Ray imaging services', 'scan'),
('Ultrasound', 'Ultrasound scanning and imaging', 'monitor'),
('Pharmacy', '24/7 pharmacy with all medicines', 'pill');

-- RLS for user_roles
CREATE POLICY "Admins can read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
