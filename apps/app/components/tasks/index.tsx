"use client";

import { useState, useMemo, useEffect } from "react";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { CreateTaskDialog } from "./create-task-dialog";
import { EditTaskSheet } from "./edit-task-sheet";
import { TasksFilters } from "./tasks-filters";
import { TasksStats } from "./tasks-stats";
import { TasksTable } from "./tasks-table";
import { TasksLoading } from "./tasks-loading";
import { TasksError } from "./tasks-error";
import type { StatusFilter } from "./task-status-config";
import { Task } from "@workspace/types";
import { TasksPagination } from "./tasks-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export function TasksContent() {
  const { data: tasksData, isLoading, error, refetch } = useTasks();
  const updateTask = useUpdateTask();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredTasks = useMemo(() => {
    const tasks = tasksData?.data || [];

    return tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

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

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, itemsPerPage]);

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    await updateTask.mutateAsync({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
  };

  if (isLoading) {
    return <TasksLoading />;
  }

  if (error) {
    return <TasksError error={error} onRetry={refetch} />;
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
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
      {tasksData && <TasksStats data={tasksData} />}

      <TasksFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TasksTable
        tasks={tasks}
        filteredTasks={paginatedTasks}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onEditTask={setSelectedTask}
        onStatusChange={handleStatusChange}
        onDeleteTask={handleDeleteTask}
        onCreateTask={() => setShowCreateDialog(true)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
          <TasksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <EditTaskSheet
        task={selectedTask}
        open={selectedTask !== null}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}
