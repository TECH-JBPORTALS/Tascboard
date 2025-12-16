"use client";

import { useParams, usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";
import type React from "react";

interface NavMainMenuItemProps {
  url: string;
  exact?: boolean;
  children: React.ReactNode;
}

export function NavMainMenuItemClient({
  url,
  exact,
  children,
}: NavMainMenuItemProps) {
  const pathname = usePathname();
  const params = useParams<{ orgSlug: string }>();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={
          exact
            ? pathname === `/${params.orgSlug}${url}`
            : pathname.startsWith(`/${params.orgSlug}${url}`)
        }
        asChild
      >
        <Link href={`/${params.orgSlug}${url}`}>{children}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
