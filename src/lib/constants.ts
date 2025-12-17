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
};

export const TASC_STATUS_LIST: TascStatusItem[] = [
  { value: "todo", label: "TODO", icon: CircleIcon },
  { value: "completed", label: "Completed", icon: CircleCheckIcon },
  { value: "in_progress", label: "In progress", icon: TimerIcon },
  { value: "verified", label: "Verified", icon: VerifiedIcon },
];
