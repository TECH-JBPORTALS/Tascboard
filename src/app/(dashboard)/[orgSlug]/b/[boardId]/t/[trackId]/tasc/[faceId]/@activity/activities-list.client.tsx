"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TASC_PRIORITY_LIST, TASC_STATUS_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC, type RouterOutputs } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { ALargeSmallIcon, UserMinus2, UserPlus2, Users } from "lucide-react";
import { useParams } from "next/navigation";

export default function ActivitiesListClient() {
  const trpc = useTRPC();
  const { trackId, faceId } = useParams<{ trackId: string; faceId: string }>();
  const { data: tasc } = useSuspenseQuery(
    trpc.tasc.getById.queryOptions({ faceId, trackId }),
  );
  const { data: tascActivity } = useSuspenseQuery(
    trpc.tascActivity.list.queryOptions({ tascId: tasc.id! }),
  );

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <Separator
        orientation="vertical"
        className="bg-muted absolute -top-0.5 left-2"
      />
      {tascActivity.map((ta) => (
        <div
          key={ta.id}
          className="relative mb-3 flex w-full items-center pl-8"
        >
          <div className="bg-background absolute top-2 -left-1 flex size-6 justify-center rounded-full">
            <Icon tascActivity={ta} />
          </div>

          <span className="text-muted-foreground inline-flex rounded-xl py-2 text-xs tracking-tight">
            <Title tascActivity={ta} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Title({
  tascActivity,
}: {
  tascActivity: RouterOutputs["tascActivity"]["list"][number];
}) {
  switch (tascActivity.reason.action) {
    case "created":
      return (
        <span className="flex-nowrap">
          {tascActivity.performedByUser?.name} created tasc{" "}
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );

    case "status_changed": {
      const payload = tascActivity.reason.payload;

      return (
        <span className="flex-nowrap">
          {tascActivity.performedByUser?.name} moved from{" "}
          <b>
            {TASC_STATUS_LIST.find((item) => item.value == payload.from)?.label}
          </b>{" "}
          to{" "}
          <b>
            {TASC_STATUS_LIST.find((item) => item.value == payload.to)?.label}
          </b>{" "}
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );
    }

    case "priority_changed": {
      const payload = tascActivity.reason.payload;

      return (
        <span className="flex-nowrap">
          {tascActivity.performedByUser?.name} moved from{" "}
          <b>
            {
              TASC_PRIORITY_LIST.find((item) => item.value == payload.from)
                ?.label
            }
          </b>{" "}
          to{" "}
          <b>
            {TASC_PRIORITY_LIST.find((item) => item.value == payload.to)?.label}
          </b>{" "}
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );
    }

    case "title_changed": {
      const payload = tascActivity.reason.payload;

      return (
        <span className="flex-nowrap">
          {tascActivity.performedByUser?.name} changed the title to{" "}
          <b>
            {payload.to.length > 80
              ? payload.to.slice(0, 80).concat("...")
              : payload.to}
          </b>{" "}
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );
    }

    case "member_assigned": {
      return (
        <span className="inline-flex flex-wrap gap-1.5">
          {tascActivity.performedByUser?.name} assigned tasc to{" "}
          <Avatar className="flex size-4 items-center justify-center rounded-full">
            <AvatarImage
              src={tascActivity.assignedUser?.image ?? ""}
              alt="Avatar"
            />
            <AvatarFallback className="text-[10px]">
              {tascActivity.assignedUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>{" "}
          <b>{tascActivity.assignedUser?.name}</b>{" "}
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );
    }

    case "member_removed": {
      return (
        <span className="inline-flex flex-wrap gap-1.5">
          {tascActivity.performedByUser?.name} removed{" "}
          <Avatar className="flex size-4 items-center justify-center rounded-full">
            <AvatarImage
              src={tascActivity.assignedUser?.image ?? ""}
              alt="Avatar"
            />
            <AvatarFallback className="text-[10px]">
              {tascActivity.assignedUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>{" "}
          <b>{tascActivity.assignedUser?.name}</b> from the tasc
          <time className="text-muted-foreground top-3 rounded-xl text-xs tracking-tight">
            ·{" "}
            {formatDistanceToNowStrict(tascActivity.createdAt, {
              addSuffix: true,
            })}
          </time>
        </span>
      );
    }
  }
}

function Icon({
  tascActivity,
}: {
  tascActivity: RouterOutputs["tascActivity"]["list"][number];
}) {
  switch (tascActivity.reason.action) {
    case "created":
      return (
        <Avatar className="bg-foreground flex size-4 items-center justify-center rounded-full">
          <AvatarImage
            src={tascActivity.performedByUser?.image ?? ""}
            alt="Avatar"
          />
          <AvatarFallback className="text-[10px]">
            {tascActivity.performedByUser?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      );

    case "status_changed": {
      const payload = tascActivity.reason.payload;

      const status = TASC_STATUS_LIST.find((item) => item.value == payload.to);

      if (!status) return null;

      return <status.icon className={cn("size-4", status.className)} />;
    }

    case "priority_changed": {
      const payload = tascActivity.reason.payload;

      const priority = TASC_PRIORITY_LIST.find(
        (item) => item.value == payload.to,
      );

      if (!priority) return null;

      return <priority.icon className={cn("size-4", priority.className)} />;
    }

    case "title_changed": {
      return <ALargeSmallIcon className="text-accent-foreground size-4" />;
    }

    case "member_assigned": {
      return <UserPlus2 className="text-accent-foreground size-4" />;
    }

    case "member_removed": {
      return <UserMinus2 className="text-accent-foreground size-4" />;
    }
  }
}
