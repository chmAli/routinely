-- Multi-surah line items for Sabq/Sabqi revision types
-- Moves from flat single-surah columns on hifz_entries to a child table

CREATE TABLE public.hifz_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.hifz_entries(id) ON DELETE CASCADE,
    revision_type TEXT NOT NULL CHECK (revision_type IN ('sabq', 'sabqi')),
    surah INT NOT NULL CHECK (surah BETWEEN 1 AND 114),
    start_ayah INT NOT NULL CHECK (start_ayah >= 1),
    end_ayah INT NOT NULL CHECK (end_ayah >= 1),
    notes TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_ayah_order CHECK (start_ayah <= end_ayah)
);

CREATE INDEX idx_hifz_line_items_entry ON public.hifz_line_items(entry_id);
CREATE INDEX idx_hifz_line_items_entry_type ON public.hifz_line_items(entry_id, revision_type);

ALTER TABLE public.hifz_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hifz line items"
    ON public.hifz_line_items FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.hifz_entries
        WHERE id = hifz_line_items.entry_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own hifz line items"
    ON public.hifz_line_items FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.hifz_entries
        WHERE id = hifz_line_items.entry_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own hifz line items"
    ON public.hifz_line_items FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.hifz_entries
        WHERE id = hifz_line_items.entry_id AND user_id = auth.uid()
    ));

-- Migrate existing sabq data into line_items
INSERT INTO public.hifz_line_items (entry_id, revision_type, surah, start_ayah, end_ayah, notes, display_order)
SELECT id, 'sabq', sabq_surah, sabq_start_ayah, sabq_end_ayah, sabq_notes, 0
FROM public.hifz_entries
WHERE sabq_surah IS NOT NULL
  AND sabq_start_ayah IS NOT NULL
  AND sabq_end_ayah IS NOT NULL;

-- Migrate existing sabqi data into line_items
INSERT INTO public.hifz_line_items (entry_id, revision_type, surah, start_ayah, end_ayah, notes, display_order)
SELECT id, 'sabqi', sabqi_surah, sabqi_start_ayah, sabqi_end_ayah, sabqi_notes, 0
FROM public.hifz_entries
WHERE sabqi_surah IS NOT NULL
  AND sabqi_start_ayah IS NOT NULL
  AND sabqi_end_ayah IS NOT NULL;

-- Drop old flat columns (data has been migrated)
ALTER TABLE public.hifz_entries
    DROP COLUMN sabq_surah,
    DROP COLUMN sabq_start_ayah,
    DROP COLUMN sabq_end_ayah,
    DROP COLUMN sabq_notes,
    DROP COLUMN sabqi_surah,
    DROP COLUMN sabqi_start_ayah,
    DROP COLUMN sabqi_end_ayah,
    DROP COLUMN sabqi_notes;
