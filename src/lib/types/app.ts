export type HabitFrequency = "daily" | "specific_days" | "weekly";
export type TaskPriority = "low" | "medium" | "high";
export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerStatus = "on_time" | "late" | "missed";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  frequency: HabitFrequency;
  frequency_days: number[] | null;
  is_system: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HabitCompletion {
  id: string;
  user_id: string;
  habit_id: string;
  completed_date: string;
  notes: string | null;
  created_at: string;
}

export interface HabitWithCompletion extends Habit {
  completed: boolean;
}

export interface PrayerLog {
  id: string;
  user_id: string;
  prayer: PrayerName;
  prayer_date: string;
  status: PrayerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  task_date: string;
  completed: boolean;
  priority: TaskPriority;
  display_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface QazaBalance {
  id: string;
  user_id: string;
  prayer: PrayerName;
  initial_count: number;
  completed_count: number;
  created_at: string;
  updated_at: string;
}

export interface QazaLog {
  id: string;
  user_id: string;
  prayer: PrayerName;
  log_date: string;
  count: number;
  notes: string | null;
  created_at: string;
}

export type RevisionType = "sabq" | "sabqi";

export interface HifzLineItem {
  id: string;
  entry_id: string;
  revision_type: RevisionType;
  surah: number;
  start_ayah: number;
  end_ayah: number;
  notes: string | null;
  display_order: number;
  created_at: string;
}

export interface HifzEntry {
  id: string;
  user_id: string;
  entry_date: string;
  manzil_juz: number | null;
  manzil_surah_start: number | null;
  manzil_surah_end: number | null;
  manzil_notes: string | null;
  created_at: string;
  updated_at: string;
  hifz_line_items?: HifzLineItem[];
}

export interface Surah {
  number: number;
  name_arabic: string;
  name_english: string;
  name_transliteration: string;
  total_ayahs: number;
  juz_start: number;
}
