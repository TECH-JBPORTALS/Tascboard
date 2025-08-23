import { ArrowUp, ArrowUpIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { BlipTextarea } from "./blip-textarea";

export function BlipSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="bg-background sticky top-0 hidden h-svh w-[500px] border-l lg:flex"
    >
      <SidebarHeader className="h-12 border-b px-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Blip</span>
          <Button size={"xs"} variant={"ghost"}>
            <SearchIcon />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <BlipTextarea />
      </SidebarFooter>
    </Sidebar>
  );
}
