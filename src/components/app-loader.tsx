import Image from "next/image";

export function AppLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="relative size-12 h-fit">
        <div className="bg-primary/40 animation-duration-[2s] absolute inset-0 z-30 animate-ping rounded-2xl" />
        <div className="bg-primary/40 animation-duration-[2s] absolute inset-0 z-30 animate-ping rounded-xl delay-500" />
        <div className="bg-primary/40 animation-duration-[2s] absolute inset-0 z-30 animate-ping rounded-lg delay-1500" />
        <div className="z-[9999]">
          <Image
            src="/tascboard.svg"
            height={48}
            width={48}
            alt="tascboard logo"
          />
        </div>
      </div>
    </div>
  );
}
