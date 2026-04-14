import type { PrayerName } from "@/lib/types/app";

export const PRAYERS: { name: PrayerName; label: string; icon: string }[] = [
  { name: "fajr", label: "Fajr", icon: "Sunrise" },
  { name: "dhuhr", label: "Dhuhr", icon: "Sun" },
  { name: "asr", label: "Asr", icon: "CloudSun" },
  { name: "maghrib", label: "Maghrib", icon: "Sunset" },
  { name: "isha", label: "Isha", icon: "Moon" },
];

export const PRAYER_STATUS_LABELS = {
  on_time: "On Time",
  late: "Late",
  missed: "Missed",
} as const;
