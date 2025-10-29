/**
 * Filter Sidebar Component
 *
 * Sidebar with filters for settings or stones.
 * Enhanced with lucide-react icons, visual metal swatches, and active filters display.
 */

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
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
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>
          <Icon icon={Filter} size="sm" className="header-icon" />
          Filters
          {(filters.style?.length > 0 || filters.metalType?.length > 0) && (
            <span className="filter-count">
              {(filters.style?.length || 0) + (filters.metalType?.length || 0)}
            </span>
          )}
        </h3>
        <button onClick={clearAllFilters} className="clear-all">
          <Icon icon={RotateCcw} size="xs" />
          Clear All
        </button>
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

      <style>{`
        .filter-sidebar {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        .filter-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #202223;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon {
          color: #d4af37;
        }

        .filter-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: #d4af37;
          color: white;
          font-size: 12px;
          font-weight: 700;
          border-radius: 12px;
          animation: pop 0.3s ease-out;
        }

        @keyframes pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .clear-all {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #666;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .clear-all:hover {
          background: #fee;
          color: #e74c3c;
        }

        @media (max-width: 1024px) {
          .filter-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            bottom: 0;
            width: 300px;
            z-index: 200;
            transition: left 0.3s ease;
            border-radius: 0;
          }

          .filter-sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
