import { db, tasks, eq, desc, userPreferences } from "@workspace/database";
import { createTaskInputSchema } from "@workspace/types";
import type {
  Task,
  TasksListResponse,
  CreateTaskResponse,
  ApiErrorResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { formatZodError } from "@/lib/validation";
import { getCurrentUser } from "@workspace/auth/server";

function getStatusCount(userTasks: TasksListResponse["data"]) {
  const filterStatus = (status: Task["status"]) =>
    userTasks.filter((t) => t.status === status).length;
  return {
    completed: filterStatus("completed"),
    inProgress: filterStatus("in-progress"),
    todo: filterStatus("todo"),
  };
}

export const GET = withAxiom(
  async (req): Promise<NextResponse<TasksListResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const user = await getCurrentUser(req);

    if (!user) {
      logger.warn("Unauthorized access to GET /tasks");
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const userId = user.id;

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));

    const duration = Date.now() - startTime;
    logger.info("Tasks fetched", {
      userId,
      tasksCount: userTasks.length,
      duration,
    });

    const { completed, inProgress, todo } = getStatusCount(userTasks);

    const response: TasksListResponse = {
      success: true,
      data: userTasks,
      total: userTasks.length,
      userId,
      userName: user.name || "",
      completed,
      inProgress,
      todo,
    };

    return NextResponse.json(response);
  }
);

export const POST = withAxiom(
  async (req): Promise<NextResponse<CreateTaskResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const user = await getCurrentUser(req);

    if (!user) {
      logger.warn("Unauthorized access to POST /tasks");
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const userId = user.id;

    const body = await req.json();

    const validation = createTaskInputSchema.safeParse(body);

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Validation failed",
        details: formatZodError(validation.error.issues),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const validatedData = validation.data;

    const userPreferencesStatus = await db
      .select({ defaultTaskStatus: userPreferences.defaultTaskStatus })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const defaultTaskStatus =
      (userPreferencesStatus[0]?.defaultTaskStatus as Task["status"]) || "todo";

    const newTasks = await db
      .insert(tasks)
      .values({
        userId: userId,
        ...validatedData,
        status: defaultTaskStatus,
      })
      .returning();

    const newTask = newTasks[0];
    if (!newTask) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Failed to create task",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const duration = Date.now() - startTime;
    logger.info("Task created", {
      userId,
      taskId: newTask.id,
      duration,
    });

    const response: CreateTaskResponse = {
      success: true,
      message: "Task created successfully",
      data: newTask,
    };

    return NextResponse.json(response);
  }
);
