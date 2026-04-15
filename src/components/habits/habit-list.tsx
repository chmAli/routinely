"use client";

import { useState, useTransition } from "react";
import { createHabit, archiveHabit, restoreHabit } from "@/lib/actions/habits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Archive, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Habit, HabitFrequency } from "@/lib/types/app";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitList({ habits }: { habits: Habit[] }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("custom");
  const [newFrequency, setNewFrequency] = useState<HabitFrequency>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const activeHabits = habits.filter((h) => h.is_active);
  const archivedHabits = habits.filter((h) => !h.is_active);

  const grouped = activeHabits.reduce(
    (acc, h) => {
      if (!acc[h.category]) acc[h.category] = [];
      acc[h.category].push(h);
      return acc;
    },
    {} as Record<string, Habit[]>
  );

  function handleCreate() {
    const formData = new FormData();
    formData.set("name", newName);
    formData.set("category", newCategory);
    formData.set("frequency", newFrequency);
    if (newFrequency === "specific_days") {
      formData.set("frequencyDays", selectedDays.join(","));
    }

    startTransition(async () => {
      const result = await createHabit(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Habit created!");
        setDialogOpen(false);
        setNewName("");
        setNewCategory("custom");
        setNewFrequency("daily");
        setSelectedDays([]);
      }
    });
  }

  function handleArchive(habitId: string) {
    startTransition(async () => {
      await archiveHabit(habitId);
      toast.success("Habit archived");
    });
  }

  function handleRestore(habitId: string) {
    startTransition(async () => {
      await restoreHabit(habitId);
      toast.success("Habit restored");
    });
  }

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  const categoryLabels: Record<string, string> = {
    prayer: "Prayer",
    quran: "Quran",
    health: "Health",
    custom: "Custom",
  };

  return (
    <div className="space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger render={<Button className="gap-2" />}>
          <Plus className="h-4 w-4" />
          New Habit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Habit Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Read 10 pages"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={(v) => v && setNewCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="quran">Quran</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={newFrequency}
                onValueChange={(v) => v && setNewFrequency(v as HabitFrequency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Every day</SelectItem>
                  <SelectItem value="specific_days">Specific days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newFrequency === "specific_days" && (
              <div className="space-y-2">
                <Label>Select Days</Label>
                <div className="flex gap-1.5">
                  {DAY_LABELS.map((label, i) => (
                    <Button
                      key={label}
                      variant={selectedDays.includes(i + 1) ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => toggleDay(i + 1)}
                    >
                      {label.charAt(0)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button
              onClick={handleCreate}
              disabled={isPending || !newName.trim()}
              className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Habit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {Object.entries(grouped).map(([category, categoryHabits]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-1.5">
            {categoryHabits.map((habit) => (
              <Card key={habit.id}>
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div>
                    <span className="font-medium">{habit.name}</span>
                    <div className="flex gap-1.5 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {habit.frequency === "daily"
                          ? "Daily"
                          : habit.frequency === "weekly"
                            ? "Weekly"
                            : `${habit.frequency_days?.length || 0} days/week`}
                      </Badge>
                      {habit.is_system && (
                        <Badge variant="secondary" className="text-xs">
                          System
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!habit.is_system && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(habit.id)}
                      disabled={isPending}
                    >
                      <Archive className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {archivedHabits.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Archived
          </h3>
          {archivedHabits.map((habit) => (
            <Card key={habit.id} className="opacity-60">
              <CardContent className="flex items-center justify-between py-3 px-4">
                <span className="font-medium line-through">{habit.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleRestore(habit.id)}
                  disabled={isPending}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
