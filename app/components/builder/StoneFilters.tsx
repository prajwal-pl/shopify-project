/**
 * Stone Filters Component
 *
 * Advanced filters for stone selection (4Cs, price, certification).
 */

import React from "react";
import { FilterGroup } from "../shared/FilterGroup";
import { RangeSlider } from "../shared/RangeSlider";
import {
  STONE_SHAPES,
  CUT_GRADES,
  COLOR_GRADES,
  CLARITY_GRADES,
  CERTIFICATION_TYPES,
} from "~/utils/constants";
import { formatPrice, formatCarat } from "~/utils/formatters";

interface StoneFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export function StoneFilters({ filters, onFilterChange }: StoneFiltersProps) {
  return (
    <div className="stone-filters">
      <div className="filters-header">
        <h3>Filter Stones</h3>
      </div>

      <div className="filters-grid">
        <FilterGroup
          title="Shape"
          options={STONE_SHAPES as any}
          selected={filters.shape || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, shape: selected })
          }
          multiSelect
        />

        <FilterGroup
          title="Cut Grade"
          options={CUT_GRADES as any}
          selected={filters.cut || []}
          onChange={(selected) => onFilterChange({ ...filters, cut: selected })}
          multiSelect
        />

        <FilterGroup
          title="Color Grade"
          options={COLOR_GRADES as any}
          selected={filters.color || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, color: selected })
          }
          multiSelect
        />

        <FilterGroup
          title="Clarity Grade"
          options={CLARITY_GRADES as any}
          selected={filters.clarity || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, clarity: selected })
          }
          multiSelect
        />

        <FilterGroup
          title="Certification"
          options={CERTIFICATION_TYPES as any}
          selected={filters.certification || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, certification: selected })
          }
          multiSelect
        />

        <div className="range-filters">
          <RangeSlider
            label="Carat Weight"
            min={0.5}
            max={5.0}
            valueMin={filters.caratMin || 0.5}
            valueMax={filters.caratMax || 5.0}
            onChange={(min, max) =>
              onFilterChange({ ...filters, caratMin: min, caratMax: max })
            }
            step={0.1}
            formatValue={(v) => `${v.toFixed(2)} ct`}
          />

          <RangeSlider
            label="Price Range"
            min={0}
            max={100000}
            valueMin={filters.priceMin || 0}
            valueMax={filters.priceMax || 100000}
            onChange={(min, max) =>
              onFilterChange({ ...filters, priceMin: min, priceMax: max })
            }
            step={500}
            formatValue={formatPrice}
          />
        </div>
      </div>

      <style>{`
        .stone-filters {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .filters-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        .filters-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #202223;
          margin: 0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .range-filters {
          grid-column: 1 / -1;
        }

        @media (max-width: 1024px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
