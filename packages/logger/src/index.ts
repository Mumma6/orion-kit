/**
 * @workspace/logger
 * Application logger with database persistence
 */

import { db, logs, type InsertLog } from "@workspace/database";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
  [key: string]: unknown;
}

/**
 * Create a log entry in the database
 */
const createLog = async (
  level: LogLevel,
  message: string,
  context?: LogContext
): Promise<void> => {
  try {
    const logEntry: InsertLog = {
      level,
      message,
      context: context ? JSON.stringify(context) : null,
      userId: context?.userId || null,
      requestId: context?.requestId || null,
      method: context?.method || null,
      path: context?.path || null,
      statusCode: context?.statusCode || null,
      duration: context?.duration || null,
      errorMessage: context?.error?.message || null,
      errorStack: context?.error?.stack || null,
    };

    await db.insert(logs).values(logEntry);
  } catch (error) {
    // Fallback to console if database logging fails
    console.error("[Logger] Failed to write to database:", error);
  }
};

/**
 * Logger instance
 */
export const logger = {
  /**
   * Debug level - Detailed information for diagnosing problems
   */
  debug: (message: string, context?: LogContext) => {
    console.debug(`[DEBUG] ${message}`, context);
    return createLog("debug", message, context);
  },

  /**
   * Info level - General informational messages
   */
  info: (message: string, context?: LogContext) => {
    console.info(`[INFO] ${message}`, context);
    return createLog("info", message, context);
  },

  /**
   * Warn level - Warning messages for potentially harmful situations
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context);
    return createLog("warn", message, context);
  },

  /**
   * Error level - Error events that might still allow the application to continue
   */
  error: (message: string, context?: LogContext) => {
    console.error(`[ERROR] ${message}`, context);
    return createLog("error", message, context);
  },

  /**
   * Fatal level - Severe errors that cause application failure
   */
  fatal: (message: string, context?: LogContext) => {
    console.error(`[FATAL] ${message}`, context);
    return createLog("fatal", message, context);
  },

  /**
   * Log API request
   */
  request: (
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Omit<LogContext, "method" | "path" | "statusCode" | "duration">
  ) => {
    const message = `${method} ${path} - ${statusCode} (${duration}ms)`;
    const level: LogLevel =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    console.log(`[${level.toUpperCase()}] ${message}`);
    return createLog(level, message, {
      ...context,
      method,
      path,
      statusCode,
      duration,
    });
  },
};

/**
 * Query logs from database
 */
export const queryLogs = {
  /**
   * Get recent logs
   */
  recent: async (limit = 100) => {
    return db.select().from(logs).orderBy(desc(logs.createdAt)).limit(limit);
  },

  /**
   * Get logs by level
   */
  byLevel: async (level: LogLevel, limit = 100) => {
    return db
      .select()
      .from(logs)
      .where(eq(logs.level, level))
      .orderBy(desc(logs.createdAt))
      .limit(limit);
  },

  /**
   * Get logs by user
   */
  byUser: async (userId: string, limit = 100) => {
    return db
      .select()
      .from(logs)
      .where(eq(logs.userId, userId))
      .orderBy(desc(logs.createdAt))
      .limit(limit);
  },

  /**
   * Get error logs
   */
  errors: async (limit = 100) => {
    return db
      .select()
      .from(logs)
      .where(or(eq(logs.level, "error"), eq(logs.level, "fatal")))
      .orderBy(desc(logs.createdAt))
      .limit(limit);
  },
};

// Re-export for convenience
import { desc, eq, or } from "@workspace/database";
