"use client";

import { BoxIcon, MoreHorizontalIcon, TriangleIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import isEmpty from "lodash/isEmpty";
import { BoardActionDropdownMenu } from "./board-action.dropdown.menu";

export function NavBoards() {
  const pathname = usePathname();
  const params = useParams<{ orgSlug: string }>();
  const trpc = useTRPC();
  const { data: boards } = useSuspenseQuery(trpc.board.list.queryOptions());

  if (isEmpty(boards))
    return (
      <SidebarGroupContent className="space-y-1.5 px-4">
        <div className="flex items-center justify-center text-center text-xs">
          No boards
        </div>
        <p className="text-muted-foreground text-center text-xs">
          Create board to manage project tasks, tracks etc...
        </p>
      </SidebarGroupContent>
    );

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {boards.map((item) => (
          <Collapsible key={item.id} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="right-0 left-1 rotate-90 data-[state=open]:rotate-180 [&>svg]:size-1.5">
                  <TriangleIcon className="fill-sidebar-foreground" />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>

              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className="pl-6"
                isActive={pathname === `/${params.orgSlug}/b/${item.id}`}
              >
                <Link href={`/${params.orgSlug}/b/${item.id}`}>
                  <BoxIcon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>

              <BoardActionDropdownMenu boardId={item.id}>
                <SidebarMenuAction className="opacity-0 peer-hover/menu-button:opacity-100 hover:opacity-100">
                  <MoreHorizontalIcon />
                </SidebarMenuAction>
              </BoardActionDropdownMenu>

              <CollapsibleContent>
                {/* <SidebarMenuSub className="pr-0">
                  {item.tracks?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        className="peer/menu-sub-button"
                        asChild
                        isActive={pathname.startsWith(
                          `/${params.orgSlug}/b/${item.id}/t/${subItem.id}`,
                        )}
                      >
                        <Link
                          href={`/${params.orgSlug}/b/${item.id}/t/${subItem.id}`}
                        >
                          <SquircleIcon />
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuAction className="opacity-0 peer-hover/menu-sub-button:opacity-100 hover:opacity-100 [&>svg]:size-3">
                        <MoreHorizontalIcon />
                      </SidebarMenuAction>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub> */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
