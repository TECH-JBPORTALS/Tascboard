import type { TascStatus } from "@/server/db/schema";
import {
  CircleCheckIcon,
  CircleIcon,
  TimerIcon,
  VerifiedIcon,
  type LucideIcon,
} from "lucide-react";

export type TascStatusItem = {
  value: TascStatus;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export const TASC_STATUS_LIST: TascStatusItem[] = [
  {
    value: "todo",
    label: "TODO",
    icon: CircleIcon,
    className: "text-muted-foreground hover:text-muted-foreground",
  },
  {
    value: "in_progress",
    label: "In progress",
    icon: TimerIcon,
    className: "hover:text-amber-600 text-amber-600",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CircleCheckIcon,
    className: "hover:text-green-600 text-green-600",
  },
  {
    value: "verified",
    label: "Verified",
    icon: VerifiedIcon,
    className: "hover:text-teal-600 text-teal-600",
  },
];
