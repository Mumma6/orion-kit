import { auth, currentUser } from "@workspace/auth/server";
import { db, tasks, eq, desc } from "@workspace/database";
import { createTaskInputSchema } from "@workspace/types";
import type {
  Task,
  TasksListResponse,
  CreateTaskResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";

function getStatusCount(userTasks: TasksListResponse["data"]) {
  const filterStatus = (status: Task["status"]) =>
    userTasks.filter((t) => t.status === status).length;
  return {
    completed: filterStatus("completed"),
    inProgress: filterStatus("in-progress"),
    todo: filterStatus("todo"),
  };
}

export const GET = withAxiom(async () => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to GET /tasks");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.clerkUserId, userId))
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
      userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      completed,
      inProgress,
      todo,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to fetch tasks", error as Error);
    throw error;
  }
});

export const POST = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to POST /tasks");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validation = createTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    const newTasks = await db
      .insert(tasks)
      .values({
        clerkUserId: userId,
        ...validatedData,
      })
      .returning();

    const newTask = newTasks[0];
    if (!newTask) {
      throw new Error("Failed to create task");
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
  } catch (error) {
    logger.error("Failed to create task", error as Error);
    throw error;
  }
});
