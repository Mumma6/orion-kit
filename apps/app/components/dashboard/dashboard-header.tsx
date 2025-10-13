"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardHeader() {
  const pathname = usePathname();

  // Parse pathname to generate breadcrumbs
  const paths = pathname.split("/").filter(Boolean);

  // Create breadcrumb items
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join("/")}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

    return { href, label, isLast };
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
