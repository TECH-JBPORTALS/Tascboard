import type { TascPriority, TascStatus } from "@/server/db/schema";
import {
  CircleCheckIcon,
  CircleIcon,
  Minus,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Siren,
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

export type TascPriorityItem = {
  value: TascPriority;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export const TASC_PRIORITY_LIST: TascPriorityItem[] = [
  {
    value: "no_priority",
    label: "No priority",
    icon: Minus,
    className: "text-muted-foreground hover:text-muted-foreground",
  },
  {
    value: "urgent",
    label: "Urgent",
    icon: Siren,
    className: "text-rose-600 hover:text-rose-600",
  },
  {
    value: "high",
    label: "High",
    icon: SignalHigh,
    className: "text-orange-500 hover:text-orange-500",
  },
  {
    value: "medium",
    label: "Medium",
    icon: SignalMedium,
    className: "text-amber-500 hover:text-amber-500",
  },
  {
    value: "low",
    label: "Low",
    icon: SignalLow,
    className: "text-muted-foreground hover:text-muted-foreground",
  },
];
