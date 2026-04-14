"use client";

import { useTransition } from "react";
import { logPrayer, removePrayerLog } from "@/lib/actions/prayers";
import { Checkbox } from "@/components/ui/checkbox";
import { PRAYERS } from "@/lib/constants/prayers";
import type { PrayerLog, PrayerName } from "@/lib/types/app";
import { Sunrise, Sun, CloudSun, Sunset, Moon } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
};

export function PrayerSection({
  date,
  prayerLogs,
}: {
  date: string;
  prayerLogs: PrayerLog[];
}) {
  const [isPending, startTransition] = useTransition();

  const logMap = new Map(prayerLogs.map((l) => [l.prayer, l]));

  function handleToggle(prayer: PrayerName, isCompleted: boolean) {
    startTransition(async () => {
      if (isCompleted) {
        await removePrayerLog(prayer, date);
      } else {
        await logPrayer(prayer, date, "on_time");
      }
    });
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Prayers
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {PRAYERS.map((prayer) => {
          const log = logMap.get(prayer.name);
          const isCompleted = !!log;
          const Icon = iconMap[prayer.icon];

          return (
            <button
              key={prayer.name}
              onClick={() => handleToggle(prayer.name, isCompleted)}
              disabled={isPending}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border hover:border-primary/20"
              }`}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="text-xs font-medium">{prayer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
