-- Seed default data when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );

    -- Seed default habits
    INSERT INTO public.habits (user_id, name, category, frequency, is_system, display_order)
    VALUES
        (NEW.id, 'Fajr',    'prayer',   'daily', true, 1),
        (NEW.id, 'Dhuhr',   'prayer',   'daily', true, 2),
        (NEW.id, 'Asr',     'prayer',   'daily', true, 3),
        (NEW.id, 'Maghrib', 'prayer',   'daily', true, 4),
        (NEW.id, 'Isha',    'prayer',   'daily', true, 5),
        (NEW.id, 'Quran Reading', 'quran', 'daily', true, 6),
        (NEW.id, 'Exercise', 'health',  'daily', true, 7);

    -- Initialize qaza balances at 0 for all 5 prayers
    INSERT INTO public.qaza_balances (user_id, prayer, initial_count, completed_count)
    VALUES
        (NEW.id, 'fajr', 0, 0),
        (NEW.id, 'dhuhr', 0, 0),
        (NEW.id, 'asr', 0, 0),
        (NEW.id, 'maghrib', 0, 0),
        (NEW.id, 'isha', 0, 0);

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
