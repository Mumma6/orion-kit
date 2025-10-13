import { DashboardContent } from "@/components/dashboard";
import { currentUser } from "@workspace/auth/server";

export default async function DashboardPage() {
  const user = await currentUser();

  // Extract only the fields we need as a plain object
  const userData = {
    id: user!.id,
    firstName: user!.firstName,
    lastName: user!.lastName,
    email: user!.emailAddresses[0]?.emailAddress || "",
    imageUrl: user!.imageUrl,
  };

  return <DashboardContent user={userData} />;
}
