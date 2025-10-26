import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";
import { columns, type Tasc } from "./columns";
import { Button } from "@/components/ui/button";
import { NewTascButton } from "@/components/new-tasc.dialog";

const tascs: Tasc[] = [
  {
    id: "1",
    faceId: "CHIT-01",
    title: "fix: Sidebar button when it's active",
    createdBy: "Manu",
    status: "not-started",
  },
  {
    id: "CHIT-02",
    faceId: "CHIT-02",
    title: "fix: Hover state of profile avatar",
    createdBy: "Manu",
    status: "in-progress",
  },
  {
    id: "1",
    faceId: "CHIT-03",
    title: "feat: Post the new comments in side bar",
    createdBy: "Manu",
    status: "in-progress",
  },
];

export default function Employees() {
  return (
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

      <DataTable columns={columns} data={tascs} />
    </Container>
  );
}
