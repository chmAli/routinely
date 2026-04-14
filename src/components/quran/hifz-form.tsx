"use client";

import { useState, useTransition } from "react";
import { saveHifzEntry } from "@/lib/actions/quran";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, BookOpen, RotateCcw, Layers } from "lucide-react";
import { toast } from "sonner";
import type { HifzEntry, Surah } from "@/lib/types/app";

export function HifzForm({
  date,
  existingEntry,
  surahs,
}: {
  date: string;
  existingEntry: HifzEntry | null;
  surahs: Surah[];
}) {
  const [isPending, startTransition] = useTransition();

  const [sabqSurah, setSabqSurah] = useState<string>(
    existingEntry?.sabq_surah?.toString() || ""
  );
  const [sabqStartAyah, setSabqStartAyah] = useState(
    existingEntry?.sabq_start_ayah?.toString() || ""
  );
  const [sabqEndAyah, setSabqEndAyah] = useState(
    existingEntry?.sabq_end_ayah?.toString() || ""
  );
  const [sabqNotes, setSabqNotes] = useState(existingEntry?.sabq_notes || "");

  const [sabqiSurah, setSabqiSurah] = useState<string>(
    existingEntry?.sabqi_surah?.toString() || ""
  );
  const [sabqiStartAyah, setSabqiStartAyah] = useState(
    existingEntry?.sabqi_start_ayah?.toString() || ""
  );
  const [sabqiEndAyah, setSabqiEndAyah] = useState(
    existingEntry?.sabqi_end_ayah?.toString() || ""
  );
  const [sabqiNotes, setSabqiNotes] = useState(existingEntry?.sabqi_notes || "");

  const [manzilJuz, setManzilJuz] = useState(
    existingEntry?.manzil_juz?.toString() || ""
  );
  const [manzilNotes, setManzilNotes] = useState(
    existingEntry?.manzil_notes || ""
  );

  function handleSave() {
    startTransition(async () => {
      const result = await saveHifzEntry({
        entryDate: date,
        sabqSurah: sabqSurah ? Number(sabqSurah) : null,
        sabqStartAyah: sabqStartAyah ? Number(sabqStartAyah) : null,
        sabqEndAyah: sabqEndAyah ? Number(sabqEndAyah) : null,
        sabqNotes: sabqNotes || null,
        sabqiSurah: sabqiSurah ? Number(sabqiSurah) : null,
        sabqiStartAyah: sabqiStartAyah ? Number(sabqiStartAyah) : null,
        sabqiEndAyah: sabqiEndAyah ? Number(sabqiEndAyah) : null,
        sabqiNotes: sabqiNotes || null,
        manzilJuz: manzilJuz ? Number(manzilJuz) : null,
        manzilSurahStart: null,
        manzilSurahEnd: null,
        manzilNotes: manzilNotes || null,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hifz entry saved!");
      }
    });
  }

  const selectedSabqSurah = surahs.find((s) => s.number.toString() === sabqSurah);
  const selectedSabqiSurah = surahs.find((s) => s.number.toString() === sabqiSurah);

  return (
    <div className="space-y-4">
      {/* Sabq - New Lesson */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
            Sabq (New Lesson)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Surah</Label>
              <Select value={sabqSurah} onValueChange={(v) => v && setSabqSurah(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent>
                  {surahs.map((s) => (
                    <SelectItem key={s.number} value={s.number.toString()}>
                      {s.number}. {s.name_transliteration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>From Ayah</Label>
              <Input
                type="number"
                min={1}
                max={selectedSabqSurah?.total_ayahs}
                value={sabqStartAyah}
                onChange={(e) => setSabqStartAyah(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>To Ayah</Label>
              <Input
                type="number"
                min={1}
                max={selectedSabqSurah?.total_ayahs}
                value={sabqEndAyah}
                onChange={(e) => setSabqEndAyah(e.target.value)}
                placeholder={selectedSabqSurah?.total_ayahs?.toString() || ""}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={sabqNotes}
              onChange={(e) => setSabqNotes(e.target.value)}
              placeholder="Notes about today's lesson..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sabqi - Recent Revision */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            Sabqi (Recent Revision)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Surah</Label>
              <Select value={sabqiSurah} onValueChange={(v) => v && setSabqiSurah(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent>
                  {surahs.map((s) => (
                    <SelectItem key={s.number} value={s.number.toString()}>
                      {s.number}. {s.name_transliteration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>From Ayah</Label>
              <Input
                type="number"
                min={1}
                max={selectedSabqiSurah?.total_ayahs}
                value={sabqiStartAyah}
                onChange={(e) => setSabqiStartAyah(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>To Ayah</Label>
              <Input
                type="number"
                min={1}
                max={selectedSabqiSurah?.total_ayahs}
                value={sabqiEndAyah}
                onChange={(e) => setSabqiEndAyah(e.target.value)}
                placeholder={selectedSabqiSurah?.total_ayahs?.toString() || ""}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={sabqiNotes}
              onChange={(e) => setSabqiNotes(e.target.value)}
              placeholder="Revision notes..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manzil - Juz Revision */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5 text-purple-600" />
            Manzil (Juz Revision)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Juz Number</Label>
            <Select value={manzilJuz} onValueChange={(v) => v && setManzilJuz(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Juz" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                  <SelectItem key={juz} value={juz.toString()}>
                    Juz {juz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={manzilNotes}
              onChange={(e) => setManzilNotes(e.target.value)}
              placeholder="Manzil revision notes..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isPending} className="w-full" size="lg">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {existingEntry ? "Update" : "Save"} Today&apos;s Entry
      </Button>
    </div>
  );
}
