"use client";

import { Home, Users } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Employees",
    url: "#",
    icon: Users,
  },
];

export function NavMain() {
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton>
            {item.icon && <item.icon />}
            {item.title}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
