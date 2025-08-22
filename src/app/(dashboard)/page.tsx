import { TextEditor } from "@/components/text-editor";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-60 py-6">
      <input
        placeholder="Untitled"
        className="text-3xl font-semibold focus-visible:outline-none"
      />
      <Separator />
      <TextEditor />
    </div>
  );
}
