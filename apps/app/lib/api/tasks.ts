import { api } from "./client";
import type {
  TasksListResponse,
  CreateTaskResponse,
  CreateTaskInput,
  DeleteTaskResponse,
} from "@workspace/types";

export async function getTasks(): Promise<TasksListResponse> {
  const response = await api.get<TasksListResponse>("/tasks");

  return {
    ...response,
    data: response.data || [],
  };
}

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>("/tasks", input);
}

export async function updateTask(
  id: number,
  updates: Partial<CreateTaskInput>
): Promise<CreateTaskResponse> {
  return api.patch<CreateTaskResponse>(`/tasks/${id}`, updates);
}

export async function deleteTask(id: number): Promise<DeleteTaskResponse> {
  return api.delete<DeleteTaskResponse>(`/tasks/${id}`);
}
