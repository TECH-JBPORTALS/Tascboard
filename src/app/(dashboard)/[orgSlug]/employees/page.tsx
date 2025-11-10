import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, Users } from "lucide-react";
import { columns } from "./columns";
import { InviteEmployeesButton } from "@/components/invite-employees.button";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export default async function Employees() {
  const employees = await auth.api
    .listMembers({
      headers: await headers(),
    })
    .then((r) => r.members)
    .catch((e) => console.log(`Error in fetching employees: `, e));

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

          <InviteEmployeesButton />
        </div>

        <DataTable columns={columns} data={employees ?? []} />
      </Container>
    </>
  );
}
