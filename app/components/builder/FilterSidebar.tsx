/**
 * Filter Sidebar Component
 *
 * Sidebar with filters for settings or stones.
 * Enhanced with lucide-react icons, visual metal swatches, and active filters display.
 */

import { Filter, RotateCcw } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { FilterGroup } from "../shared/FilterGroup";
import { RangeSlider } from "../shared/RangeSlider";
import { MetalTypeFilter } from "./filters/MetalTypeFilter";
import { SETTING_STYLES } from "~/utils/constants";
import { formatPrice } from "~/utils/formatters";

interface FilterSidebarProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  type: "settings" | "stones";
}

export function FilterSidebar({
  filters,
  onFilterChange,
  type,
}: FilterSidebarProps) {
  const handleStyleChange = (selected: string[]) => {
    onFilterChange({ ...filters, style: selected });
  };

  const handleMetalTypeChange = (selected: string[]) => {
    onFilterChange({ ...filters, metalType: selected });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceMin: min, priceMax: max });
  };

  const clearAllFilters = () => {
    if (type === "settings") {
      onFilterChange({
        style: [],
        metalType: [],
        priceMin: 0,
        priceMax: 50000,
      });
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-gradient-to-br from-background/90 via-background to-background/90 px-5 py-6 shadow-sm",
        "backdrop-blur supports-[backdrop-filter]:bg-background/85"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Icon icon={Filter} size="sm" />
          </span>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
              Refine your selection
            </p>
          </div>
        </div>

        {(filters.style?.length > 0 || filters.metalType?.length > 0) && (
          <Badge className="bg-primary text-primary-foreground shadow-sm">
            {(filters.style?.length || 0) + (filters.metalType?.length || 0)} Active
          </Badge>
        )}

        <Button
          type="button"
          size="sm"
          onClick={clearAllFilters}
          className="h-auto rounded-full border border-transparent bg-transparent px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
        >
          <Icon icon={RotateCcw} size="xs" />
          Clear All
        </Button>
      </div>

      {type === "settings" && (
        <>
          <FilterGroup
            title="Style"
            options={SETTING_STYLES as any}
            selected={filters.style || []}
            onChange={handleStyleChange}
            multiSelect
          />

          <MetalTypeFilter
            selected={filters.metalType || []}
            onChange={handleMetalTypeChange}
            multiSelect
          />

          <RangeSlider
            label="Price Range"
            min={0}
            max={50000}
            valueMin={filters.priceMin || 0}
            valueMax={filters.priceMax || 50000}
            onChange={handlePriceChange}
            step={100}
            formatValue={formatPrice}
          />
        </>
      )}
    </div>
  );
}
