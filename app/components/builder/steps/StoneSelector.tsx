/**
 * Step 2: Stone Selector
 *
 * Browse and select center stone with advanced filters.
 */

import React, { useState, useEffect } from "react";
import type { Stone } from "~/types/builder";
import { useBuilder } from "../BuilderProvider";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { ErrorMessage } from "~/components/shared/ErrorMessage";
import { StoneFilters } from "../StoneFilters";
import { StoneTable } from "../StoneTable";
import { StoneCardList } from "../StoneCardList";

export function StoneSelector({ shop }: { shop: string }) {
  const { selectedSetting } = useBuilder();
  const [stones, setStones] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    shape: selectedSetting?.compatibleShapes || [],
    caratMin: 0.5,
    caratMax: 5.0,
    cut: [] as string[],
    color: [] as string[],
    clarity: [] as string[],
    priceMin: 0,
    priceMax: 100000,
    certification: [] as string[],
  });
  const [sortBy, setSortBy] = useState<{
    field: string;
    order: "asc" | "desc";
  }>({
    field: "price",
    order: "asc",
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchStones();
  }, [filters, sortBy]);

  const fetchStones = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        shop,
        ...(filters.shape.length > 0 && { shape: filters.shape.join(",") }),
        caratMin: filters.caratMin.toString(),
        caratMax: filters.caratMax.toString(),
        ...(filters.cut.length > 0 && { cut: filters.cut.join(",") }),
        ...(filters.color.length > 0 && { color: filters.color.join(",") }),
        ...(filters.clarity.length > 0 && {
          clarity: filters.clarity.join(","),
        }),
        priceMin: filters.priceMin.toString(),
        priceMax: filters.priceMax.toString(),
        ...(filters.certification.length > 0 && {
          certification: filters.certification.join(","),
        }),
        sortBy: sortBy.field,
        sortOrder: sortBy.order,
      });

      const response = await fetch(`/api/builder/stones?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stones");
      }

      setStones(data.stones || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading diamonds and gemstones..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStones} />;
  }

  return (
    <div className="stone-selector">
      <div className="selector-header">
        <h2>Select Your Center Stone</h2>
        <p>Choose from our certified diamonds and gemstones</p>
      </div>

      <StoneFilters
        filters={filters as any}
        onFilterChange={setFilters as any}
      />

      {stones.length === 0 ? (
        <div className="empty-state">
          <p>No stones found with your current filters.</p>
          <button
            onClick={() =>
              setFilters({
                shape: selectedSetting?.compatibleShapes || [],
                caratMin: 0.5,
                caratMax: 5.0,
                cut: [],
                color: [],
                clarity: [],
                priceMin: 0,
                priceMax: 100000,
                certification: [],
              })
            }
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      ) : isMobile ? (
        <StoneCardList stones={stones} />
      ) : (
        <StoneTable stones={stones} sortBy={sortBy} onSortChange={setSortBy} />
      )}

      <style>{`
        .stone-selector {
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

        .empty-state {
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
      `}</style>
    </div>
  );
}
