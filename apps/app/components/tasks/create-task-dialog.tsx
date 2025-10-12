"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Loader2, Plus } from "lucide-react";
import { useCreateTask } from "@/hooks/use-tasks";
import { createTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  const createTask = useCreateTask();

  const form = useForm({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo" as const,
      dueDate: null,
      completedAt: null,
    },
  });

  const handleSubmit = async (data: any) => {
    await createTask.mutateAsync(data as CreateTaskInput);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="create-task-title">Title</Label>
            <Input
              id="create-task-title"
              {...form.register("title")}
              placeholder="Enter task title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-task-description">Description</Label>
            <Textarea
              id="create-task-description"
              {...form.register("description")}
              placeholder="Enter task description (optional)"
              className="resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={createTask.isPending || form.formState.isSubmitting}
          >
            {createTask.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
