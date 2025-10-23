"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { updateTaskInputSchema } from "@workspace/types";
import type { CreateTaskInput } from "@workspace/types";
import { StatusIcon, statusConfig } from "./task-status-config";
import { Task } from "@workspace/types";

interface EditTaskSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskSheet({
  task,
  open,
  onOpenChange,
}: EditTaskSheetProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateTaskInputSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo" as const,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
      });
    }
  }, [task, form]);

  const handleSubmit = async (data: Partial<CreateTaskInput>) => {
    if (!task) return;

    await updateTask.mutateAsync({
      id: task.id,
      updates: data,
    });

    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!task) return;

    await deleteTask.mutateAsync(task.id);
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
          <div className="grid gap-3">
            <Label htmlFor="edit-task-title">Title</Label>
            <Input
              id="edit-task-title"
              {...form.register("title")}
              placeholder="Enter task title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="edit-task-description">Description</Label>
            <Textarea
              id="edit-task-description"
              {...form.register("description")}
              placeholder="Enter task description (optional)"
              className="resize-none"
              rows={4}
            />
          </div>
          <div className="grid gap-3">
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-start gap-2">
                  {form.watch("status") && (
                    <StatusIcon status={form.watch("status")!} />
                  )}
                  {form.watch("status")
                    ? statusConfig[form.watch("status")!].label
                    : "Select status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "todo")}
                >
                  <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "in-progress")}
                >
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "completed")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "cancelled")}
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-3 pt-6 border-t"></div>
        </div>
        <SheetFooter className="gap-2">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={updateTask.isPending || form.formState.isSubmitting}
          >
            {updateTask.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteTask.isPending}
            className="w-full"
          >
            {deleteTask.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </>
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Task"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
