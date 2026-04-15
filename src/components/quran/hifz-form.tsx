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
import { Loader2, BookOpen, RotateCcw, Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { HifzEntry, HifzLineItem, RevisionType, Surah } from "@/lib/types/app";

interface LineItemDraft {
  id: string;
  surah: string;
  startAyah: string;
  endAyah: string;
  notes: string;
}

function draftsFromExisting(
  items: HifzLineItem[] | undefined,
  type: RevisionType
): LineItemDraft[] {
  return (items || [])
    .filter((i) => i.revision_type === type)
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => ({
      id: crypto.randomUUID(),
      surah: i.surah.toString(),
      startAyah: i.start_ayah.toString(),
      endAyah: i.end_ayah.toString(),
      notes: i.notes || "",
    }));
}

function SurahLineItem({
  item,
  surahs,
  onUpdate,
  onRemove,
}: {
  item: LineItemDraft;
  surahs: Surah[];
  onUpdate: (field: keyof LineItemDraft, value: string) => void;
  onRemove: () => void;
}) {
  const selectedSurah = surahs.find((s) => s.number.toString() === item.surah);

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="grid grid-cols-[1fr_80px_80px_40px] gap-2 items-end">
        <div className="space-y-1.5">
          <Label className="text-xs">Surah</Label>
          <Select value={item.surah} onValueChange={(v) => v && onUpdate("surah", v)}>
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
          <Label className="text-xs">From</Label>
          <Input
            type="number"
            min={1}
            max={selectedSurah?.total_ayahs}
            value={item.startAyah}
            onChange={(e) => onUpdate("startAyah", e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">To</Label>
          <Input
            type="number"
            min={1}
            max={selectedSurah?.total_ayahs}
            value={item.endAyah}
            onChange={(e) => onUpdate("endAyah", e.target.value)}
            placeholder={selectedSurah?.total_ayahs?.toString() || ""}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={item.notes}
        onChange={(e) => onUpdate("notes", e.target.value)}
        placeholder="Notes (optional)..."
        rows={1}
        className="text-sm"
      />
    </div>
  );
}

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

  const [sabqItems, setSabqItems] = useState<LineItemDraft[]>(
    draftsFromExisting(existingEntry?.hifz_line_items, "sabq")
  );
  const [sabqiItems, setSabqiItems] = useState<LineItemDraft[]>(
    draftsFromExisting(existingEntry?.hifz_line_items, "sabqi")
  );

  const [manzilJuz, setManzilJuz] = useState(
    existingEntry?.manzil_juz?.toString() || ""
  );
  const [manzilNotes, setManzilNotes] = useState(
    existingEntry?.manzil_notes || ""
  );

  function addItem(type: RevisionType) {
    const blank: LineItemDraft = {
      id: crypto.randomUUID(),
      surah: "",
      startAyah: "",
      endAyah: "",
      notes: "",
    };
    if (type === "sabq") setSabqItems((prev) => [...prev, blank]);
    else setSabqiItems((prev) => [...prev, blank]);
  }

  function removeItem(type: RevisionType, id: string) {
    if (type === "sabq") setSabqItems((prev) => prev.filter((i) => i.id !== id));
    else setSabqiItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(type: RevisionType, id: string, field: keyof LineItemDraft, value: string) {
    const updater = (prev: LineItemDraft[]) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i));
    if (type === "sabq") setSabqItems(updater);
    else setSabqiItems(updater);
  }

  function handleSave() {
    startTransition(async () => {
      const toLineItems = (items: LineItemDraft[], type: RevisionType) =>
        items
          .filter((i) => i.surah)
          .map((item, idx) => ({
            revisionType: type,
            surah: Number(item.surah),
            startAyah: Number(item.startAyah) || 1,
            endAyah: Number(item.endAyah) || 1,
            notes: item.notes || null,
            displayOrder: idx,
          }));

      const result = await saveHifzEntry({
        entryDate: date,
        manzilJuz: manzilJuz ? Number(manzilJuz) : null,
        manzilSurahStart: null,
        manzilSurahEnd: null,
        manzilNotes: manzilNotes || null,
        lineItems: [...toLineItems(sabqItems, "sabq"), ...toLineItems(sabqiItems, "sabqi")],
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Hifz entry saved!");
      }
    });
  }

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
          {sabqItems.map((item) => (
            <SurahLineItem
              key={item.id}
              item={item}
              surahs={surahs}
              onUpdate={(field, value) => updateItem("sabq", item.id, field, value)}
              onRemove={() => removeItem("sabq", item.id)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("sabq")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Surah
          </Button>
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
          {sabqiItems.map((item) => (
            <SurahLineItem
              key={item.id}
              item={item}
              surahs={surahs}
              onUpdate={(field, value) => updateItem("sabqi", item.id, field, value)}
              onRemove={() => removeItem("sabqi", item.id)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("sabqi")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Surah
          </Button>
        </CardContent>
      </Card>

      {/* Manzil - Juz Revision (unchanged) */}
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
