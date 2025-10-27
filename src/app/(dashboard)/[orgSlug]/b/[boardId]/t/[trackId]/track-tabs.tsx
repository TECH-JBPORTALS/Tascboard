"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const items = [
  { label: "Overview", url: "" },
  { label: "Tascs", url: "/tascs" },
];

export function TrackTabs() {
  const { boardId, trackId } = useParams<{
    boardId: string;
    trackId: string;
  }>();
  const basePath = `/b/${boardId}/t/${trackId}`;
  const pathname = usePathname();

  return (
    <Tabs value={pathname}>
      <TabsList>
        {items.map((item, i) => (
          <TabsTrigger asChild key={i} value={`${basePath}${item.url}`}>
            <Link href={`${basePath}${item.url}`}>{item.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
