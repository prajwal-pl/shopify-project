/**
 * Step 1: Setting Selector
 *
 * Browse and select ring settings with filters.
 */

import React, { useState, useEffect } from "react";
import type { Setting, MetalType } from "~/types/builder";
import type { RingProduct } from "~/types/ring-product";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { ErrorMessage } from "~/components/shared/ErrorMessage";
import { SettingCard } from "../SettingCard";
import { RingCard } from "~/components/ui/RingCard";
import { ActionBar } from "../ActionBar";
import { StyleImageSelector } from "../StyleImageSelector";
import { MetalGridSelector } from "../MetalGridSelector";
import { PriceRangeDisplay } from "../PriceRangeDisplay";

export function SettingSelector({ shop }: { shop: string}) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [ringProducts, setRingProducts] = useState<RingProduct[]>([]);
  const [allRingProducts, setAllRingProducts] = useState<RingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    style: [] as string[],
    metalType: [] as MetalType[],
    priceMin: 0,
    priceMax: 50000,
  });
  const fetchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSaveSearch = () => {
    console.log("Save search", filters);
  };

  const handleReset = () => {
    setFilters({
      style: [],
      metalType: [],
      priceMin: 0,
      priceMax: 50000,
    });
  };

  useEffect(() => {
    const loadRingProducts = async () => {
      try {
        const response = await fetch('/data/ring-products.json');
        const data: RingProduct[] = await response.json();
        setAllRingProducts(data);
        setRingProducts(data);
      } catch (err) {
        console.error('Failed to load ring products:', err);
      }
    };
    loadRingProducts();
  }, []);

  useEffect(() => {
    const filterRingProducts = () => {
      let filtered = [...allRingProducts];

      if (filters.style.length > 0) {
        filtered = filtered.filter(product =>
          filters.style.some(style =>
            product.title.toLowerCase().includes(style.toLowerCase()) ||
            product.category.toLowerCase().includes(style.toLowerCase())
          )
        );
      }

      if (filters.metalType.length > 0) {
        filtered = filtered.filter(product =>
          filters.metalType.some(metal =>
            product.metalType?.toLowerCase().includes(metal.toLowerCase())
          )
        );
      }

      setRingProducts(filtered);
    };

    filterRingProducts();
  }, [filters, allRingProducts]);

  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchSettings();
    }, 500);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [filters]);

  const fetchSettings = async () => {
    if (isInitialLoad) {
      setLoading(true);
    }
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
      setIsInitialLoad(false);
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

      <ActionBar
        onSaveSearch={handleSaveSearch}
        onReset={handleReset}
      />

      <div className="filters-section">
        <StyleImageSelector
          selectedStyles={filters.style}
          onChange={(styles) => setFilters({ ...filters, style: styles })}
        />

        <MetalGridSelector
          selectedMetals={filters.metalType}
          onChange={(metals) => setFilters({ ...filters, metalType: metals })}
        />

        <PriceRangeDisplay
          minPrice={filters.priceMin}
          maxPrice={filters.priceMax}
          onMinChange={(min) => setFilters({ ...filters, priceMin: min })}
          onMaxChange={(max) => setFilters({ ...filters, priceMax: max })}
        />
      </div>

      <div className="results-bar">
        <span className="results-count">
          {settings.length} Settings • {ringProducts.length} Ring Products
        </span>
      </div>

      <div className="selector-content">
        {ringProducts.length === 0 && settings.length === 0 ? (
          <div className="empty-state">
            <p>No ring products or settings found with your current filters.</p>
            <button onClick={handleReset} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {ringProducts.length > 0 && (
              <div className="results-section">
                <h3 className="section-title">Ring Products</h3>
                <div className="settings-grid">
                  {ringProducts.map((product) => (
                    <RingCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => {
                        console.log('Selected ring product:', p);
                        alert(`Selected: ${p.title} - ${p.price ? '$' + p.price.toLocaleString() : 'Price on request'}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {settings.length > 0 && (
              <div className="results-section">
                <h3 className="section-title">Ring Settings</h3>
                <div className="settings-grid">
                  {settings.map((setting) => (
                    <SettingCard key={setting.id} setting={setting} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .setting-selector {
          width: 100%;
        }

        .selector-header {
          margin-bottom: 24px;
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

        .filters-section {
          background: #f9f9f9;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .results-bar {
          background: white;
          border: 1px solid #e0e0e0;
          padding: 12px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-count {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .selector-content {
          width: 100%;
        }

        .results-section {
          margin-bottom: 40px;
        }

        .results-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #7c2d5e;
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
          .settings-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }

          .filters-section {
            padding: 16px;
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
