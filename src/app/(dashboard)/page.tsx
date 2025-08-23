import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";

const users = [
  { url: "https://github.com/x-sss-x.png" },
  { url: "https://github.com/JBPORTALS.png" },
  { url: "https://github.com/akash.png" },
];

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-60 py-6">
      <input
        placeholder="Untitled"
        className="text-3xl font-semibold focus-visible:outline-none"
      />
      <div className="flex items-center gap-4 py-1">
        <div className="flex items-center [&>svg]:size-4">
          <Button size={"xs"} variant={"ghost"}>
            <CalendarIcon />7 Jun
          </Button>
          <ArrowRightIcon />
          <Button size={"xs"} variant={"ghost"}>
            2 Sep, 2023
          </Button>
        </div>

        <Button variant={"ghost"} size={"xs"}>
          <span className="inline-flex -space-x-2">
            {users.map((item, i) => (
              <Avatar key={i} className="border-background size-6 border-2">
                <AvatarImage src={item.url} />
              </Avatar>
            ))}
          </span>
          {users.length} Members
        </Button>
      </div>
      <Separator />
      <TextEditor />
    </div>
  );
}
