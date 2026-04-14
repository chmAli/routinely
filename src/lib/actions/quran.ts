"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveHifzEntry(data: {
  entryDate: string;
  sabqSurah: number | null;
  sabqStartAyah: number | null;
  sabqEndAyah: number | null;
  sabqNotes: string | null;
  sabqiSurah: number | null;
  sabqiStartAyah: number | null;
  sabqiEndAyah: number | null;
  sabqiNotes: string | null;
  manzilJuz: number | null;
  manzilSurahStart: number | null;
  manzilSurahEnd: number | null;
  manzilNotes: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("hifz_entries").upsert(
    {
      user_id: user.id,
      entry_date: data.entryDate,
      sabq_surah: data.sabqSurah,
      sabq_start_ayah: data.sabqStartAyah,
      sabq_end_ayah: data.sabqEndAyah,
      sabq_notes: data.sabqNotes,
      sabqi_surah: data.sabqiSurah,
      sabqi_start_ayah: data.sabqiStartAyah,
      sabqi_end_ayah: data.sabqiEndAyah,
      sabqi_notes: data.sabqiNotes,
      manzil_juz: data.manzilJuz,
      manzil_surah_start: data.manzilSurahStart,
      manzil_surah_end: data.manzilSurahEnd,
      manzil_notes: data.manzilNotes,
    },
    { onConflict: "user_id,entry_date" }
  );

  if (error) return { error: error.message };

  revalidatePath("/quran");
  return { success: true };
}
