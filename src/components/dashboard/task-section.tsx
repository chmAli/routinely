"use client";

import { useTransition, useState } from "react";
import { createTask, toggleTask, deleteTask } from "@/lib/actions/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import type { Task } from "@/lib/types/app";

export function TaskSection({
  date,
  tasks,
}: {
  date: string;
  tasks: Task[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  function handleToggle(taskId: string, completed: boolean) {
    startTransition(async () => {
      await toggleTask(taskId, completed);
    });
  }

  function handleDelete(taskId: string) {
    startTransition(async () => {
      await deleteTask(taskId);
    });
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newTaskTitle.trim());
    formData.set("taskDate", date);
    formData.set("priority", "medium");

    startTransition(async () => {
      await createTask(formData);
      setNewTaskTitle("");
      setIsAdding(false);
    });
  }

  const priorityColors = {
    high: "destructive",
    medium: "secondary",
    low: "outline",
  } as const;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Tasks
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2">
          <Input
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            autoFocus
          />
          <Button onClick={handleAddTask} disabled={isPending} size="sm">
            Add
          </Button>
        </div>
      )}

      {tasks.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground py-3 text-center">
          No tasks for this day.{" "}
          <button
            onClick={() => setIsAdding(true)}
            className="text-primary hover:underline"
          >
            Add one?
          </button>
        </p>
      )}

      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggle(task.id, task.completed)}
              disabled={isPending}
            />
            <span
              className={`flex-1 text-sm font-medium ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </span>
            {task.priority !== "medium" && (
              <Badge variant={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
