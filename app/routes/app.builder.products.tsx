/**
 * Ring Builder Products Page
 *
 * List all products with ability to mark as Settings/Stones.
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const limit = 50;

  try {
    // Fetch products directly from Shopify
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              title
              description
              handle
              status
              images(first: 1) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await admin.graphql(query, {
      variables: {
        first: limit,
        after: cursor,
      },
    });

    const data = await response.json();

    console.log("=================================================");
    console.log("🔷 RING BUILDER - Products Page Loader");
    console.log("=================================================");
    console.log(
      "📦 Products fetched from Shopify:",
      data.data?.products?.edges?.length || 0,
    );

    const productsData = data.data?.products;

    if (!productsData) {
      console.warn("⚠️ RING BUILDER: No products data from Shopify GraphQL");
      return {
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    // Transform products
    const products = productsData.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description || "",
      handle: edge.node.handle,
      status: edge.node.status,
      images: edge.node.images.edges.map((imgEdge: any) => ({
        id: imgEdge.node.id,
        url: imgEdge.node.url,
        altText: imgEdge.node.altText,
      })),
      variants: edge.node.variants.edges.map((varEdge: any) => ({
        id: varEdge.node.id,
        title: varEdge.node.title,
        sku: varEdge.node.sku || "",
        price: varEdge.node.price,
      })),
    }));

    // Get product IDs
    const productIds = products.map((p: any) => p.id);

    // Fetch Ring Builder metadata from database
    const [settings, stones] = await Promise.all([
      prisma.settingMetadata.findMany({
        where: {
          shop,
          productId: { in: productIds },
        },
      }),
      prisma.stoneMetadata.findMany({
        where: {
          shop,
          productId: { in: productIds },
        },
      }),
    ]);

    console.log("💎 RING BUILDER DATABASE:");
    console.log(`   - SettingMetadata records: ${settings.length}`);
    console.log(`   - StoneMetadata records: ${stones.length}`);
    console.log("=================================================");

    // Create metadata maps
    const settingsMap = new Map(settings.map((s) => [s.productId, s]));
    const stonesMap = new Map(stones.map((s) => [s.productId, s]));

    // Merge metadata with products
    const productsWithMetadata = products.map((product: any) => ({
      ...product,
      builderType: settingsMap.has(product.id)
        ? "setting"
        : stonesMap.has(product.id)
          ? "stone"
          : null,
      metadata:
        settingsMap.get(product.id) || stonesMap.get(product.id) || null,
    }));

    return {
      products: productsWithMetadata,
      pageInfo: {
        hasNextPage: productsData.pageInfo.hasNextPage,
        endCursor: productsData.pageInfo.endCursor,
      },
    };
  } catch (error) {
    console.error("❌ RING BUILDER ERROR in products loader:", error);
    console.error("=================================================");
    return {
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default function ProductsPage() {
  const { products, pageInfo } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "setting" | "stone" | "unmarked"
  >("all");

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    // Search filter
    if (
      searchQuery &&
      !product.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (filterType === "setting" && product.builderType !== "setting")
      return false;
    if (filterType === "stone" && product.builderType !== "stone") return false;
    if (filterType === "unmarked" && product.builderType) return false;

    return true;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Mark products as ring settings or stones and add metadata</p>
        </div>
        <div className="header-actions">
          <a
            href="/api/admin/export?type=stones"
            download
            className="button secondary"
          >
            📥 Export Stones
          </a>
          <button
            className="button primary"
            onClick={() => {
              document
                .getElementById("csv-import-modal")
                ?.classList.add("show");
            }}
          >
            📤 Import CSV
          </button>
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">All Products</option>
          <option value="setting">Settings Only</option>
          <option value="stone">Stones Only</option>
          <option value="unmarked">Unmarked Only</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        ) : (
          filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {pageInfo.hasNextPage && (
        <div className="pagination">
          <Link
            to={`?cursor=${pageInfo.endCursor}`}
            className="button secondary"
          >
            Load More
          </Link>
        </div>
      )}

      <CSVImportModal />

      <style>{`
        .products-page {
          max-width: 1400px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 20px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #202223;
        }

        .page-header p {
          font-size: 14px;
          color: #6d7175;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-select {
          min-width: 180px;
          padding: 10px 12px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #6d7175;
        }

        .pagination {
          text-align: center;
        }

        .button {
          display: inline-block;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .button.primary {
          background: #2c6ecb;
          color: white;
        }

        .button.primary:hover {
          background: #1f5199;
        }

        .button.secondary {
          background: white;
          color: #202223;
          border: 1px solid #c9cccf;
        }

        .button.secondary:hover {
          background: #f6f6f7;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .filters {
            flex-direction: column;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const fetcher = useFetcher();
  const isMarking = fetcher.state !== "idle";

  const handleMark = (type: "setting" | "stone") => {
    const formData = new FormData();
    formData.append("type", type);

    fetcher.submit(formData, {
      method: "post",
      action: `/api/admin/products/${encodeURIComponent(product.id)}/mark`,
    });
  };

  const image = product.images[0]?.url;
  const variant = product.variants[0];

  return (
    <div className="product-card">
      <div className="product-image">
        {image ? (
          <img src={image} alt={product.title} />
        ) : (
          <div className="no-image">📦</div>
        )}
        {product.builderType && (
          <span className={`badge ${product.builderType}`}>
            {product.builderType === "setting" ? "⚙️ Setting" : "💎 Stone"}
          </span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.title}</h3>
        {variant && <p className="price">${variant.price}</p>}
        {variant?.sku && <p className="sku">SKU: {variant.sku}</p>}
        <p className="product-id" title="Click to copy">
          ID: {product.id.replace("gid://shopify/Product/", "")}
          <button
            className="copy-id-btn"
            onClick={() => {
              navigator.clipboard.writeText(product.id);
              alert("Product ID copied to clipboard!");
            }}
            title="Copy full GID"
          >
            📋
          </button>
        </p>
      </div>

      <div className="product-actions">
        {!product.builderType ? (
          <>
            <button
              onClick={() => handleMark("setting")}
              disabled={isMarking}
              className="action-button"
            >
              Mark as Setting
            </button>
            <button
              onClick={() => handleMark("stone")}
              disabled={isMarking}
              className="action-button"
            >
              Mark as Stone
            </button>
          </>
        ) : (
          <Link
            to={`/app/builder/products/${encodeURIComponent(product.id)}`}
            className="action-button primary"
          >
            Edit Metadata
          </Link>
        )}
      </div>

      <style>{`
        .product-card {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f6f6f7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          font-size: 48px;
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .badge.setting {
          color: #2c6ecb;
        }

        .badge.stone {
          color: #d4af37;
        }

        .product-info {
          padding: 16px;
        }

        .product-info h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #202223;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .price {
          font-size: 18px;
          font-weight: 600;
          color: #202223;
          margin: 0 0 4px;
        }

        .sku {
          font-size: 12px;
          color: #6d7175;
          margin: 0;
        }

        .product-actions {
          padding: 0 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-button {
          width: 100%;
          padding: 10px;
          border: 1px solid #c9cccf;
          border-radius: 6px;
          background: white;
          color: #202223;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .action-button:hover:not(:disabled) {
          background: #f6f6f7;
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-button.primary {
          background: #2c6ecb;
          color: white;
          border-color: #2c6ecb;
        }

        .action-button.primary:hover {
          background: #1f5199;
        }

        .product-id {
          font-size: 12px;
          color: #6d7175;
          margin: 4px 0 0;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .copy-id-btn {
          background: none;
          border: 1px solid #c9cccf;
          border-radius: 4px;
          padding: 2px 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .copy-id-btn:hover {
          background: #f6f6f7;
          border-color: #2c6ecb;
        }
      `}</style>
    </div>
  );
}

function CSVImportModal() {
  const [file, setFile] = useState<File | null>(null);
  const fetcher = useFetcher();
  const isImporting = fetcher.state !== "idle";

  const handleImport = async () => {
    if (!file) return;

    const text = await file.text();
    const formData = new FormData();
    formData.append("csv", text);

    fetcher.submit(formData, {
      method: "post",
      action: "/api/admin/import",
    });
  };

  const close = () => {
    document.getElementById("csv-import-modal")?.classList.remove("show");
    setFile(null);
  };

  return (
    <div id="csv-import-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Import Stones from CSV</h2>
          <button onClick={close} className="close-button">
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>
            Upload a CSV file with stone data. Required columns: productId,
            stoneType, shape, carat, price
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input"
          />

          {fetcher.data && (
            <div className="import-results">
              <p>✅ Imported: {fetcher.data.imported}</p>
              {fetcher.data.failed > 0 && (
                <p>❌ Failed: {fetcher.data.failed}</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={close} className="button secondary">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="button primary"
          >
            {isImporting ? "Importing..." : "Import"}
          </button>
        </div>
      </div>

      <style>{`
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .modal.show {
          display: flex;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow: auto;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e1e3e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          color: #6d7175;
          line-height: 1;
        }

        .modal-body {
          padding: 20px;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          margin: 16px 0;
        }

        .import-results {
          margin-top: 16px;
          padding: 16px;
          background: #f6f6f7;
          border-radius: 6px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e1e3e5;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
