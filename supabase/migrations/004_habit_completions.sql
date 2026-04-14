CREATE TABLE public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_habit_completion UNIQUE (user_id, habit_id, completed_date)
);

CREATE INDEX idx_habit_completions_user_date
    ON public.habit_completions(user_id, completed_date);
CREATE INDEX idx_habit_completions_habit_date
    ON public.habit_completions(habit_id, completed_date);

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
    ON public.habit_completions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
    ON public.habit_completions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
    ON public.habit_completions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
