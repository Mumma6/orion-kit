import "dotenv/config";
import { db } from "./client";
import { tasks, userPreferences } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Example Clerk User ID - replace with your actual Clerk user ID if you want to seed for your own user
    const exampleUserId = "user_example123";

    console.log(`📝 Adding example data for user: ${exampleUserId}`);

    const [prefs] = await db
      .insert(userPreferences)
      .values({
        clerkUserId: exampleUserId,
        theme: "dark",
        language: "en",
        timezone: "UTC",
        emailNotifications: "enabled",
        pushNotifications: "disabled",
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ User preferences created:", prefs?.id);

    const exampleTasks = [
      {
        clerkUserId: exampleUserId,
        title: "Set up authentication",
        description: "Configure Clerk for user authentication",
        status: "completed" as const,
        completedAt: new Date("2024-01-15"),
      },
      {
        clerkUserId: exampleUserId,
        title: "Create API routes",
        description: "Set up protected API endpoints",
        status: "completed" as const,
        completedAt: new Date("2024-01-16"),
      },
      {
        clerkUserId: exampleUserId,
        title: "Build dashboard",
        description: "Create a beautiful dashboard interface",
        status: "in-progress" as const,
      },
      {
        clerkUserId: exampleUserId,
        title: "Add database",
        description: "Connect to Neon and create schemas with Drizzle",
        status: "completed" as const,
        completedAt: new Date(),
      },
      {
        clerkUserId: exampleUserId,
        title: "Deploy to production",
        description: "Deploy the application to Vercel",
        status: "todo" as const,
        dueDate: new Date("2024-02-01"),
      },
    ];

    const createdTasks = await db
      .insert(tasks)
      .values(exampleTasks)
      .returning();

    console.log(`✅ Created ${createdTasks.length} example tasks`);

    console.log("\n🎉 Seeding complete!");
    console.log(
      `\n💡 Update the userId "${exampleUserId}" in seed.ts to match your Clerk user ID`
    );
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
