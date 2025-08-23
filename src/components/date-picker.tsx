"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import React from "react";

export default function DatePicker({
  children,
  calendarProps,
  ...props
}: React.ComponentProps<typeof Popover> & {
  calendarProps?: React.ComponentProps<typeof Calendar>;
}) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar mode="single" captionLayout="dropdown" {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
