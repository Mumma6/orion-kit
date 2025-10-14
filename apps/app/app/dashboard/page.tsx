import { DashboardContent } from "@/components/dashboard";
import { currentUser } from "@workspace/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  console.log("user", user);

  if (!user) {
    redirect("/");
  }

  // Extract only the fields we need as a plain object
  const userData = {
    id: user!.id,
    firstName: user!.given_name,
    lastName: user!.family_name,
    email: user!.email || "",
    imageUrl: user!.picture,
  };

  return <DashboardContent user={userData} />;
}
