import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { HifzForm } from "@/components/quran/hifz-form";
import { HifzHistory } from "@/components/quran/hifz-history";

export default async function QuranPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const supabase = await createClient();

  const [todayEntryRes, historyRes, surahsRes] = await Promise.all([
    supabase
      .from("hifz_entries")
      .select("*, hifz_line_items(*)")
      .eq("entry_date", today)
      .maybeSingle(),
    supabase
      .from("hifz_entries")
      .select("*, hifz_line_items(*)")
      .order("entry_date", { ascending: false })
      .limit(30),
    supabase
      .from("surahs")
      .select("*")
      .order("number"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Quran Hifz Tracker</h1>
        <p className="text-muted-foreground">
          Track your Sabq, Sabqi, and Manzil daily
        </p>
      </div>

      <HifzForm
        date={today}
        existingEntry={todayEntryRes.data}
        surahs={surahsRes.data || []}
      />

      <HifzHistory entries={historyRes.data || []} surahs={surahsRes.data || []} />
    </div>
  );
}
