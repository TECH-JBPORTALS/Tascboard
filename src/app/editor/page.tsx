import { TextEditor } from "@/components/text-editor";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <main className="space-y-4 px-96 py-6">
      <input
        placeholder="Untitled"
        className="text-3xl font-semibold focus-visible:outline-none"
      />
      <Separator />
      <TextEditor />
    </main>
  );
}
