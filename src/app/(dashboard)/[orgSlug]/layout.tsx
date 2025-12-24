import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="relative">
        <NextTopLoader
          color="#2563eb"
          crawl
          easing="linear"
          height={2}
          showSpinner={false}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
