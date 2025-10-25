import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, SendIcon, Users } from "lucide-react";
import { columns, type Employee } from "./columns";

const employees: Employee[] = [
  {
    id: "1",
    name: "Manu",
    email: "manu48617@gmail.com",
  },
];

export default function Employees() {
  return (
    <>
      <SiteHeader
        startElement={
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="size-4" /> Employees
          </div>
        }
      />
      <Container>
        <div className="flex justify-between">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search employees..." />
          </InputGroup>

          <Button>
            <SendIcon /> Invite
          </Button>
        </div>

        <DataTable columns={columns} data={employees} />
      </Container>
    </>
  );
}
