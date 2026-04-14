"use client";

import { useState, useTransition } from "react";
import { updateQazaInitialCount, logQazaMakeup } from "@/lib/actions/prayers";
import { PRAYERS } from "@/lib/constants/prayers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus, Settings2 } from "lucide-react";
import { format } from "date-fns";
import type { QazaBalance, QazaLog, PrayerName } from "@/lib/types/app";

export function QazaSummary({
  balances,
  recentLogs,
}: {
  balances: QazaBalance[];
  recentLogs: QazaLog[];
}) {
  const [isPending, startTransition] = useTransition();
  const balanceMap = new Map(balances.map((b) => [b.prayer, b]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qaza Prayers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PRAYERS.map((prayer) => {
          const balance = balanceMap.get(prayer.name);
          const remaining = balance
            ? balance.initial_count - balance.completed_count
            : 0;

          return (
            <QazaRow
              key={prayer.name}
              prayer={prayer.name}
              label={prayer.label}
              remaining={remaining}
              initialCount={balance?.initial_count || 0}
              isPending={isPending}
              startTransition={startTransition}
            />
          );
        })}

        {recentLogs.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Recent Makeup Log
            </h4>
            <div className="space-y-1">
              {recentLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-sm py-1.5 border-b last:border-0"
                >
                  <span className="capitalize">{log.prayer}</span>
                  <span className="text-muted-foreground">
                    +{log.count} on {format(new Date(log.log_date), "MMM d")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QazaRow({
  prayer,
  label,
  remaining,
  initialCount,
  isPending,
  startTransition,
}: {
  prayer: PrayerName;
  label: string;
  remaining: number;
  initialCount: number;
  isPending: boolean;
  startTransition: (fn: () => Promise<void>) => void;
}) {
  const [makeupCount, setMakeupCount] = useState(1);
  const [newInitial, setNewInitial] = useState(initialCount);

  function handleMakeup() {
    const today = format(new Date(), "yyyy-MM-dd");
    startTransition(async () => {
      await logQazaMakeup(prayer, makeupCount, today);
      setMakeupCount(1);
    });
  }

  function handleUpdateInitial() {
    startTransition(async () => {
      await updateQazaInitialCount(prayer, newInitial);
    });
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div>
        <span className="font-medium">{label}</span>
        <p className="text-2xl font-bold tabular-nums">{remaining}</p>
        <span className="text-xs text-muted-foreground">remaining</span>
      </div>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" size="sm" className="gap-1">
              <Minus className="h-3.5 w-3.5" />
              Log Makeup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Qaza Makeup - {label}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Number of prayers made up</Label>
                <Input
                  type="number"
                  min={1}
                  value={makeupCount}
                  onChange={(e) => setMakeupCount(Number(e.target.value))}
                />
              </div>
              <Button onClick={handleMakeup} disabled={isPending} className="w-full">
                Log {makeupCount} Makeup Prayer{makeupCount > 1 ? "s" : ""}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Total Qaza - {label}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Total Qaza prayers owed</Label>
                <Input
                  type="number"
                  min={0}
                  value={newInitial}
                  onChange={(e) => setNewInitial(Number(e.target.value))}
                />
              </div>
              <Button onClick={handleUpdateInitial} disabled={isPending} className="w-full">
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
