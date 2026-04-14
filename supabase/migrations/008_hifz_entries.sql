CREATE TABLE public.hifz_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,

    -- Sabq (new lesson)
    sabq_surah INT,
    sabq_start_ayah INT,
    sabq_end_ayah INT,
    sabq_notes TEXT,

    -- Sabqi (recent revision)
    sabqi_surah INT,
    sabqi_start_ayah INT,
    sabqi_end_ayah INT,
    sabqi_notes TEXT,

    -- Manzil (older revision)
    manzil_juz INT,
    manzil_surah_start INT,
    manzil_surah_end INT,
    manzil_notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_hifz_entry UNIQUE (user_id, entry_date),
    CONSTRAINT chk_sabq_surah CHECK (sabq_surah IS NULL OR (sabq_surah BETWEEN 1 AND 114)),
    CONSTRAINT chk_sabqi_surah CHECK (sabqi_surah IS NULL OR (sabqi_surah BETWEEN 1 AND 114)),
    CONSTRAINT chk_manzil_juz CHECK (manzil_juz IS NULL OR (manzil_juz BETWEEN 1 AND 30)),
    CONSTRAINT chk_sabq_ayah_order CHECK (
        sabq_start_ayah IS NULL OR sabq_end_ayah IS NULL
        OR sabq_start_ayah <= sabq_end_ayah
    ),
    CONSTRAINT chk_sabqi_ayah_order CHECK (
        sabqi_start_ayah IS NULL OR sabqi_end_ayah IS NULL
        OR sabqi_start_ayah <= sabqi_end_ayah
    )
);

CREATE INDEX idx_hifz_entries_user_date ON public.hifz_entries(user_id, entry_date);

ALTER TABLE public.hifz_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hifz entries"
    ON public.hifz_entries FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hifz entries"
    ON public.hifz_entries FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hifz entries"
    ON public.hifz_entries FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hifz entries"
    ON public.hifz_entries FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
