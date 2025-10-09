/**
 * Tasks API
 * API functions for task-related operations
 *
 * NOTE: Import all types from @workspace/types, never define types here!
 */

import { api } from "./client";
import type {
  TasksListResponse,
  CreateTaskInput,
  CreateTaskResponse,
} from "@workspace/types";

/**
 * Fetch all tasks for the current user
 */
export async function getTasks(): Promise<TasksListResponse> {
  const response = await api.get<TasksListResponse>("/tasks");

  // Map the API response structure to match our interface
  // API returns `data` array, but we need to map it to `tasks` for backwards compat
  return {
    ...response,
    data: response.data || [],
  };
}

/**
 * Create a new task
 */
export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}

/**
 * Update a task
 * TODO: Implement this endpoint in the API
 */
export async function updateTask(
  id: number,
  updates: Partial<CreateTaskInput>
): Promise<CreateTaskResponse> {
  return api.patch<CreateTaskResponse>(`/tasks/${id}`, updates);
}

/**
 * Delete a task
 * TODO: Implement this endpoint in the API
 */
export async function deleteTask(id: number): Promise<{ success: boolean }> {
  return api.delete<{ success: boolean }>(`/tasks/${id}`);
}
