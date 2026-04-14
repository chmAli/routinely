import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { PrayerTracker } from "@/components/prayers/prayer-tracker";
import { QazaSummary } from "@/components/prayers/qaza-summary";

export default async function PrayersPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const supabase = await createClient();

  const [prayerLogsRes, qazaBalancesRes, qazaLogsRes] = await Promise.all([
    supabase.from("prayer_logs").select("*").eq("prayer_date", today),
    supabase.from("qaza_balances").select("*"),
    supabase
      .from("qaza_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Prayer Tracker</h1>
        <p className="text-muted-foreground">
          Track your daily prayers and Qaza makeup
        </p>
      </div>

      <PrayerTracker date={today} prayerLogs={prayerLogsRes.data || []} />
      <QazaSummary
        balances={qazaBalancesRes.data || []}
        recentLogs={qazaLogsRes.data || []}
      />
    </div>
  );
}
