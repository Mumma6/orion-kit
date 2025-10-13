"use client";

import { useState, useMemo } from "react";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import type { Task } from "@workspace/database";
import { CreateTaskDialog } from "./create-task-dialog";
import { EditTaskSheet } from "./edit-task-sheet";
import { TasksFilters } from "./tasks-filters";
import { TasksStats } from "./tasks-stats";
import { TasksTable } from "./tasks-table";
import { TasksLoading } from "./tasks-loading";
import { TasksError } from "./tasks-error";
import type { StatusFilter } from "./task-status-config";

export function TasksContent() {
  const { data: tasksData, isLoading, error, refetch } = useTasks();
  const updateTask = useUpdateTask();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    const tasks = tasksData?.data || [];

    return tasks.filter((task) => {
      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tasksData?.data, statusFilter, searchQuery]);

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    await updateTask.mutateAsync({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    // Delete is handled in EditTaskSheet
  };

  // Loading State
  if (isLoading) {
    return <TasksLoading />;
  }

  // Error State
  if (error) {
    return <TasksError error={error} onRetry={refetch} />;
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header with Create Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track progress
          </p>
        </div>
        <CreateTaskDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>

      {/* Search and Filter */}
      <TasksFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Stats */}
      {tasksData && <TasksStats data={tasksData} />}

      {/* Tasks Table */}
      <TasksTable
        tasks={tasks}
        filteredTasks={filteredTasks}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onEditTask={setSelectedTask}
        onStatusChange={handleStatusChange}
        onDeleteTask={handleDeleteTask}
        onCreateTask={() => setShowCreateDialog(true)}
      />

      {/* Edit Task Sheet */}
      <EditTaskSheet
        task={selectedTask}
        open={selectedTask !== null}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}
