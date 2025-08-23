"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlipTextarea() {
  const [value, setValue] = React.useState("");
  return (
    <div
      className={cn(
        "bg-accent relative flex rounded-xl",
        value ? "flex-col" : "flex-row items-center",
      )}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message..."
        rows={value ? 3 : 1}
        className={cn(
          "text-accent-foreground placeholder:text-muted-foreground w-full resize-none px-3 py-2.5 focus-visible:outline-none",
        )}
      />

      {value.length === 0 && (
        <Button
          disabled
          size={"icon"}
          className="mr-1.5 size-8 rounded-full [&>svg]:size-4"
        >
          <ArrowUp />
        </Button>
      )}
      {value && (
        <div className="flex justify-end border-t px-3 py-2.5">
          <Button size={"icon"} className="size-8 rounded-full [&>svg]:size-4">
            <ArrowUp />
          </Button>
        </div>
      )}
    </div>
  );
}
