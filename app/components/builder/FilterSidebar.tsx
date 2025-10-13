/**
 * Filter Sidebar Component
 *
 * Sidebar with filters for settings or stones.
 */

import React from "react";
import { FilterGroup } from "../shared/FilterGroup";
import { RangeSlider } from "../shared/RangeSlider";
import { SETTING_STYLES, METAL_TYPES } from "~/utils/constants";
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
        <h3>Filters</h3>
        <button onClick={clearAllFilters} className="clear-all">
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

          <FilterGroup
            title="Metal Type"
            options={METAL_TYPES as any}
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
        }

        .clear-all {
          background: none;
          border: none;
          color: #2c6ecb;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .clear-all:hover {
          text-decoration: underline;
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
