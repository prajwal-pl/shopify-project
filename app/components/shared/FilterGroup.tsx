/**
 * Filter Group Component
 *
 * Collapsible group of filter options (checkboxes or radio buttons).
 * Enhanced with lucide-react icons and smooth animations.
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { PREFERS_REDUCED_MOTION, handleKeyboardActivation } from "~/utils/accessibility";

interface FilterGroupProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  collapsible?: boolean;
}

export function FilterGroup({
  title,
  options,
  selected,
  onChange,
  multiSelect = true,
  collapsible = true,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (value: string, checked: boolean) => {
    if (multiSelect) {
      if (checked) {
        onChange([...selected, value]);
      } else {
        onChange(selected.filter((v) => v !== value));
      }
    } else {
      onChange(checked ? [value] : []);
    }
  };

  return (
    <div className="filter-group" role="group" aria-labelledby={`filter-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div
        className="filter-header"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        onKeyDown={(e) => collapsible && handleKeyboardActivation(e, () => setIsOpen(!isOpen))}
        tabIndex={collapsible ? 0 : -1}
        role={collapsible ? "button" : undefined}
        aria-expanded={collapsible ? isOpen : undefined}
        aria-controls={collapsible ? `filter-content-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      >
        <h4 id={`filter-${title.replace(/\s+/g, '-').toLowerCase()}`}>{title}</h4>
        {collapsible && (
          <Icon
            icon={isOpen ? ChevronUp : ChevronDown}
            size="sm"
            className="toggle-icon"
          />
        )}
      </div>

      {isOpen && (
        <div className="filter-options" id={`filter-content-${title.replace(/\s+/g, '-').toLowerCase()}`} role="group">
          {options.map((option) => (
            <label key={option.value} className="filter-option">
              <input
                type={multiSelect ? "checkbox" : "radio"}
                name={title}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      <style>{`
        .filter-group {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .filter-group:last-child {
          border-bottom: none;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
          margin-bottom: 12px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s ease;
          outline: none;
        }

        .filter-header:hover {
          background: #f9f9f9;
        }

        .filter-header:focus-visible {
          background: #f9f9f9;
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .filter-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #202223;
          margin: 0;
        }

        .toggle-icon {
          color: #6d7175;
          transition: all 0.2s ease;
        }

        .filter-header:hover .toggle-icon {
          color: #d4af37;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: slideDown 0.3s ease-out;
          will-change: opacity, transform;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #202223;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          will-change: transform;
        }

        .filter-option input {
          cursor: pointer;
          width: 18px;
          height: 18px;
          accent-color: #d4af37;
        }

        .filter-option input:checked + span {
          color: #d4af37;
          font-weight: 600;
        }

        .filter-option:hover {
          color: #d4af37;
          background: #fffbf0;
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .filter-option {
            padding: 12px;
            font-size: 15px;
          }

          .filter-option input {
            width: 20px;
            height: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .filter-header,
          .toggle-icon,
          .filter-option {
            transition-duration: 0.01ms !important;
          }

          .filter-options {
            animation: none;
          }

          .filter-option:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
