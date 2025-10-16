import { db, tasks, eq } from "@workspace/database";
import { updateTaskInputSchema } from "@workspace/types";
import type { UpdateTaskResponse } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const taskIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid task ID format").transform(Number),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PUT = withAxiom(async (req, context: RouteContext) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      logger.warn("Unauthorized access to PUT /tasks/:id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    const body = await req.json();

    const validation = updateTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    const existingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    const existingTask = existingTasks[0];

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    if (existingTask.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedTasks = await db
      .update(tasks)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    const updatedTask = updatedTasks[0];

    if (!updatedTask) {
      throw new Error("Failed to update task");
    }

    const duration = Date.now() - startTime;
    logger.info("Task updated", {
      userId,
      taskId,
      duration,
    });

    const response: UpdateTaskResponse = {
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to update task", error as Error);
    throw error;
  }
});

export const PATCH = withAxiom(async (req, context: RouteContext) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      logger.warn("Unauthorized access to PATCH /tasks/:id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    const body = await req.json();

    const validation = updateTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    const existingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    const existingTask = existingTasks[0];

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    if (existingTask.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedTasks = await db
      .update(tasks)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    const updatedTask = updatedTasks[0];

    if (!updatedTask) {
      throw new Error("Failed to update task");
    }

    const duration = Date.now() - startTime;
    logger.info("Task patched", {
      userId,
      taskId,
      fields: Object.keys(validatedData),
      duration,
    });

    const response: UpdateTaskResponse = {
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to patch task", error as Error);
    throw error;
  }
});

export const DELETE = withAxiom(async (req, context: RouteContext) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    const existingTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    const existingTask = existingTasks[0];

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    if (existingTask.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));

    const duration = Date.now() - startTime;
    logger.info("Task deleted", {
      userId,
      taskId,
      duration,
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
      deletedId: taskId,
    });
  } catch (error) {
    logger.error("Failed to delete task", error as Error);
    throw error;
  }
});
