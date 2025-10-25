"use client";

import { Home, Users } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    exact: true,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton
            isActive={
              item.exact ? pathname === item.url : pathname.startsWith(item.url)
            }
            asChild
          >
            <Link href={item.url}>
              {item.icon && <item.icon />}
              {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
