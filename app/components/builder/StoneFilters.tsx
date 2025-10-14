/**
 * Stone Filters Component - Phase 2.0 Enhanced
 *
 * Advanced filters for stone selection with icon-based UI.
 *
 * Phase 2.0 Features:
 * - Icon-based shape filters
 * - Diamond type support (via DiamondTypeTabs in parent)
 * - Burgundy accent colors
 * - Enhanced visual design
 */

import { IconFilter, type IconFilterItem } from "./IconFilter";
import { FilterGroup } from "../shared/FilterGroup";
import { RangeSlider } from "../shared/RangeSlider";
import {
  STONE_SHAPES,
  CUT_GRADES,
  COLOR_GRADES,
  CLARITY_GRADES,
  CERTIFICATION_TYPES,
} from "~/utils/constants";
import { formatPrice } from "~/utils/formatters";
import type { StoneFilters as StoneFiltersType } from "~/types/builder";

interface StoneFiltersProps {
  filters: Partial<StoneFiltersType>;
  onFilterChange: (filters: Partial<StoneFiltersType>) => void;
}

export function StoneFilters({ filters, onFilterChange }: StoneFiltersProps) {
  // Convert shapes to IconFilterItem format
  const shapeItems: IconFilterItem[] = STONE_SHAPES.map((shape) => ({
    value: shape.value,
    label: shape.label,
  }));

  return (
    <div className="stone-filters">
      <div className="filters-header">
        <h3>Filter Diamonds</h3>
      </div>

      <div className="filters-content">
        {/* Phase 2.0: Icon-based shape filter */}
        <IconFilter
          items={shapeItems}
          selected={filters.shape || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, shape: selected as any })
          }
          multiSelect
          label="Shape"
          iconType="shape"
        />

        <FilterGroup
          title="Cut Grade"
          options={CUT_GRADES as any}
          selected={filters.cut || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, cut: selected as any })
          }
          multiSelect
        />

        <FilterGroup
          title="Color Grade"
          options={COLOR_GRADES as any}
          selected={filters.color || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, color: selected as any })
          }
          multiSelect
        />

        <FilterGroup
          title="Clarity Grade"
          options={CLARITY_GRADES as any}
          selected={filters.clarity || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, clarity: selected as any })
          }
          multiSelect
        />

        <FilterGroup
          title="Certification"
          options={CERTIFICATION_TYPES as any}
          selected={filters.certification || []}
          onChange={(selected) =>
            onFilterChange({ ...filters, certification: selected as any })
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
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .filters-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .filters-content {
          margin-bottom: 1.5rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .range-filters-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
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
