"use client";

import { BoxIcon, ChevronRight, PlusIcon, SquircleIcon } from "lucide-react";

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const boards = [
  {
    title: "Chit Money",
    url: "#",
    isActive: true,
    tracks: [
      {
        title: "Planning",
        url: "#",
      },
      {
        title: "UI Design",
        url: "#",
      },
      {
        title: "Development",
        url: "#",
      },
    ],
  },
  {
    title: "Kitchen App",
    url: "#",
    tracks: [
      {
        title: "R & D",
        url: "#",
      },
      {
        title: "UI & UX",
        url: "#",
      },
      {
        title: "Quantum",
        url: "#",
      },
    ],
  },
  {
    title: "Admissino Matrix",
    url: "#",
    tracks: [
      {
        title: "Issues",
        url: "#",
      },
      {
        title: "New Features",
        url: "#",
      },
    ],
  },
];

export function NavBoards() {
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
                  <SidebarMenuButton tooltip={item.title}>
                    <BoxIcon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.tracks?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <SquircleIcon />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
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
