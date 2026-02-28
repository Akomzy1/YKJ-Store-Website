"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FilterContent from "./FilterContent";

interface FilterSidebarProps {
  lockedCategorySlug?: string;
}

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4 pt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1.5 pl-1">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FilterSidebar({ lockedCategorySlug }: FilterSidebarProps) {
  return (
    <aside className="w-[280px] shrink-0 self-start sticky top-20">
      <Suspense fallback={<FilterSidebarSkeleton />}>
        <FilterContent lockedCategorySlug={lockedCategorySlug} />
      </Suspense>
    </aside>
  );
}
