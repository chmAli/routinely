"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveHifzEntry(data: {
  entryDate: string;
  manzilJuz: number | null;
  manzilSurahStart: number | null;
  manzilSurahEnd: number | null;
  manzilNotes: string | null;
  lineItems: Array<{
    revisionType: "sabq" | "sabqi";
    surah: number;
    startAyah: number;
    endAyah: number;
    notes: string | null;
    displayOrder: number;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Upsert parent entry (manzil fields only) and get its id
  const { data: entry, error: upsertError } = await supabase
    .from("hifz_entries")
    .upsert(
      {
        user_id: user.id,
        entry_date: data.entryDate,
        manzil_juz: data.manzilJuz,
        manzil_surah_start: data.manzilSurahStart,
        manzil_surah_end: data.manzilSurahEnd,
        manzil_notes: data.manzilNotes,
      },
      { onConflict: "user_id,entry_date" }
    )
    .select("id")
    .single();

  if (upsertError || !entry) {
    return { error: upsertError?.message || "Failed to save entry" };
  }

  // Delete existing line items for this entry
  const { error: deleteError } = await supabase
    .from("hifz_line_items")
    .delete()
    .eq("entry_id", entry.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  // Bulk insert new line items
  if (data.lineItems.length > 0) {
    const { error: insertError } = await supabase
      .from("hifz_line_items")
      .insert(
        data.lineItems.map((item) => ({
          entry_id: entry.id,
          revision_type: item.revisionType,
          surah: item.surah,
          start_ayah: item.startAyah,
          end_ayah: item.endAyah,
          notes: item.notes,
          display_order: item.displayOrder,
        }))
      );

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/quran");
  return { success: true };
}
