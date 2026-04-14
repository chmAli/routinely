"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HabitFrequency } from "@/lib/types/app";

export async function toggleHabitCompletion(
  habitId: string,
  date: string,
  isCompleted: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (isCompleted) {
    // Remove completion
    await supabase
      .from("habit_completions")
      .delete()
      .eq("user_id", user.id)
      .eq("habit_id", habitId)
      .eq("completed_date", date);
  } else {
    // Add completion
    await supabase.from("habit_completions").insert({
      user_id: user.id,
      habit_id: habitId,
      completed_date: date,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/stats");
}

export async function createHabit(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const category = (formData.get("category") as string) || "custom";
  const frequency = (formData.get("frequency") as HabitFrequency) || "daily";
  const frequencyDaysStr = formData.get("frequencyDays") as string;
  const frequencyDays = frequencyDaysStr
    ? frequencyDaysStr.split(",").map(Number)
    : null;

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    category,
    frequency,
    frequency_days: frequencyDays,
  });

  if (error) return { error: error.message };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateHabit(habitId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const category = (formData.get("category") as string) || "custom";
  const frequency = (formData.get("frequency") as HabitFrequency) || "daily";
  const frequencyDaysStr = formData.get("frequencyDays") as string;
  const frequencyDays = frequencyDaysStr
    ? frequencyDaysStr.split(",").map(Number)
    : null;

  const { error } = await supabase
    .from("habits")
    .update({ name, category, frequency, frequency_days: frequencyDays })
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveHabit(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function restoreHabit(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .update({ is_active: true, deleted_at: null })
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return { success: true };
}
