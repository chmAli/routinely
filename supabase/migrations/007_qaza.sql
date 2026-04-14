-- Qaza balances: one row per user per prayer type
CREATE TABLE public.qaza_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer public.prayer_name NOT NULL,
    initial_count INT NOT NULL DEFAULT 0,
    completed_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_qaza_balance UNIQUE (user_id, prayer),
    CONSTRAINT chk_counts_non_negative CHECK (initial_count >= 0 AND completed_count >= 0)
);

CREATE INDEX idx_qaza_balances_user ON public.qaza_balances(user_id);

ALTER TABLE public.qaza_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own qaza balances"
    ON public.qaza_balances FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qaza balances"
    ON public.qaza_balances FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qaza balances"
    ON public.qaza_balances FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Qaza logs: individual makeup entries
CREATE TABLE public.qaza_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prayer public.prayer_name NOT NULL,
    log_date DATE NOT NULL,
    count INT NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_count_positive CHECK (count > 0)
);

CREATE INDEX idx_qaza_logs_user_date ON public.qaza_logs(user_id, log_date);
CREATE INDEX idx_qaza_logs_user_prayer ON public.qaza_logs(user_id, prayer);

ALTER TABLE public.qaza_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own qaza logs"
    ON public.qaza_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qaza logs"
    ON public.qaza_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own qaza logs"
    ON public.qaza_logs FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
