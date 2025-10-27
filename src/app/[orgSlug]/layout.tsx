import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getFullOrganization,
  getSession,
  setActiveOrganization,
} from "@/utils/auth";
import { redirect } from "next/navigation";
import type React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const activeOrganization = await getFullOrganization();

  if (activeOrganization) redirect(`/${activeOrganization.slug}`);

  const activatedOrganization = await setActiveOrganization();

  redirect(`/${activatedOrganization?.slug}`);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
