import { AppSidebar } from "@/components/app-sidebar";
import { BlipSidebar } from "@/components/blip-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BoxIcon } from "lucide-react";
import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-50 flex h-12 w-full shrink-0 items-center gap-2 border-b px-8 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 text-sm [&>svg]:size-4">
            <BoxIcon /> Chit Money
          </div>
        </header>
        {children}
      </SidebarInset>
      <BlipSidebar />
    </SidebarProvider>
  );
}
