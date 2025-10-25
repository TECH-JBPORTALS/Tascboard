import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavBoards } from "./nav-boards";
import { NavUser } from "./nav-user";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:cursor-auto hover:bg-transparent active:bg-transparent"
              asChild
            >
              <Link href={"/"}>
                <Image
                  width={32}
                  height={32}
                  alt="Tascboard Logo"
                  src={"/tascboard.svg"}
                />
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-sans font-semibold">
                    Tascboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <NavBoards />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
