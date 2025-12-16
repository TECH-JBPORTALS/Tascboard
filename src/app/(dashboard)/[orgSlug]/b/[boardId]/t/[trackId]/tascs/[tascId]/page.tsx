import { Container } from "@/components/container";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";

export default async function Track() {
  return (
    <Container className="px-52">
      <input
        placeholder="Untitled"
        className="text-3xl font-semibold focus-visible:outline-none"
      />
      <div className="flex items-center gap-4 py-1">
        <div className="flex items-center [&>svg]:size-4">
          {/* <DatePicker>
            <Button
              size={"xs"}
              className="data-[state=open]:bg-accent"
              variant={"ghost"}
            >
              <CalendarIcon />7 Jun
            </Button>
          </DatePicker>
          <ArrowRightIcon />
          <DatePicker>
            <Button
              size={"xs"}
              className="data-[state=open]:bg-accent"
              variant={"ghost"}
            >
              2 Sep, 2023
            </Button>
          </DatePicker> */}
        </div>
      </div>
      <Separator />
      <TextEditor />
    </Container>
  );
}
