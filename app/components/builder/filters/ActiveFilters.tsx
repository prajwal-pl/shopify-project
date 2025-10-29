/**
 * Active Filters Component
 *
 * Display active filters as removable tags.
 * Enhances UX by showing what filters are applied and allowing quick removal.
 */

import { X } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { PREFERS_REDUCED_MOTION } from "~/utils/accessibility";

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
    <div className="active-filters">
      <div className="active-filters-header">
        <span className="active-count">
          {filters.length} {filters.length === 1 ? "Filter" : "Filters"} Applied
        </span>
        {onClearAll && (
          <button
            className="clear-all-btn"
            onClick={onClearAll}
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-tags">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className="filter-tag"
            onClick={() => onRemove(filter.id)}
            type="button"
            aria-label={`Remove ${filter.label} filter`}
          >
            <span className="tag-category">{filter.category}:</span>
            <span className="tag-label">{filter.label}</span>
            <Icon icon={X} size="xs" className="tag-remove" />
          </button>
        ))}
      </div>

      <style>{`
        .active-filters {
          padding: 1rem;
          background: #fffbf0;
          border-radius: 8px;
          border: 1px solid #f0e6d2;
          margin-bottom: 1.5rem;
          animation: slideIn 0.3s ease-out;
          will-change: opacity, transform;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .active-filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .active-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: #d4af37;
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: #666;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          outline: none;
        }

        .clear-all-btn:hover {
          background: white;
          color: #e74c3c;
        }

        .clear-all-btn:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 20px;
          font-size: 0.813rem;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          will-change: transform;
        }

        .filter-tag:hover {
          background: #fee;
          border-color: #e74c3c;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
        }

        .filter-tag:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .tag-category {
          font-weight: 600;
          color: #666;
        }

        .tag-label {
          color: #202223;
        }

        .filter-tag:hover .tag-label,
        .filter-tag:hover .tag-category {
          color: #e74c3c;
        }

        .tag-remove {
          transition: transform 0.2s ease;
          color: #999;
          will-change: transform;
        }

        .filter-tag:hover .tag-remove {
          transform: rotate(90deg);
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .active-filters {
            padding: 0.75rem;
          }

          .active-filters-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .clear-all-btn {
            align-self: flex-end;
          }

          .filter-tag {
            font-size: 0.875rem;
            padding: 0.625rem 0.875rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .active-filters {
            animation: none;
          }

          .clear-all-btn,
          .filter-tag,
          .tag-remove {
            transition-duration: 0.01ms !important;
          }

          .filter-tag:hover {
            transform: none;
          }

          .filter-tag:hover .tag-remove {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
