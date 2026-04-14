import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { DateNavigator } from "@/components/dashboard/date-navigator";
import { PrayerSection } from "@/components/dashboard/prayer-section";
import { HabitSection } from "@/components/dashboard/habit-section";
import { TaskSection } from "@/components/dashboard/task-section";
import { DayProgress } from "@/components/dashboard/day-progress";
import { isHabitDueOnDate } from "@/lib/utils/dates";
import type { HabitWithCompletion } from "@/lib/types/app";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const currentDate = params.date || format(new Date(), "yyyy-MM-dd");
  const dateObj = new Date(currentDate + "T00:00:00");

  const supabase = await createClient();

  const [habitsRes, completionsRes, prayerLogsRes, tasksRes] =
    await Promise.all([
      supabase
        .from("habits")
        .select("*")
        .is("deleted_at", null)
        .eq("is_active", true)
        .order("display_order"),
      supabase
        .from("habit_completions")
        .select("*")
        .eq("completed_date", currentDate),
      supabase
        .from("prayer_logs")
        .select("*")
        .eq("prayer_date", currentDate),
      supabase
        .from("tasks")
        .select("*")
        .eq("task_date", currentDate)
        .is("deleted_at", null)
        .order("display_order"),
    ]);

  const habits = habitsRes.data || [];
  const completions = completionsRes.data || [];
  const prayerLogs = prayerLogsRes.data || [];
  const tasks = tasksRes.data || [];

  const completionSet = new Set(completions.map((c) => c.habit_id));

  // Filter habits due on this date and merge completion status
  const habitsWithCompletion: HabitWithCompletion[] = habits
    .filter((h) => isHabitDueOnDate(h, dateObj))
    .map((h) => ({
      ...h,
      completed: completionSet.has(h.id),
    }));

  const nonPrayerHabits = habitsWithCompletion.filter(
    (h) => h.category !== "prayer"
  );
  const prayerHabitsCompleted = prayerLogs.length;
  const habitsCompleted = nonPrayerHabits.filter((h) => h.completed).length;
  const tasksCompleted = tasks.filter((t) => t.completed).length;

  const totalItems = 5 + nonPrayerHabits.length + tasks.length;
  const completedItems = prayerHabitsCompleted + habitsCompleted + tasksCompleted;

  return (
    <div className="space-y-6">
      <DateNavigator currentDate={currentDate} />
      <DayProgress completedCount={completedItems} totalCount={totalItems} />
      <PrayerSection date={currentDate} prayerLogs={prayerLogs} />
      <HabitSection date={currentDate} habits={habitsWithCompletion} />
      <TaskSection date={currentDate} tasks={tasks} />
    </div>
  );
}
