import { createClient } from "@/lib/supabase/server";
import { subDays, format } from "date-fns";
import { StatsOverview } from "@/components/stats/stats-overview";

export default async function StatsPage() {
  const supabase = await createClient();
  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const today = format(new Date(), "yyyy-MM-dd");

  const [habitsRes, completionsRes, prayerLogsRes, tasksRes] =
    await Promise.all([
      supabase
        .from("habits")
        .select("*")
        .is("deleted_at", null)
        .eq("is_active", true),
      supabase
        .from("habit_completions")
        .select("*")
        .gte("completed_date", thirtyDaysAgo)
        .lte("completed_date", today),
      supabase
        .from("prayer_logs")
        .select("*")
        .gte("prayer_date", thirtyDaysAgo)
        .lte("prayer_date", today),
      supabase
        .from("tasks")
        .select("*")
        .gte("task_date", thirtyDaysAgo)
        .lte("task_date", today)
        .is("deleted_at", null),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stats & Progress</h1>
        <p className="text-muted-foreground">
          Your activity over the last 30 days
        </p>
      </div>

      <StatsOverview
        habits={habitsRes.data || []}
        completions={completionsRes.data || []}
        prayerLogs={prayerLogsRes.data || []}
        tasks={tasksRes.data || []}
      />
    </div>
  );
}
