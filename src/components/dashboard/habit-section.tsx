"use client";

import { useTransition } from "react";
import { toggleHabitCompletion } from "@/lib/actions/habits";
import { Checkbox } from "@/components/ui/checkbox";
import type { HabitWithCompletion } from "@/lib/types/app";

export function HabitSection({
  date,
  habits,
}: {
  date: string;
  habits: HabitWithCompletion[];
}) {
  const [isPending, startTransition] = useTransition();

  // Filter out prayer habits (handled separately)
  const nonPrayerHabits = habits.filter((h) => h.category !== "prayer");

  if (nonPrayerHabits.length === 0) return null;

  // Group by category
  const grouped = nonPrayerHabits.reduce(
    (acc, habit) => {
      const cat = habit.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(habit);
      return acc;
    },
    {} as Record<string, HabitWithCompletion[]>
  );

  function handleToggle(habitId: string, completed: boolean) {
    startTransition(async () => {
      await toggleHabitCompletion(habitId, date, completed);
    });
  }

  const categoryLabels: Record<string, string> = {
    quran: "Quran",
    health: "Health",
    custom: "Habits",
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categoryHabits]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-1">
            {categoryHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={habit.completed}
                  onCheckedChange={() =>
                    handleToggle(habit.id, habit.completed)
                  }
                  disabled={isPending}
                />
                <span
                  className={`text-sm font-medium ${
                    habit.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
