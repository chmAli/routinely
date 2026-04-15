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

  function getSurahName(num: number) {
    const surah = surahMap.get(num);
    return surah ? surah.name_transliteration : `Surah ${num}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => {
          const sabqItems = (entry.hifz_line_items || [])
            .filter((i) => i.revision_type === "sabq")
            .sort((a, b) => a.display_order - b.display_order);
          const sabqiItems = (entry.hifz_line_items || [])
            .filter((i) => i.revision_type === "sabqi")
            .sort((a, b) => a.display_order - b.display_order);

          return (
            <div key={entry.id} className="border-b pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-semibold mb-2">
                {format(new Date(entry.entry_date), "EEE, MMM d, yyyy")}
              </p>
              <div className="space-y-1.5">
                {sabqItems.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shrink-0">
                      Sabq
                    </Badge>
                    <span>
                      {sabqItems
                        .map((i) => `${getSurahName(i.surah)} : ${i.start_ayah}-${i.end_ayah}`)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {sabqiItems.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 shrink-0">
                      Sabqi
                    </Badge>
                    <span>
                      {sabqiItems
                        .map((i) => `${getSurahName(i.surah)} : ${i.start_ayah}-${i.end_ayah}`)
                        .join(", ")}
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
          );
        })}
      </CardContent>
    </Card>
  );
}
