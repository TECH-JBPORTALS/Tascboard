import { Home, Users } from "lucide-react";
import { SidebarMenu, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { NavMainMenuItemClient } from "./nav-main-item.client";
import { auth } from "@/utils/auth";
import { Suspense } from "react";
import { Protect } from "../protect";
import { headers } from "next/headers";

export function NavMain() {
  return (
    <SidebarMenu>
      <NavMainMenuItemClient url="/" exact>
        <Home /> Home
      </NavMainMenuItemClient>
      <Suspense fallback={<SidebarMenuSkeleton />}>
        <ProtectedEmployeesSideMenuItem />
      </Suspense>
    </SidebarMenu>
  );
}

async function ProtectedEmployeesSideMenuItem() {
  const canAccessMenuItem = auth.api
    .hasPermission({
      body: { permission: { member: ["create"] } },
      headers: await headers(),
    })
    .then((r) => r.success);

  return (
    <Protect hasAccess={canAccessMenuItem}>
      <NavMainMenuItemClient url="/employees">
        <Users />
        Employees
      </NavMainMenuItemClient>
    </Protect>
  );
}
