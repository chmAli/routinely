"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { addDays, subDays, format, parse, isToday } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";

export function DateNavigator({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const date = parse(currentDate, "yyyy-MM-dd", new Date());

  function navigateTo(newDate: Date) {
    const formatted = format(newDate, "yyyy-MM-dd");
    router.push(`/dashboard?date=${formatted}`);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateTo(subDays(date, 1))}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium">{formatDisplayDate(date)}</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && navigateTo(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {!isToday(date) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo(new Date())}
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateTo(addDays(date, 1))}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
