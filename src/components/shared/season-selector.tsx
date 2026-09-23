"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import type { SeasonOption, SeasonSelection } from "@/lib/season-types";

export function SeasonSelector({
  seasons,
  selection,
}: {
  seasons: SeasonOption[];
  selection: SeasonSelection;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSeason = seasons.find((season) => season.isActive);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SelectPrimitive.Root value={String(selection)} onValueChange={handleChange}>
      <SelectPrimitive.Trigger
        aria-label="Selecciona la temporada"
        className="group flex h-[3.75rem] w-full max-w-[min(100%,22rem)] items-center gap-3 rounded-xl border border-primary/20 bg-card/70 px-3 text-left shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=open]:border-primary/50 data-[state=open]:bg-card sm:w-auto sm:min-w-[17rem]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Temporada
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <SelectPrimitive.Value className="truncate text-sm font-semibold text-foreground" />
            {selection === "all" ? (
              <span className="shrink-0 rounded-full border border-border bg-muted/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                Totes
              </span>
            ) : activeSeason && selection === activeSeason.id ? (
              <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                Activa
              </span>
            ) : null}
          </span>
        </span>

        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary"
          aria-hidden="true"
        />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          align="end"
          sideOffset={8}
          className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[17rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-xl shadow-black/30 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <SelectPrimitive.Viewport className="max-h-[var(--radix-select-content-available-height)]">
            <SelectPrimitive.Group>
              <SelectPrimitive.Label className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Veure estadístiques de
              </SelectPrimitive.Label>

              {seasons.map((season) => (
                <SelectPrimitive.Item
                  key={season.id}
                  value={String(season.id)}
                  className="flex min-h-12 cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground data-[state=checked]:bg-primary/5"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <SelectPrimitive.ItemText className="truncate text-sm font-medium">
                      {season.name}
                    </SelectPrimitive.ItemText>
                    <span className="text-[11px] text-muted-foreground">
                      {season.sessionCount} {season.sessionCount === 1 ? "sessió" : "sessions"}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    {season.isActive && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                        Activa
                      </span>
                    )}
                    <SelectPrimitive.ItemIndicator className="flex size-4 items-center justify-center text-primary">
                      <Check className="size-3.5" aria-hidden="true" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>

            <SelectPrimitive.Separator className="my-1.5 h-px bg-border/80" />

            <SelectPrimitive.Group>
              <SelectPrimitive.Item
                value="all"
                className="flex min-h-12 cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 outline-none transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground data-[state=checked]:bg-primary/5"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <SelectPrimitive.ItemText className="text-sm font-medium">
                    Totes les temporades
                  </SelectPrimitive.ItemText>
                  <span className="text-[11px] text-muted-foreground">
                    Historial complet
                  </span>
                </span>
                <SelectPrimitive.ItemIndicator className="flex size-4 items-center justify-center text-primary">
                  <Check className="size-3.5" aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
