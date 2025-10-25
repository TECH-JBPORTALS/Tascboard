"use client";

import {
  BoxIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SquircleIcon,
  TriangleIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const boards = [
  {
    id: 1,
    title: "Chit Money",
    isActive: true,
    tracks: [
      {
        title: "Planning",
        id: 1,
      },
      {
        title: "UI Design",
        id: 2,
      },
      {
        title: "Development",
        id: 3,
      },
    ],
  },
  {
    title: "Kitchen App",
    id: 2,
    tracks: [
      {
        title: "R & D",
        id: 1,
      },
      {
        title: "UI & UX",
        id: 2,
      },
      {
        title: "Quantum",
        id: 3,
      },
    ],
  },
  {
    title: "Admissino Matrix",
    id: 3,
    tracks: [
      {
        title: "Issues",
        id: 1,
      },
      {
        title: "New Features",
        id: 2,
      },
    ],
  },
];

export function NavBoards() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
      <SidebarGroupAction>
        <PlusIcon />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {boards.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="right-0 left-1 rotate-90 data-[state=open]:rotate-180 [&>svg]:size-1.5">
                    <TriangleIcon className="fill-sidebar-foreground" />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>

                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="pl-6"
                  isActive={pathname === `/b/${item.id}`}
                >
                  <Link href={`/b/${item.id}`}>
                    <BoxIcon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuAction className="opacity-0 peer-hover/menu-button:opacity-100 hover:opacity-100">
                  <MoreHorizontalIcon />
                </SidebarMenuAction>

                <CollapsibleContent>
                  <SidebarMenuSub className="pr-0">
                    {item.tracks?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className="peer/menu-sub-button"
                          asChild
                          isActive={pathname.startsWith(
                            `/b/${item.id}/t/${subItem.id}`,
                          )}
                        >
                          <Link href={`/b/${item.id}/t/${subItem.id}`}>
                            <SquircleIcon />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                        <SidebarMenuAction className="opacity-0 peer-hover/menu-sub-button:opacity-100 hover:opacity-100 [&>svg]:size-3">
                          <MoreHorizontalIcon />
                        </SidebarMenuAction>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
