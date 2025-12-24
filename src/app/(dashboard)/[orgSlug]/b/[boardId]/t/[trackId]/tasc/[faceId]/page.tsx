import { ScrollArea } from "@/components/ui/scroll-area";
import { TascDetailsPage } from "./tasc-details.page.client";

export default async function Track() {
  return (
    <ScrollArea className="flex flex-4">
      <TascDetailsPage />
    </ScrollArea>
  );
}
