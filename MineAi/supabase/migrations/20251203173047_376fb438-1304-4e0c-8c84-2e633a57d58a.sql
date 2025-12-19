-- Seed admin account: admin@mineai.com with role 'admin'
-- Note: The password must be set via Supabase Auth, this seeds the role after user exists

-- Create a function to seed admin role when the admin user signs up
CREATE OR REPLACE FUNCTION public.seed_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user's email is admin@mineai.com, assign admin role
  IF NEW.email = 'admin@mineai.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Assign default 'user' role to all other users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign roles on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_admin_role();