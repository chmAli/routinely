"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subDays, format, eachDayOfInterval } from "date-fns";
import type { Habit, HabitCompletion, PrayerLog, Task } from "@/lib/types/app";

export function StatsOverview({
  habits,
  completions,
  prayerLogs,
  tasks,
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  prayerLogs: PrayerLog[];
  tasks: Task[];
}) {
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  // Compute daily completion counts for chart
  const chartData = last7Days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayCompletions = completions.filter(
      (c) => c.completed_date === dateStr
    ).length;
    const dayPrayers = prayerLogs.filter(
      (p) => p.prayer_date === dateStr
    ).length;
    const dayTasks = tasks.filter(
      (t) => t.task_date === dateStr && t.completed
    ).length;

    return {
      date: format(day, "EEE"),
      habits: dayCompletions,
      prayers: dayPrayers,
      tasks: dayTasks,
    };
  });

  // Summary stats
  const totalCompletions = completions.length;
  const totalPrayers = prayerLogs.filter(
    (p) => p.status === "on_time" || p.status === "late"
  ).length;
  const totalTasks = tasks.filter((t) => t.completed).length;
  const totalTasksCreated = tasks.length;

  // Prayer on-time rate
  const onTimePrayers = prayerLogs.filter((p) => p.status === "on_time").length;
  const prayerOnTimeRate =
    prayerLogs.length > 0
      ? Math.round((onTimePrayers / prayerLogs.length) * 100)
      : 0;

  // Active habits count
  const nonPrayerHabits = habits.filter((h) => h.category !== "prayer");

  // Streak calculation (simplified - consecutive days with at least 1 completion)
  const completionDates = new Set(completions.map((c) => c.completed_date));
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(today, i), "yyyy-MM-dd");
    if (completionDates.has(dateStr)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{prayerOnTimeRate}%</p>
            <p className="text-sm text-muted-foreground">Prayers On Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{totalCompletions}</p>
            <p className="text-sm text-muted-foreground">Habits Done (30d)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">
              {totalTasks}/{totalTasksCreated}
            </p>
            <p className="text-sm text-muted-foreground">Tasks Done (30d)</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="prayers"
                  stackId="a"
                  fill="hsl(var(--chart-1))"
                  name="Prayers"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="habits"
                  stackId="a"
                  fill="hsl(var(--chart-2))"
                  name="Habits"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="tasks"
                  stackId="a"
                  fill="hsl(var(--chart-3))"
                  name="Tasks"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Per-habit stats */}
      <Card>
        <CardHeader>
          <CardTitle>Habit Completion (30 days)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nonPrayerHabits.map((habit) => {
            const habitCompletions = completions.filter(
              (c) => c.habit_id === habit.id
            ).length;
            const rate =
              habitCompletions > 0
                ? Math.round((habitCompletions / 30) * 100)
                : 0;

            return (
              <div key={habit.id} className="flex items-center gap-3">
                <span className="text-sm font-medium w-32 truncate">
                  {habit.name}
                </span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(rate, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {rate}%
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
