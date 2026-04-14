import { format, getISODay } from "date-fns";
import type { Habit } from "@/lib/types/app";

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDisplayDate(date: Date): string {
  return format(date, "EEE, MMM d, yyyy");
}

export function isHabitDueOnDate(habit: Habit, date: Date): boolean {
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "specific_days" && habit.frequency_days) {
    const dayOfWeek = getISODay(date); // 1=Mon, 7=Sun
    return habit.frequency_days.includes(dayOfWeek);
  }
  if (habit.frequency === "weekly") {
    return getISODay(date) === 1; // Show on Mondays
  }
  return false;
}
