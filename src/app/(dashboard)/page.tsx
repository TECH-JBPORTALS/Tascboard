import { DatePicker } from "@/components/date-picker";
import { MembersPopover } from "@/components/members-popover";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import React from "react";

const users = [
  { name: "Manu", url: "https://github.com/x-sss-x.png" },
  { name: "JB Portals", url: "https://github.com/JBPORTALS.png" },
  { name: "Akash", url: "https://github.com/akash.png" },
  { name: "Gayathri Emparala", url: "https://github.com/gayathriemparala.png" },
  { name: "Theo", url: "https://github.com/theo.png" },
];

export default async function Home() {
  return (
    <div className="md:@container/main:px-60 flex flex-1 flex-col gap-4 px-8 py-6">
      <input
        placeholder="Untitled"
        className="text-3xl font-semibold focus-visible:outline-none"
      />
      <div className="flex items-center gap-4 py-1">
        <div className="flex items-center [&>svg]:size-4">
          <DatePicker>
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
          </DatePicker>
        </div>

        <MembersPopover memebers={users}>
          <Button
            variant={"ghost"}
            className="data-[state=open]:bg-accent"
            size={"xs"}
          >
            <span className="inline-flex -space-x-2">
              {users.map((item, i) => (
                <Avatar key={i} className="border-background size-6 border-2">
                  <AvatarImage src={item.url} />
                </Avatar>
              ))}
            </span>
            {users.length} Members
          </Button>
        </MembersPopover>
      </div>
      <Separator />
      <TextEditor />
    </div>
  );
}
