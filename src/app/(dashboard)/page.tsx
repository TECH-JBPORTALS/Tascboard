import { Megaphone } from "lucide-react";

export default async function Home() {
  return (
    <div className="md:@container/main:px-60 flex flex-1 flex-col items-center justify-center gap-4 px-8 py-6">
      <Megaphone className="text-muted-foreground/60 size-14" />
      <h3 className="text-2xl font-semibold">Coming soon!</h3>
      <p className="text-muted-foreground text-sm">
        Please be patient, we are cooking something here, it will be baked soon.
      </p>
    </div>
  );
}
