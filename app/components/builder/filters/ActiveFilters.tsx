/**
 * Active Filters Component
 *
 * Display active filters as removable tags.
 * Enhances UX by showing what filters are applied and allowing quick removal.
 */

import { X, XCircle } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ActiveFilter {
  id: string;
  label: string;
  category: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-background px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge className="bg-primary/10 text-primary">
          {filters.length} {filters.length === 1 ? "Filter" : "Filters"} Applied
        </Badge>
        {onClearAll && (
          <Button
            type="button"
            size="sm"
            className="h-auto rounded-full border border-transparent bg-transparent px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            onClick={onClearAll}
          >
            <Icon icon={XCircle} size="sm" className="text-muted-foreground" />
            Clear All
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onRemove(filter.id)}
            aria-label={`Remove ${filter.label} filter`}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition",
              "hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
            )}
          >
            <span className="uppercase tracking-[0.18em] text-[0.65rem] text-muted-foreground">
              {filter.category}
            </span>
            <span className="text-sm font-semibold capitalize">{filter.label}</span>
            <Icon
              icon={X}
              size="xs"
              className="text-muted-foreground transition group-hover:rotate-90 group-hover:text-destructive"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
