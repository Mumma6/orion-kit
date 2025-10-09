/**
 * Tasks Hooks
 * React Query hooks for task operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks } from "@/lib/api/tasks";
import type { CreateTaskInput, TasksListResponse } from "@workspace/types";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

// Query keys for caching
export const tasksKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tasksKeys.lists(), filters] as const,
  details: () => [...tasksKeys.all, "detail"] as const,
  detail: (id: number) => [...tasksKeys.details(), id] as const,
};

/**
 * Fetch all tasks for the current user
 */
export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: tasksKeys.lists(),
    queryFn: getTasks,
  });
}

/**
 * Create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      // Show success toast
      showSuccessToast("Task created", response.message);

      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

      // Optimistically update the cache
      queryClient.setQueryData<TasksListResponse>(tasksKeys.lists(), (old) => {
        if (!old) return old;
        const newTask = response.data;

        // Update the count based on task status
        const updates: Partial<TasksListResponse> = {
          data: [newTask, ...old.data],
          total: old.total + 1,
        };

        // Increment the appropriate counter
        if (newTask.status === "completed") {
          updates.completed = old.completed + 1;
        } else if (newTask.status === "in-progress") {
          updates.inProgress = old.inProgress + 1;
        } else if (newTask.status === "todo") {
          updates.todo = old.todo + 1;
        }

        return { ...old, ...updates };
      });
    },
    onError: (error) => {
      // Show error toast
      showErrorToast(error, "Failed to create task");
    },
  });
}

/**
 * Hook for refetching tasks manually
 */
export function useRefetchTasks() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
  };
}
