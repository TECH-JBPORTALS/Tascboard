import { Container } from "@/components/container";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";

const users = [
  { name: "Manu", url: "https://github.com/x-sss-x.png" },
  { name: "JB Portals", url: "https://github.com/JBPORTALS.png" },
  { name: "Akash", url: "https://github.com/akash.png" },
  { name: "Gayathri Emparala", url: "https://github.com/gayathriemparala.png" },
  { name: "Theo", url: "https://github.com/theo.png" },
];

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
