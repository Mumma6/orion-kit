import { auth, currentUser } from "@workspace/auth/server";
import { db, tasks, eq, desc } from "@workspace/database";
import { createTaskInputSchema } from "@workspace/types";
import type { TasksListResponse } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";

/**
 * GET /tasks
 * Returns a list of tasks for the authenticated user
 */
export const GET = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to GET /tasks");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the full user object if needed
    const user = await currentUser();

    // Fetch tasks from database
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.clerkUserId, userId))
      .orderBy(desc(tasks.createdAt));

    // Log the request
    const duration = Date.now() - startTime;
    logger.info("Tasks fetched", {
      userId,
      tasksCount: userTasks.length,
      duration,
    });

    const getStatusCount = (
      status: "completed" | "in-progress" | "todo" | "cancelled"
    ) => {
      return userTasks.filter((t) => t.status === status).length;
    };

    const response: TasksListResponse = {
      success: true,
      data: userTasks,
      total: userTasks.length,
      userId,
      userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      completed: getStatusCount("completed"),
      inProgress: getStatusCount("in-progress"),
      todo: getStatusCount("todo"),
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to fetch tasks", error as Error);
    throw error; // withAxiom handles error responses
  }
});

/**
 * POST /tasks
 * Create a new task
 */
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

    // Validate request body with Zod
    const validation = createTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    // Insert task into database
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

    return NextResponse.json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    logger.error("Failed to create task", error as Error);
    throw error; // withAxiom handles error responses
  }
});
