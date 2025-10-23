import "dotenv/config";
import { db } from "./client";
import { tasks, userPreferences } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Demo account user ID
    const demoUserId = "360d6acb-686f-446d-8a45-0a8f82e55c9a";

    const [prefs] = await db
      .insert(userPreferences)
      .values({
        userId: demoUserId,
        theme: "system",
        language: "en",
        timezone: "UTC",
        emailNotifications: "enabled",
        pushNotifications: "disabled",
      })
      .onConflictDoNothing()
      .returning();

    const demoTasks = [
      {
        userId: demoUserId,
        title: "Set up project structure",
        description:
          "Initialize the monorepo with proper workspace configuration",
        status: "completed" as const,
        completedAt: new Date("2024-01-10"),
      },
      {
        userId: demoUserId,
        title: "Configure authentication",
        description: "Integrate Better Auth for user management and security",
        status: "completed" as const,
        completedAt: new Date("2024-01-12"),
      },
      {
        userId: demoUserId,
        title: "Set up database schema",
        description:
          "Create tables for users, tasks, and preferences using Drizzle ORM",
        status: "completed" as const,
        completedAt: new Date("2024-01-15"),
      },
      {
        userId: demoUserId,
        title: "Build landing page",
        description:
          "Create an attractive landing page with hero section and features",
        status: "completed" as const,
        completedAt: new Date("2024-01-18"),
      },
      {
        userId: demoUserId,
        title: "Implement user dashboard",
        description: "Build the main dashboard with task management interface",
        status: "completed" as const,
        completedAt: new Date("2024-01-20"),
      },
      {
        userId: demoUserId,
        title: "Add task CRUD operations",
        description:
          "Implement create, read, update, delete functionality for tasks",
        status: "completed" as const,
        completedAt: new Date("2024-01-22"),
      },
      {
        userId: demoUserId,
        title: "Set up payment integration",
        description: "Integrate Stripe for subscription management and billing",
        status: "completed" as const,
        completedAt: new Date("2024-01-25"),
      },
      {
        userId: demoUserId,
        title: "Configure email notifications",
        description:
          "Set up email service for user notifications and welcome emails",
        status: "completed" as const,
        completedAt: new Date("2024-01-28"),
      },

      // In-progress tasks (current work)
      {
        userId: demoUserId,
        title: "Add analytics dashboard",
        description:
          "Implement analytics and reporting features for task insights",
        status: "in-progress" as const,
        dueDate: new Date("2024-02-15"),
      },
      {
        userId: demoUserId,
        title: "Optimize performance",
        description:
          "Implement caching, lazy loading, and performance optimizations",
        status: "in-progress" as const,
        dueDate: new Date("2024-02-20"),
      },
      {
        userId: demoUserId,
        title: "Add mobile responsiveness",
        description: "Ensure the application works perfectly on mobile devices",
        status: "in-progress" as const,
        dueDate: new Date("2024-02-25"),
      },
      {
        userId: demoUserId,
        title: "Implement dark mode",
        description:
          "Add theme switching functionality with dark and light modes",
        status: "in-progress" as const,
        dueDate: new Date("2024-02-28"),
      },

      {
        userId: demoUserId,
        title: "Add team collaboration features",
        description: "Implement team workspaces and shared task management",
        status: "todo" as const,
        dueDate: new Date("2024-03-01"),
      },
      {
        userId: demoUserId,
        title: "Create API documentation",
        description: "Write comprehensive API documentation for developers",
        status: "todo" as const,
        dueDate: new Date("2024-03-05"),
      },
      {
        userId: demoUserId,
        title: "Add file attachments",
        description: "Allow users to attach files to tasks and projects",
        status: "todo" as const,
        dueDate: new Date("2024-03-10"),
      },
      {
        userId: demoUserId,
        title: "Implement task templates",
        description: "Create reusable task templates for common workflows",
        status: "todo" as const,
        dueDate: new Date("2024-03-15"),
      },
      {
        userId: demoUserId,
        title: "Add time tracking",
        description:
          "Implement time tracking features for task duration monitoring",
        status: "todo" as const,
        dueDate: new Date("2024-03-20"),
      },
      {
        userId: demoUserId,
        title: "Create mobile app",
        description: "Develop native mobile applications for iOS and Android",
        status: "todo" as const,
        dueDate: new Date("2024-03-25"),
      },
      {
        userId: demoUserId,
        title: "Add integrations",
        description:
          "Integrate with popular tools like Slack, GitHub, and Google Calendar",
        status: "todo" as const,
        dueDate: new Date("2024-03-30"),
      },
      {
        userId: demoUserId,
        title: "Implement advanced reporting",
        description:
          "Create detailed reports and analytics for project insights",
        status: "todo" as const,
        dueDate: new Date("2024-04-01"),
      },
      {
        userId: demoUserId,
        title: "Add keyboard shortcuts",
        description: "Implement keyboard shortcuts for power users",
        status: "todo" as const,
        dueDate: new Date("2024-04-05"),
      },
      {
        userId: demoUserId,
        title: "Create user onboarding flow",
        description: "Design an intuitive onboarding experience for new users",
        status: "todo" as const,
        dueDate: new Date("2024-04-10"),
      },
      {
        userId: demoUserId,
        title: "Add bulk operations",
        description: "Implement bulk edit and delete operations for tasks",
        status: "todo" as const,
        dueDate: new Date("2024-04-15"),
      },
      {
        userId: demoUserId,
        title: "Implement search functionality",
        description: "Add advanced search and filtering capabilities",
        status: "todo" as const,
        dueDate: new Date("2024-04-20"),
      },
      {
        userId: demoUserId,
        title: "Add task dependencies",
        description:
          "Implement task dependency management and workflow automation",
        status: "todo" as const,
        dueDate: new Date("2024-04-25"),
      },
      {
        userId: demoUserId,
        title: "Create backup system",
        description: "Implement automated backup and data recovery systems",
        status: "todo" as const,
        dueDate: new Date("2024-04-30"),
      },
      {
        userId: demoUserId,
        title: "Add multi-language support",
        description: "Implement internationalization for global users",
        status: "todo" as const,
        dueDate: new Date("2024-05-01"),
      },
      {
        userId: demoUserId,
        title: "Implement AI features",
        description: "Add AI-powered task suggestions and smart categorization",
        status: "todo" as const,
        dueDate: new Date("2024-05-05"),
      },
      {
        userId: demoUserId,
        title: "Add offline support",
        description: "Implement offline functionality for mobile users",
        status: "todo" as const,
        dueDate: new Date("2024-05-10"),
      },
      {
        userId: demoUserId,
        title: "Create admin dashboard",
        description: "Build administrative interface for system management",
        status: "todo" as const,
        dueDate: new Date("2024-05-15"),
      },
      {
        userId: demoUserId,
        title: "Add webhook support",
        description: "Implement webhook system for third-party integrations",
        status: "todo" as const,
        dueDate: new Date("2024-05-20"),
      },
      {
        userId: demoUserId,
        title: "Implement audit logging",
        description:
          "Add comprehensive audit logging for security and compliance",
        status: "todo" as const,
        dueDate: new Date("2024-05-25"),
      },
      {
        userId: demoUserId,
        title: "Add custom fields",
        description:
          "Allow users to create custom fields for tasks and projects",
        status: "todo" as const,
        dueDate: new Date("2024-05-30"),
      },
      {
        userId: demoUserId,
        title: "Implement data export",
        description: "Add data export functionality for user data portability",
        status: "todo" as const,
        dueDate: new Date("2024-06-01"),
      },
      {
        userId: demoUserId,
        title: "Add advanced notifications",
        description:
          "Implement smart notification system with user preferences",
        status: "todo" as const,
        dueDate: new Date("2024-06-05"),
      },
      {
        userId: demoUserId,
        title: "Create API rate limiting",
        description: "Implement rate limiting and API usage monitoring",
        status: "todo" as const,
        dueDate: new Date("2024-06-10"),
      },
      {
        userId: demoUserId,
        title: "Add task automation",
        description: "Implement automated task creation and workflow triggers",
        status: "todo" as const,
        dueDate: new Date("2024-06-15"),
      },
      {
        userId: demoUserId,
        title: "Implement SSO integration",
        description: "Add single sign-on support for enterprise customers",
        status: "todo" as const,
        dueDate: new Date("2024-06-20"),
      },
      {
        userId: demoUserId,
        title: "Add video tutorials",
        description: "Create comprehensive video tutorials for user education",
        status: "todo" as const,
        dueDate: new Date("2024-06-25"),
      },
      {
        userId: demoUserId,
        title: "Implement advanced security",
        description:
          "Add two-factor authentication and advanced security features",
        status: "todo" as const,
        dueDate: new Date("2024-06-30"),
      },
      {
        userId: demoUserId,
        title: "Add performance monitoring",
        description:
          "Implement comprehensive performance monitoring and alerting",
        status: "todo" as const,
        dueDate: new Date("2024-07-01"),
      },
      {
        userId: demoUserId,
        title: "Create mobile push notifications",
        description: "Implement push notifications for mobile applications",
        status: "todo" as const,
        dueDate: new Date("2024-07-05"),
      },
      {
        userId: demoUserId,
        title: "Add advanced filtering",
        description: "Implement complex filtering and sorting options",
        status: "todo" as const,
        dueDate: new Date("2024-07-10"),
      },
      {
        userId: demoUserId,
        title: "Implement task archiving",
        description: "Add task archiving functionality for completed projects",
        status: "todo" as const,
        dueDate: new Date("2024-07-15"),
      },
      {
        userId: demoUserId,
        title: "Add calendar integration",
        description: "Integrate with calendar applications for task scheduling",
        status: "todo" as const,
        dueDate: new Date("2024-07-20"),
      },
      {
        userId: demoUserId,
        title: "Create user feedback system",
        description:
          "Implement user feedback collection and feature request system",
        status: "todo" as const,
        dueDate: new Date("2024-07-25"),
      },
      {
        userId: demoUserId,
        title: "Add advanced search",
        description:
          "Implement full-text search with advanced query capabilities",
        status: "todo" as const,
        dueDate: new Date("2024-07-30"),
      },
    ];

    const createdTasks = await db.insert(tasks).values(demoTasks).returning();

    console.log(`✅ Created ${createdTasks.length} demo tasks`);

    console.log("\n🎉 Demo seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  });
