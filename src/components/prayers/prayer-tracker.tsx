"use client";

import { useTransition } from "react";
import { logPrayer, removePrayerLog } from "@/lib/actions/prayers";
import { PRAYERS, PRAYER_STATUS_LABELS } from "@/lib/constants/prayers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X, Sunrise, Sun, CloudSun, Sunset, Moon } from "lucide-react";
import type { PrayerLog, PrayerName, PrayerStatus } from "@/lib/types/app";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise, Sun, CloudSun, Sunset, Moon,
};

const statusIcons: Record<PrayerStatus, React.ComponentType<{ className?: string }>> = {
  on_time: Check,
  late: Clock,
  missed: X,
};

const statusColors: Record<PrayerStatus, string> = {
  on_time: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  missed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function PrayerTracker({
  date,
  prayerLogs,
}: {
  date: string;
  prayerLogs: PrayerLog[];
}) {
  const [isPending, startTransition] = useTransition();
  const logMap = new Map(prayerLogs.map((l) => [l.prayer, l]));

  function handleStatusChange(prayer: PrayerName, status: string) {
    startTransition(async () => {
      if (status === "none") {
        await removePrayerLog(prayer, date);
      } else {
        await logPrayer(prayer, date, status as PrayerStatus);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Prayers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {PRAYERS.map((prayer) => {
          const log = logMap.get(prayer.name);
          const Icon = iconMap[prayer.icon];
          const status = log?.status;

          return (
            <div
              key={prayer.name}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                <span className="font-medium">{prayer.label}</span>
                {status && (
                  <Badge
                    variant="secondary"
                    className={statusColors[status]}
                  >
                    {PRAYER_STATUS_LABELS[status]}
                  </Badge>
                )}
              </div>
              <Select
                value={status || "none"}
                onValueChange={(val) => val && handleStatusChange(prayer.name, val)}
                disabled={isPending}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not logged</SelectItem>
                  <SelectItem value="on_time">On Time</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
