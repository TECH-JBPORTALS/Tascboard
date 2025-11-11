"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/trpc/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export type Employee = RouterOutputs["betterAuth"]["listMembers"][number];

export const columns: ColumnDef<Employee>[] = [
  {
    id: "employee",
    header: "Employee",
    cell(props) {
      const row = props.row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.user.image ?? "No image"}
              alt={row.user.name}
            />
            <AvatarFallback>{row.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <span className="text-sm font-medium">{row.user.name}</span>
            <p className="text-muted-foreground text-sm">{row.user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "more-action",
    cell(_props) {
      return (
        <div className="text-right">
          <Button variant={"ghost"} size={"icon-sm"}>
            <MoreHorizontalIcon />
          </Button>
        </div>
      );
    },
  },
];
