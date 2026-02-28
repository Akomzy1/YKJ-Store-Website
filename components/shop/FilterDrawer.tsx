"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FilterContent, { computeActiveCount } from "./FilterContent";

interface FilterDrawerProps {
  lockedCategorySlug?: string;
}

// ── Inner component reads searchParams (needs Suspense wrapper) ───────────────
function FilterDrawerTrigger({
  lockedCategorySlug,
}: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeCount  = computeActiveCount(searchParams);

  return (
    <>
      {/* ── Trigger button ────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white hover:bg-muted text-sm font-medium transition-colors"
        aria-label={`Open filters${activeCount > 0 ? ` — ${activeCount} active` : ""}`}
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Sheet ─────────────────────────────────────────────────────── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-[320px] p-0 flex flex-col gap-0 bg-white [&>button]:top-4 [&>button]:right-4"
        >
          <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
            <SheetTitle className="font-heading text-[17px] leading-none text-foreground">
              Filter Products
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <Suspense>
              <FilterContent
                lockedCategorySlug={lockedCategorySlug}
                onApply={() => setOpen(false)}
              />
            </Suspense>
          </div>

          {/* Apply button */}
          <div className="border-t border-border px-5 py-4 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors"
            >
              Show Results
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ── Export with Suspense so parent page doesn't need to wrap it ───────────────
export default function FilterDrawer({ lockedCategorySlug }: FilterDrawerProps) {
  return (
    <Suspense
      fallback={
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
      }
    >
      <FilterDrawerTrigger lockedCategorySlug={lockedCategorySlug} />
    </Suspense>
  );
}
