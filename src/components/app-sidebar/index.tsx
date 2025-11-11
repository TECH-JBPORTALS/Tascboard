import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavBoards } from "./nav-boards";
import { NavUser } from "./nav-user";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CreateBoardDialog } from "../dialogs/create-board.dialog";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  prefetch(trpc.board.list.queryOptions());

  return (
    <HydrateClient>
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
          <SidebarGroup>
            <SidebarGroupLabel>Boards</SidebarGroupLabel>
            <CreateBoardDialog>
              <SidebarGroupAction>
                <PlusIcon />
              </SidebarGroupAction>
            </CreateBoardDialog>
            <React.Suspense fallback={<SidebarBoardsMenuSkeleton />}>
              <NavBoards />
            </React.Suspense>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </HydrateClient>
  );
}

function SidebarBoardsMenuSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 6 }).map((_, i) => (
        <SidebarMenuSkeleton key={i} />
      ))}
    </SidebarMenu>
  );
}
