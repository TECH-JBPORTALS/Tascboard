import { Container } from "@/components/container";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, SearchIcon } from "lucide-react";
import DataTableClient from "./data-table.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { CreateTascDialog } from "@/components/dialogs/create-tasc.dialog";

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

          <CreateTascDialog trackId={trackId}>
            <Button>
              <Plus /> New
            </Button>
          </CreateTascDialog>
        </div>

        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
