import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "md:@container/main:px-60 flex flex-1 flex-col gap-4 px-6 py-6",
        className,
      )}
      {...props}
    />
  );
}
