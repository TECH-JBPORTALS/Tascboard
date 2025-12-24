"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TASC_PRIORITY_LIST, TASC_STATUS_LIST } from "@/lib/constants";
import type { ActivityPayloadByAction, TascStatus } from "@/server/db/schema";
import { useTRPC, type RouterOutputs } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
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
          <div className="absolute top-2.5 left-0">
            <Avatar className="bg-foreground flex size-4 items-center justify-center rounded-full">
              <AvatarImage src={ta.performedByUser?.image ?? ""} alt="Avatar" />
              <AvatarFallback className="text-[10px]">
                {ta.performedByUser?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <span className="text-muted-foreground inline-flex rounded-xl py-2 text-sm tracking-tight">
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
          {tascActivity.performedByUser?.name} changed the title of the tasc to{" "}
          <b>
            {payload.to.length > 40
              ? payload.to.slice(0, 40).concat("...")
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
  }
}
