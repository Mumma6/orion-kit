import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks, updateTask, deleteTask } from "@/lib/api/tasks";
import type {
  Task,
  TasksListResponse,
  CreateTaskInput,
} from "@workspace/types";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

function getStatusCount(tasks: TasksListResponse["data"]) {
  const filterStatus = (status: Task["status"]) =>
    tasks.filter((t) => t.status === status).length;
  return {
    completed: filterStatus("completed"),
    inProgress: filterStatus("in-progress"),
    todo: filterStatus("todo"),
  };
}

export const tasksKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tasksKeys.lists(), filters] as const,
  details: () => [...tasksKeys.all, "detail"] as const,
  detail: (id: number) => [...tasksKeys.details(), id] as const,
};

export function useTasks() {
  return useQuery<TasksListResponse>({
    queryKey: tasksKeys.lists(),
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      showSuccessToast("Task created", response.message);

      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

      queryClient.setQueryData<TasksListResponse>(tasksKeys.lists(), (old) => {
        if (!old) return old;
        const newTask = response.data;

        const updates: Partial<TasksListResponse> = {
          data: [newTask, ...old.data],
          total: old.total + 1,
        };

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
      showErrorToast(error, "Failed to create task");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<CreateTaskInput>;
    }) => updateTask(id, updates),
    onSuccess: (response) => {
      showSuccessToast("Task updated", response.message);

      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });

      queryClient.setQueryData<TasksListResponse>(tasksKeys.lists(), (old) => {
        if (!old) return old;
        const updatedTask = response.data;

        const updatedData = old.data.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );

        const { completed, inProgress, todo } = getStatusCount(updatedData);

        return {
          ...old,
          data: updatedData,
          completed,
          inProgress,
          todo,
        };
      });
    },
    onError: (error) => {
      showErrorToast(error, "Failed to update task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: (response, deletedId) => {
      showSuccessToast("Task deleted", "Task has been deleted successfully");

      queryClient.setQueryData<TasksListResponse>(tasksKeys.lists(), (old) => {
        if (!old) return old;

        const taskToDelete = old.data.find((t) => t.id === deletedId);
        const updatedData = old.data.filter((task) => task.id !== deletedId);

        const updates: Partial<TasksListResponse> = {
          data: updatedData,
          total: old.total - 1,
        };

        if (taskToDelete?.status === "completed") {
          updates.completed = old.completed - 1;
        } else if (taskToDelete?.status === "in-progress") {
          updates.inProgress = old.inProgress - 1;
        } else if (taskToDelete?.status === "todo") {
          updates.todo = old.todo - 1;
        }

        return { ...old, ...updates };
      });

      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
    onError: (error) => {
      showErrorToast(error, "Failed to delete task");
    },
  });
}

export function useRefetchTasks() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
  };
}
