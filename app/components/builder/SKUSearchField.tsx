/**
 * SKU Search Field Component
 *
 * Phase 2.0: Search diamonds by stock number/SKU.
 *
 * Features:
 * - Text input with search icon
 * - Clear button
 * - Loading state
 * - Enter key submit
 * - No results message
 * - Debounced search (300ms) for performance
 */

import { useState, useEffect, useRef } from "react";

interface SKUSearchFieldProps {
  onSearch: (sku: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SKUSearchField({
  onSearch,
  isLoading = false,
  placeholder = "Search Diamond Stock #",
}: SKUSearchFieldProps) {
  const [sku, setSku] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce search for auto-search as user types (300ms delay)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only trigger search if SKU is empty (for clearing) or has at least 2 characters
    if (sku.length === 0 || sku.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        onSearch(sku.trim());
      }, 300);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [sku, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (sku.trim()) {
      onSearch(sku.trim());
    }
  };

  const handleClear = () => {
    setSku("");
    // onSearch will be called automatically by useEffect
  };

  return (
    <form onSubmit={handleSubmit} className="sku-search-field">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          disabled={isLoading}
        />
        {sku && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={!sku.trim() || isLoading}
        className="search-button"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>

      <style>{`
        .sku-search-field {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .search-input-container {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          font-size: 1.1rem;
          color: #999;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 3rem 0.75rem 2.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #6D2932;
          box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
        }

        .search-input:disabled {
          background: #f7f7f7;
          cursor: not-allowed;
        }

        .clear-button {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #999;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .clear-button:hover {
          background: #f0f0f0;
          color: #666;
        }

        .search-button {
          padding: 0.75rem 1.5rem;
          background: #000;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .search-button:hover:not(:disabled) {
          background: #333;
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .sku-search-field {
            flex-direction: column;
          }

          .search-button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}
