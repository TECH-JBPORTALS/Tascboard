"use client";

import { Home, Users } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "",
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
  const params = useParams<{ orgSlug: string }>();

  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton
            isActive={
              item.exact
                ? pathname === `/${params.orgSlug}${item.url}`
                : pathname.startsWith(`/${params.orgSlug}${item.url}`)
            }
            asChild
          >
            <Link href={`/${params.orgSlug}${item.url}`}>
              {item.icon && <item.icon />}
              {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
