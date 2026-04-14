import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { HifzEntry, Surah } from "@/lib/types/app";

export function HifzHistory({
  entries,
  surahs,
}: {
  entries: HifzEntry[];
  surahs: Surah[];
}) {
  const surahMap = new Map(surahs.map((s) => [s.number, s]));

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hifz entries yet. Start logging your progress above.
        </CardContent>
      </Card>
    );
  }

  function getSurahName(num: number | null) {
    if (!num) return "";
    const surah = surahMap.get(num);
    return surah ? surah.name_transliteration : `Surah ${num}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border-b pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-semibold mb-2">
              {format(new Date(entry.entry_date), "EEE, MMM d, yyyy")}
            </p>
            <div className="space-y-1.5">
              {entry.sabq_surah && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Sabq
                  </Badge>
                  <span>
                    {getSurahName(entry.sabq_surah)} : {entry.sabq_start_ayah}-
                    {entry.sabq_end_ayah}
                  </span>
                </div>
              )}
              {entry.sabqi_surah && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Sabqi
                  </Badge>
                  <span>
                    {getSurahName(entry.sabqi_surah)} : {entry.sabqi_start_ayah}-
                    {entry.sabqi_end_ayah}
                  </span>
                </div>
              )}
              {entry.manzil_juz && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Manzil
                  </Badge>
                  <span>Juz {entry.manzil_juz}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
