/**
 * Filter Group Component
 *
 * Collapsible group of filter options (checkboxes or radio buttons).
 */

import React, { useState } from "react";

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
    <div className="filter-group">
      <div
        className="filter-header"
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <h4>{title}</h4>
        {collapsible && (
          <span className="toggle-icon">{isOpen ? "−" : "+"}</span>
        )}
      </div>

      {isOpen && (
        <div className="filter-options">
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
        }

        .filter-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #202223;
          margin: 0;
        }

        .toggle-icon {
          font-size: 20px;
          color: #6d7175;
          font-weight: 300;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #202223;
          cursor: pointer;
          padding: 4px 0;
        }

        .filter-option input {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }

        .filter-option:hover {
          color: #d4af37;
        }
      `}</style>
    </div>
  );
}
