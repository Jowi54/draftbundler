import type { Service } from "@/lib/bundler-store";
import { cn } from "@/lib/utils";

export function ServiceLogo({
  service,
  className,
}: {
  service: Pick<Service, "short" | "bg" | "fg" | "name">;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ring-1 ring-black/5",
        className,
      )}
      style={{ backgroundColor: service.bg, color: service.fg }}
    >
      {service.short}
    </span>
  );
}
