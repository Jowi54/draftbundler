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
        "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold ring-1 ring-border",
        className,
      )}
      style={{ backgroundColor: service.bg, color: service.fg }}
    >
      {service.short}
    </span>
  );
}
