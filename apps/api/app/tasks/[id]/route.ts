import { auth } from "@workspace/auth/server";
import { db, tasks, eq } from "@workspace/database";
import { updateTaskInputSchema } from "@workspace/types";
import { logger } from "@workspace/logger";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";
import { z } from "zod";

const taskIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid task ID format").transform(Number),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PUT /tasks/:id
 * Update a task (full update)
 */
export async function PUT(request: Request, context: RouteContext) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      await logger.warn("Unauthorized access to PUT /tasks/:id");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate params with Zod
    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    const body = await request.json();

    // Validate request body with Zod
    const validation = updateTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    // Check if task exists and belongs to user
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

    if (existingTask.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update task
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
    await logger.info("Task updated", {
      userId,
      taskId,
      duration,
    });

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error("Failed to update task", {
      error: error instanceof Error ? error : new Error(String(error)),
      userId: (await auth()).userId || undefined,
      path: `/tasks/:id`,
      method: "PUT",
      duration,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /tasks/:id
 * Partial update of a task
 */
export async function PATCH(request: Request, context: RouteContext) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      await logger.warn("Unauthorized access to PATCH /tasks/:id");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate params with Zod
    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    const body = await request.json();

    // Validate request body with Zod (partial schema)
    const validation = updateTaskInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const validatedData = validation.data;

    // Check if task exists and belongs to user
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

    if (existingTask.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update only provided fields
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
    await logger.info("Task patched", {
      userId,
      taskId,
      fields: Object.keys(validatedData),
      duration,
    });

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error("Failed to patch task", {
      error: error instanceof Error ? error : new Error(String(error)),
      userId: (await auth()).userId || undefined,
      path: `/tasks/:id`,
      method: "PATCH",
      duration,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /tasks/:id
 * Delete a task
 */
export async function DELETE(_request: Request, context: RouteContext) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      await logger.warn("Unauthorized access to DELETE /tasks/:id");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate params with Zod
    const params = await context.params;
    const paramsValidation = taskIdSchema.safeParse(params);

    if (!paramsValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const taskId = paramsValidation.data.id;

    // Check if task exists and belongs to user
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

    if (existingTask.clerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete task
    await db.delete(tasks).where(eq(tasks.id, taskId));

    const duration = Date.now() - startTime;
    await logger.info("Task deleted", {
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
    const duration = Date.now() - startTime;
    await logger.error("Failed to delete task", {
      error: error instanceof Error ? error : new Error(String(error)),
      userId: (await auth()).userId || undefined,
      path: `/tasks/:id`,
      method: "DELETE",
      duration,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
