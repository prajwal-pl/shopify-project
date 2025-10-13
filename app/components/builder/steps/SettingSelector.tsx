/**
 * Step 1: Setting Selector
 *
 * Browse and select ring settings with filters.
 */

import React, { useState, useEffect } from "react";
import type { Setting } from "~/types/builder";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { ErrorMessage } from "~/components/shared/ErrorMessage";
import { FilterSidebar } from "../FilterSidebar";
import { SettingCard } from "../SettingCard";

export function SettingSelector({ shop }: { shop: string }) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    style: [] as string[],
    metalType: [] as string[],
    priceMin: 0,
    priceMax: 50000,
  });

  useEffect(() => {
    fetchSettings();
  }, [filters]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        shop,
        ...(filters.style.length > 0 && { style: filters.style.join(",") }),
        ...(filters.metalType.length > 0 && {
          metalType: filters.metalType.join(","),
        }),
        priceMin: filters.priceMin.toString(),
        priceMax: filters.priceMax.toString(),
      });

      const response = await fetch(`/api/builder/settings?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch settings");
      }

      setSettings(data.settings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading ring settings..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSettings} />;
  }

  return (
    <div className="setting-selector">
      <div className="selector-header">
        <h2>Choose Your Ring Setting</h2>
        <p>Select the perfect foundation for your ring</p>
      </div>

      <div className="selector-content">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          type="settings"
        />

        <div className="settings-grid">
          {settings.length === 0 ? (
            <div className="empty-state">
              <p>No settings found with your current filters.</p>
              <button
                onClick={() =>
                  setFilters({
                    style: [],
                    metalType: [],
                    priceMin: 0,
                    priceMax: 50000,
                  })
                }
                className="clear-filters-button"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            settings.map((setting) => (
              <SettingCard key={setting.id} setting={setting} />
            ))
          )}
        </div>
      </div>

      <style>{`
        .setting-selector {
          width: 100%;
        }

        .selector-header {
          margin-bottom: 32px;
        }

        .selector-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
        }

        .selector-header p {
          font-size: 16px;
          color: #6d7175;
          margin: 0;
        }

        .selector-content {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state p {
          font-size: 16px;
          color: #6d7175;
          margin-bottom: 20px;
        }

        .clear-filters-button {
          padding: 10px 20px;
          background: #2c6ecb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .clear-filters-button:hover {
          background: #1f5199;
        }

        @media (max-width: 1024px) {
          .selector-content {
            grid-template-columns: 1fr;
          }

          .settings-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
