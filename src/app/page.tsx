import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="flex h-svh flex-col items-center justify-center gap-3.5">
      <h1 className="text-4xl font-extrabold">Tascboard</h1>
      <p className="text-muted-foreground">All tasks under one roof</p>
      <Button size={"lg"} variant={"outline"}>
        🎯 Signin with Google
      </Button>
    </main>
  );
}
