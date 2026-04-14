"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PrayerName, PrayerStatus } from "@/lib/types/app";

export async function logPrayer(
  prayer: PrayerName,
  date: string,
  status: PrayerStatus
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("prayer_logs").upsert(
    {
      user_id: user.id,
      prayer,
      prayer_date: date,
      status,
    },
    { onConflict: "user_id,prayer,prayer_date" }
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/prayers");
  return { success: true };
}

export async function removePrayerLog(prayer: PrayerName, date: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("prayer_logs")
    .delete()
    .eq("user_id", user.id)
    .eq("prayer", prayer)
    .eq("prayer_date", date);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/prayers");
  return { success: true };
}

export async function updateQazaInitialCount(
  prayer: PrayerName,
  initialCount: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("qaza_balances")
    .update({ initial_count: initialCount })
    .eq("user_id", user.id)
    .eq("prayer", prayer);

  if (error) return { error: error.message };

  revalidatePath("/prayers");
  return { success: true };
}

export async function logQazaMakeup(
  prayer: PrayerName,
  count: number,
  date: string,
  notes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("qaza_logs").insert({
    user_id: user.id,
    prayer,
    log_date: date,
    count,
    notes: notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/prayers");
  return { success: true };
}
