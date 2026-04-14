-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.prayer_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.qaza_balances
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.hifz_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Sync qaza balance when logs are inserted/deleted
CREATE OR REPLACE FUNCTION public.sync_qaza_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.qaza_balances
        SET completed_count = completed_count + NEW.count
        WHERE user_id = NEW.user_id AND prayer = NEW.prayer;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.qaza_balances
        SET completed_count = completed_count - OLD.count
        WHERE user_id = OLD.user_id AND prayer = OLD.prayer;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER on_qaza_log_change
    AFTER INSERT OR DELETE ON public.qaza_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_qaza_balance();
