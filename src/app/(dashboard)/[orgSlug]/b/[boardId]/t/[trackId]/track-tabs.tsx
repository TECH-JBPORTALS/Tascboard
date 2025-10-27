"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenText, List } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const items = [
  { label: "Overview", url: "", icon: BookOpenText },
  { label: "Tascs", url: "/tascs", icon: List },
];

export function TrackTabs() {
  const { boardId, trackId, orgId } = useParams<{
    boardId: string;
    trackId: string;
    orgId: string;
  }>();
  const basePath = `/${orgId}/b/${boardId}/t/${trackId}`;
  const pathname = usePathname();

  return (
    <Tabs value={pathname}>
      <TabsList>
        {items.map((item, i) => (
          <TabsTrigger asChild key={i} value={`${basePath}${item.url}`}>
            <Link href={`${basePath}${item.url}`}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
