CREATE TABLE public.prayer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer public.prayer_name NOT NULL,
    prayer_date DATE NOT NULL,
    status public.prayer_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_prayer_log UNIQUE (user_id, prayer, prayer_date)
);

CREATE INDEX idx_prayer_logs_user_date
    ON public.prayer_logs(user_id, prayer_date);

ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prayer logs"
    ON public.prayer_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer logs"
    ON public.prayer_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer logs"
    ON public.prayer_logs FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer logs"
    ON public.prayer_logs FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
