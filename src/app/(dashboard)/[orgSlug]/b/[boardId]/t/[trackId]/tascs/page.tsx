import { Container } from "@/components/container";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { NewTascButton } from "@/components/new-tasc.dialog";
import DataTableClient from "./data-table.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Employees({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  prefetch(trpc.tasc.list.queryOptions({ trackId }));

  return (
    <HydrateClient>
      <Container>
        <div className="flex justify-between">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>

          <NewTascButton />
        </div>

        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
