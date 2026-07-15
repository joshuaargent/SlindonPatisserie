-- ============================================
-- Migration: Update User trigger to save phone number
-- Run this in your Supabase SQL Editor
-- ============================================

-- Update the auth trigger to store phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, phone, "authId")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_app_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'phone',
    NEW.id
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing users to link authId if not already linked
UPDATE "User" u
SET "authId" = (
  SELECT id FROM auth.users WHERE email = u.email LIMIT 1
)
WHERE "authId" IS NULL AND email IN (SELECT email FROM auth.users);
