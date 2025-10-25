import { Container } from "@/components/container";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, SendIcon, Users } from "lucide-react";

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
      </Container>
    </>
  );
}
