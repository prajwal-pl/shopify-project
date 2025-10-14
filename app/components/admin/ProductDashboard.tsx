/**
 * Product Dashboard Component
 *
 * Phase 2.0: Enhanced product list with status indicators.
 *
 * Features:
 * - Product cards with 150x150px images
 * - Three status badges: ✓ Active, ⚠ Incomplete, ○ Unmarked
 * - Action buttons: Add as Diamond, Add as Setting, Edit Specs, Remove
 * - Search and filter controls
 * - Pagination
 * - Sync from Shopify button
 * - Advanced Tools section (CSV import)
 */

import { useState } from "react";

export interface ProductDashboardProduct {
  id: string;
  title: string;
  price: string;
  sku?: string;
  image?: string;
  status: "active" | "incomplete" | "unmarked";
  type?: "diamond" | "setting";
  metadata?: {
    shape?: string;
    carat?: number;
    diamondType?: string;
    style?: string;
  };
}

interface ProductDashboardProps {
  products: ProductDashboardProduct[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSync: () => void;
  onAddDiamond: (productId: string) => void;
  onAddSetting: (productId: string) => void;
  onEdit: (productId: string, type: "diamond" | "setting") => void;
  onRemove: (productId: string, type: "diamond" | "setting") => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  isLoading?: boolean;
}

export function ProductDashboard({
  products,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSync,
  onAddDiamond,
  onAddSetting,
  onEdit,
  onRemove,
  onSearch,
  onFilterChange,
  isLoading = false,
}: ProductDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="product-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Products ({totalCount})</h1>
        </div>
        <button className="sync-button" onClick={onSync} disabled={isLoading}>
          🔄 Sync from Shopify
        </button>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${selectedFilter === "active" ? "active" : ""}`}
            onClick={() => handleFilterChange("active")}
          >
            ✓ Active
          </button>
          <button
            className={`filter-btn ${selectedFilter === "incomplete" ? "active" : ""}`}
            onClick={() => handleFilterChange("incomplete")}
          >
            ⚠ Incomplete
          </button>
          <button
            className={`filter-btn ${selectedFilter === "unmarked" ? "active" : ""}`}
            onClick={() => handleFilterChange("unmarked")}
          >
            ○ Unmarked
          </button>
        </div>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <p className="empty-hint">
            Try adjusting your filters or sync from Shopify.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddDiamond={() => onAddDiamond(product.id)}
              onAddSetting={() => onAddSetting(product.id)}
              onEdit={() => product.type && onEdit(product.id, product.type)}
              onRemove={() =>
                product.type && onRemove(product.id, product.type)
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Next
          </button>
        </div>
      )}

      {/* Advanced Tools */}
      <div className="advanced-tools">
        <button
          className="toggle-advanced-tools"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "▼" : "▶"} Advanced Tools
        </button>
        {showAdvanced && (
          <div className="advanced-tools-content">
            <p className="advanced-warning">
              ⚠️ For bulk operations only (100+ products)
            </p>
            <div className="advanced-buttons">
              <a href="/app/builder/products/import" className="advanced-btn">
                📁 CSV Import
              </a>
              <a href="/app/builder/products/export" className="advanced-btn">
                📤 Export Data
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .product-dashboard {
          padding: 1.5rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header-title h1 {
          margin: 0;
          font-size: 1.75rem;
          color: #333;
        }

        .sync-button {
          padding: 0.75rem 1.5rem;
          background: #6D2932;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .sync-button:hover:not(:disabled) {
          background: #5a1f28;
        }

        .sync-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dashboard-controls {
          margin-bottom: 1.5rem;
        }

        .search-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
        }

        .search-button {
          padding: 0.75rem 1.5rem;
          background: #333;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          background: white;
          color: #666;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: #6D2932;
          background: #fff5f7;
        }

        .filter-btn.active {
          background: #6D2932;
          color: white;
          border-color: #6D2932;
        }

        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f0f0f0;
          border-top-color: #6D2932;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-hint {
          font-size: 0.9rem;
          color: #999;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .page-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #666;
        }

        .advanced-tools {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px dashed #e0e0e0;
        }

        .toggle-advanced-tools {
          background: none;
          border: none;
          color: #6D2932;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .advanced-tools-content {
          margin-top: 1rem;
          padding: 1rem;
          background: #fff9e6;
          border: 1px dashed #ffc107;
          border-radius: 6px;
        }

        .advanced-warning {
          color: #f57c00;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
        }

        .advanced-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .advanced-btn {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .advanced-btn:hover {
          border-color: #6D2932;
          background: #fff5f7;
        }
      `}</style>
    </div>
  );
}

/**
 * Product Card Component
 */
interface ProductCardProps {
  product: ProductDashboardProduct;
  onAddDiamond: () => void;
  onAddSetting: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

function ProductCard({
  product,
  onAddDiamond,
  onAddSetting,
  onEdit,
  onRemove,
}: ProductCardProps) {
  const getStatusBadge = () => {
    switch (product.status) {
      case "active":
        return <span className="status-badge active">✓ Active</span>;
      case "incomplete":
        return <span className="status-badge incomplete">⚠ Incomplete</span>;
      default:
        return <span className="status-badge unmarked">○ Unmarked</span>;
    }
  };

  const getMetadataDisplay = () => {
    if (!product.metadata) return null;

    if (product.type === "diamond" && product.metadata.shape) {
      return (
        <p className="metadata-display">
          {product.metadata.diamondType || "Mined"}, {product.metadata.shape},{" "}
          {product.metadata.carat}ct
        </p>
      );
    }

    if (product.type === "setting" && product.metadata.style) {
      return (
        <p className="metadata-display">Style: {product.metadata.style}</p>
      );
    }

    return null;
  };

  return (
    <div className="product-card">
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      )}

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-meta">
          ${product.price} {product.sku && `| SKU: ${product.sku}`}
        </p>

        <div className="product-status">
          {getStatusBadge()}
          {getMetadataDisplay()}
        </div>

        <div className="product-actions">
          {product.status === "unmarked" ? (
            <>
              <button className="action-btn primary" onClick={onAddDiamond}>
                Add as Diamond
              </button>
              <button className="action-btn primary" onClick={onAddSetting}>
                Add as Setting
              </button>
            </>
          ) : product.status === "incomplete" ? (
            <button className="action-btn warning" onClick={onEdit}>
              Complete Setup →
            </button>
          ) : (
            <>
              <button className="action-btn secondary" onClick={onEdit}>
                Edit Specs
              </button>
              <button className="action-btn danger" onClick={onRemove}>
                Remove
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .product-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #ccc;
        }

        .product-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          flex-shrink: 0;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: #333;
        }

        .product-meta {
          margin: 0 0 0.75rem 0;
          font-size: 0.9rem;
          color: #666;
        }

        .product-status {
          margin-bottom: 1rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .status-badge.active {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.incomplete {
          background: #fff3e0;
          color: #f57c00;
        }

        .status-badge.unmarked {
          background: #f5f5f5;
          color: #999;
        }

        .metadata-display {
          font-size: 0.9rem;
          color: #666;
          margin: 0.5rem 0 0 0;
        }

        .product-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: auto;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: #6D2932;
          color: white;
        }

        .action-btn.primary:hover {
          background: #5a1f28;
        }

        .action-btn.secondary {
          background: #f7f7f7;
          color: #333;
          border: 1px solid #e0e0e0;
        }

        .action-btn.secondary:hover {
          background: #e0e0e0;
        }

        .action-btn.warning {
          background: #ffc107;
          color: #333;
        }

        .action-btn.warning:hover {
          background: #f57c00;
          color: white;
        }

        .action-btn.danger {
          background: #dc3545;
          color: white;
        }

        .action-btn.danger:hover {
          background: #c82333;
        }

        @media (max-width: 640px) {
          .product-card {
            flex-direction: column;
          }

          .product-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
