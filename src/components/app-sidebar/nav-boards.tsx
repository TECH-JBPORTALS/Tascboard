"use client";

import {
  AlertOctagonIcon,
  BoxIcon,
  MoreHorizontalIcon,
  SquircleIcon,
  TriangleIcon,
} from "lucide-react";

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
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import isEmpty from "lodash/isEmpty";
import { BoardActionDropdownMenu } from "./board-action.dropdown.menu";
import { useBoardList } from "@/hooks/use-board-list";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { TrackActionDropdownMenu } from "./track-action.dropdown.menu";
import { authClient } from "@/utils/auth-client";

export function NavBoards() {
  const pathname = usePathname();
  const params = useParams<{ orgSlug: string }>();
  const { boards, toggleBoard } = useBoardList();
  const canCreateTrackOrDeleteBoard =
    authClient.organization.checkRolePermission({
      role: "owner",
      permissions: { board: ["delete"], track: ["create"] },
    });

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
        {boards.map((item) => {
          return (
            <Collapsible
              key={item.id}
              asChild
              open={item.open}
              onOpenChange={() => toggleBoard(item.id)}
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
                  tooltip={item.name}
                  className="pl-6"
                  isActive={pathname === `/${params.orgSlug}/b/${item.id}`}
                >
                  <Link href={`/${params.orgSlug}/b/${item.id}`}>
                    <BoxIcon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>

                {canCreateTrackOrDeleteBoard && (
                  <BoardActionDropdownMenu boardId={item.id}>
                    <SidebarMenuAction className="data-[state=open]:bg-sidebar-accent opacity-0 peer-hover/menu-button:opacity-100 hover:opacity-100 data-[state=open]:opacity-100">
                      <MoreHorizontalIcon />
                    </SidebarMenuAction>
                  </BoardActionDropdownMenu>
                )}

                <CollapsibleContent>
                  <SidebarMenuSub className="pr-0">
                    {item.open && <TrackList boardId={item.id} />}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

function TrackList({ boardId }: { boardId: string }) {
  const trpc = useTRPC();
  const {
    data: tracks,
    isLoading,
    isError,
  } = useQuery(trpc.track.list.queryOptions({ boardId }));

  const pathname = usePathname();
  const params = useParams<{ orgSlug: string }>();

  if (isLoading)
    return Array.from({ length: 3 }).map((_, i) => (
      <SidebarMenuSkeleton key={i} />
    ));

  if (isError || !tracks)
    return (
      <div className="text-xs text-amber-600">
        <AlertOctagonIcon className="mr-1 inline size-3" />
        Unable to fetch tracks
      </div>
    );

  if (isEmpty(tracks))
    return (
      <div className="text-muted-foreground text-xs">
        No tracks in this board
      </div>
    );

  return (
    <>
      {tracks.map((subItem) => (
        <SidebarMenuSubItem key={subItem.id}>
          <SidebarMenuSubButton
            className="peer/menu-sub-button"
            asChild
            isActive={pathname.startsWith(
              `/${params.orgSlug}/b/${boardId}/t/${subItem.id}`,
            )}
          >
            <Link href={`/${params.orgSlug}/b/${boardId}/t/${subItem.id}`}>
              <SquircleIcon />
              <span>{subItem.name}</span>
            </Link>
          </SidebarMenuSubButton>
          <TrackActionDropdownMenu trackId={subItem.id}>
            <SidebarMenuAction className="data-[state=open]:bg-sidebar-accent opacity-0 peer-hover/menu-sub-button:opacity-100 hover:opacity-100 data-[state=open]:opacity-100">
              <MoreHorizontalIcon />
            </SidebarMenuAction>
          </TrackActionDropdownMenu>
        </SidebarMenuSubItem>
      ))}
    </>
  );
}
