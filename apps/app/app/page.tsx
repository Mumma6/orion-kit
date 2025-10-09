import { auth } from "@workspace/auth/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const { userId } = await auth();

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // If not logged in, redirect to sign-in
  redirect("/sign-in");
}
