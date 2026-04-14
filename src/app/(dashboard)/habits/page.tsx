import { createClient } from "@/lib/supabase/server";
import { HabitList } from "@/components/habits/habit-list";

export default async function HabitsPage() {
  const supabase = await createClient();

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .is("deleted_at", null)
    .order("display_order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Habits</h1>
        <p className="text-muted-foreground">
          Create and manage your recurring habits
        </p>
      </div>

      <HabitList habits={habits || []} />
    </div>
  );
}
