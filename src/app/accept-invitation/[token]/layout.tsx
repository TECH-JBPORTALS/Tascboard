import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-svh w-full flex-col items-center justify-center gap-8">
      <Image
        src={"/tascboard.svg"}
        height={42}
        width={42}
        alt="Tascbaord Logo"
      />
      {children}
    </section>
  );
}
