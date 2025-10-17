/**
 * Step 2: Stone Selector
 *
 * Browse and select center stone with advanced filters.
 */

import React, { useState, useEffect } from "react";
import type { Stone, DiamondType, StoneShape, CutGrade, ColorGrade, ClarityGrade } from "~/types/builder";
import { useBuilder } from "../BuilderProvider";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { ErrorMessage } from "~/components/shared/ErrorMessage";
import { StoneTable } from "../StoneTable";
import { StoneCardList } from "../StoneCardList";
import { DiamondTypeTabs } from "../DiamondTypeTabs";
import { ShapeIconSelector } from "../ShapeIconSelector";
import { QualitySlider } from "../QualitySlider";
import { PriceRangeDisplay } from "../PriceRangeDisplay";
import { ResultsControlBar } from "../ResultsControlBar";
import { DiamondCard } from "~/components/ui/DiamondCard";

export function StoneSelector({ shop }: { shop: string }) {
  const { selectedSetting, selectStone, showStoneDetailView } = useBuilder();
  const [stones, setStones] = useState<Stone[]>([]);
  const [mockDiamonds, setMockDiamonds] = useState<Stone[]>([]);
  const [allMockDiamonds, setAllMockDiamonds] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [diamondType, setDiamondType] = useState<DiamondType>("mined");
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [perPage, setPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const CUT_OPTIONS = ["Ideal", "Excellent", "V.Good", "Good", "Fair"];
  const COLOR_OPTIONS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
  const CLARITY_OPTIONS = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2"];

  const [cutRange, setCutRange] = useState({ min: 0, max: CUT_OPTIONS.length - 1 });
  const [colorRange, setColorRange] = useState({ min: 0, max: COLOR_OPTIONS.length - 1 });
  const [clarityRange, setClarityRange] = useState({ min: 0, max: CLARITY_OPTIONS.length - 1 });
  const [sortBy, setSortBy] = useState<{
    field: string;
    order: "asc" | "desc";
  }>({
    field: "price",
    order: "asc",
  });
  const [isMobile, setIsMobile] = useState(false);
  const fetchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadMockDiamonds = async () => {
      try {
        const response = await fetch('/data/mock-diamonds.json');
        const data: Stone[] = await response.json();
        setAllMockDiamonds(data);
        setMockDiamonds(data);
      } catch (err) {
        console.error('Failed to load mock diamonds:', err);
      }
    };
    loadMockDiamonds();
  }, []);

  useEffect(() => {
    const filterMockDiamonds = () => {
      let filtered = [...allMockDiamonds];

      if (filters.shape.length > 0) {
        filtered = filtered.filter(diamond =>
          filters.shape.includes(diamond.shape)
        );
      }

      if (diamondType) {
        filtered = filtered.filter(diamond =>
          diamond.diamondType === diamondType
        );
      }

      filtered = filtered.filter(diamond =>
        diamond.carat >= filters.caratMin && diamond.carat <= filters.caratMax
      );

      filtered = filtered.filter(diamond =>
        diamond.price >= filters.priceMin && diamond.price <= filters.priceMax
      );

      if (cutRange.min > 0 || cutRange.max < CUT_OPTIONS.length - 1) {
        const selectedCuts = CUT_OPTIONS.slice(cutRange.min, cutRange.max + 1);
        filtered = filtered.filter(diamond =>
          diamond.cut && selectedCuts.includes(diamond.cut)
        );
      }

      if (colorRange.min > 0 || colorRange.max < COLOR_OPTIONS.length - 1) {
        const selectedColors = COLOR_OPTIONS.slice(colorRange.min, colorRange.max + 1);
        filtered = filtered.filter(diamond =>
          diamond.color && selectedColors.includes(diamond.color)
        );
      }

      if (clarityRange.min > 0 || clarityRange.max < CLARITY_OPTIONS.length - 1) {
        const selectedClarities = CLARITY_OPTIONS.slice(clarityRange.min, clarityRange.max + 1);
        filtered = filtered.filter(diamond =>
          diamond.clarity && selectedClarities.includes(diamond.clarity)
        );
      }

      if (sortBy.field === 'price') {
        filtered.sort((a, b) => sortBy.order === 'asc' ? a.price - b.price : b.price - a.price);
      } else if (sortBy.field === 'carat') {
        filtered.sort((a, b) => sortBy.order === 'asc' ? a.carat - b.carat : b.carat - a.carat);
      }

      setMockDiamonds(filtered);
    };

    filterMockDiamonds();
  }, [filters, diamondType, cutRange, colorRange, clarityRange, sortBy, allMockDiamonds]);

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
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchStones();
    }, 500);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [filters, sortBy, diamondType]);

  const handleSaveSearch = () => {
    console.log("Save search", { diamondType, filters });
  };

  const handleReset = () => {
    setDiamondType("mined");
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
    });
    setCutRange({ min: 0, max: CUT_OPTIONS.length - 1 });
    setColorRange({ min: 0, max: COLOR_OPTIONS.length - 1 });
    setClarityRange({ min: 0, max: CLARITY_OPTIONS.length - 1 });
  };

  const fetchStones = async () => {
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        shop,
        diamondType,
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
      setIsInitialLoad(false);
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

      <DiamondTypeTabs
        selectedType={diamondType}
        onChange={setDiamondType}
        onSaveSearch={handleSaveSearch}
        onReset={handleReset}
        compareCount={0}
      />

      <div className="filters-section">
        <ShapeIconSelector
          selectedShapes={filters.shape as StoneShape[]}
          onChange={(shapes) => setFilters({ ...filters, shape: shapes })}
        />

        <QualitySlider
          label="CUT"
          options={CUT_OPTIONS}
          minValue={cutRange.min}
          maxValue={cutRange.max}
          onMinChange={(min) => setCutRange({ ...cutRange, min })}
          onMaxChange={(max) => setCutRange({ ...cutRange, max })}
        />

        <QualitySlider
          label="COLOR"
          options={COLOR_OPTIONS}
          minValue={colorRange.min}
          maxValue={colorRange.max}
          onMinChange={(min) => setColorRange({ ...colorRange, min })}
          onMaxChange={(max) => setColorRange({ ...colorRange, max })}
        />

        <QualitySlider
          label="CLARITY"
          options={CLARITY_OPTIONS}
          minValue={clarityRange.min}
          maxValue={clarityRange.max}
          onMinChange={(min) => setClarityRange({ ...clarityRange, min })}
          onMaxChange={(max) => setClarityRange({ ...clarityRange, max })}
        />

        <div className="carat-price-row">
          <PriceRangeDisplay
            label="CARAT"
            minPrice={filters.caratMin}
            maxPrice={filters.caratMax}
            onMinChange={(min) => setFilters({ ...filters, caratMin: min })}
            onMaxChange={(max) => setFilters({ ...filters, caratMax: max })}
            absoluteMin={0.5}
            absoluteMax={10}
            step={0.1}
          />

          <PriceRangeDisplay
            label="PRICE"
            minPrice={filters.priceMin}
            maxPrice={filters.priceMax}
            onMinChange={(min) => setFilters({ ...filters, priceMin: min })}
            onMaxChange={(max) => setFilters({ ...filters, priceMax: max })}
            absoluteMin={0}
            absoluteMax={200000}
          />
        </div>
      </div>

      <ResultsControlBar
        totalResults={stones.length + mockDiamonds.length}
        compareCount={0}
        perPage={perPage}
        onPerPageChange={setPerPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {stones.length === 0 && mockDiamonds.length === 0 ? (
        <div className="empty-state">
          <p>No diamonds found with your current filters.</p>
          <button
            onClick={handleReset}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {mockDiamonds.length > 0 && (
            <div className="results-section">
              <h3 className="section-title">Available Diamonds ({mockDiamonds.length})</h3>
              <div className="diamonds-grid">
                {mockDiamonds.map((diamond) => (
                  <DiamondCard
                    key={diamond.id}
                    diamond={diamond}
                    onSelect={(d) => {
                      selectStone(d);
                      showStoneDetailView(d);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {stones.length > 0 && (
            <div className="results-section">
              <h3 className="section-title">From Inventory ({stones.length})</h3>
              {isMobile || viewMode === "list" ? (
                <StoneTable stones={stones} sortBy={sortBy} onSortChange={setSortBy} />
              ) : (
                <StoneCardList stones={stones} />
              )}
            </div>
          )}
        </>
      )}

      <style>{`
        .stone-selector {
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

        .carat-price-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .carat-price-row {
            grid-template-columns: 1fr;
          }

          .filters-section {
            padding: 16px;
          }
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

        .diamonds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .diamonds-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .diamonds-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
