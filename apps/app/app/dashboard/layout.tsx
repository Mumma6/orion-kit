import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { currentUser } from "@workspace/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
