/**
 * Ring Builder Products Page - Phase 2.0
 *
 * Enhanced admin UI for managing ring builder products.
 * Uses new ProductDashboard, AddDiamondModal, and AddSettingModal components.
 *
 * Features:
 * - Visual product cards with status indicators
 * - Icon-based diamond/setting forms
 * - Metafields integration
 * - CSV import in Advanced Tools section
 */

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { useState } from "react";
import {
  ProductDashboard,
  type ProductDashboardProduct,
} from "~/components/admin/ProductDashboard";
import {
  AddDiamondModal,
  type DiamondFormData,
} from "~/components/admin/AddDiamondModal";
import {
  AddSettingModal,
  type SettingFormData,
} from "~/components/admin/AddSettingModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const cursor = url.searchParams.get("cursor");

  // Fetch products from Shopify
  const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              title
              status
              images(first: 1) {
                edges {
                  node {
                    url
                }
              }
            }
            variants(first: 1) {
                edges {
                  node {
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
    variables: { first: limit, after: cursor },
  });

  const data = await response.json();
  const productsData = data.data?.products;

  if (!productsData) {
    return {
      products: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }

  // Transform products
  const shopifyProducts = productsData.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    status: edge.node.status,
    image: edge.node.images.edges[0]?.node.url,
    sku: edge.node.variants.edges[0]?.node.sku || "",
    price: edge.node.variants.edges[0]?.node.price || "0",
  }));

  // Get product IDs
  const productIds = shopifyProducts.map((p: any) => p.id);

  // Fetch metadata from database
  const [settings, stones] = await Promise.all([
    prisma.settingMetadata.findMany({
      where: { shop, productId: { in: productIds } },
    }),
    prisma.stoneMetadata.findMany({
      where: { shop, productId: { in: productIds } },
    }),
  ]);

  // Create metadata maps
  const settingsMap = new Map(settings.map((s) => [s.productId, s]));
  const stonesMap = new Map(stones.map((s) => [s.productId, s]));

  // Build products with status
  const products: ProductDashboardProduct[] = shopifyProducts.map(
    (product: any) => {
      const settingMeta = settingsMap.get(product.id);
      const stoneMeta = stonesMap.get(product.id);

      let status: "active" | "incomplete" | "unmarked" = "unmarked";
      let type: "diamond" | "setting" | undefined;
      let metadata: any = {};

      if (settingMeta) {
        type = "setting";
        const compatibleShapes = JSON.parse(
          settingMeta.compatibleShapes || "[]",
        );
        const basePrices = JSON.parse(settingMeta.basePrices || "{}");

        // Check if complete (has style and at least one price)
        const hasPrices = Object.values(basePrices).some((p: any) => p > 0);
        status =
          settingMeta.style && compatibleShapes.length > 0 && hasPrices
            ? "active"
            : "incomplete";

        metadata = {
          style: settingMeta.style,
        };
      } else if (stoneMeta) {
        type = "diamond";
        // Check if complete (has required fields)
        status =
          stoneMeta.shape && stoneMeta.carat > 0 && stoneMeta.diamondType
            ? "active"
            : "incomplete";

        metadata = {
          shape: stoneMeta.shape,
          carat: stoneMeta.carat,
          diamondType: stoneMeta.diamondType,
        };
      }

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        sku: product.sku,
        image: product.image,
        status,
        type,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      };
    },
  );

  // Get total count (approximate)
  const totalCount =
    (await prisma.settingMetadata.count({ where: { shop } })) +
    (await prisma.stoneMetadata.count({ where: { shop } })) +
    shopifyProducts.length;

  return {
    products,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    pageInfo: productsData.pageInfo,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const action = formData.get("action") as string;
  const productId = formData.get("productId") as string;

  if (action === "add_diamond") {
    // Parse diamond data
    const diamondData: DiamondFormData = {
      stoneType: (formData.get("stoneType") as string) || "diamond",
      shape: formData.get("shape") as string,
      carat: parseFloat(formData.get("carat") as string),
      diamondType: (formData.get("diamondType") as any) || "mined",
      cut: (formData.get("cut") as string) || undefined,
      color: (formData.get("color") as string) || undefined,
      clarity: (formData.get("clarity") as string) || undefined,
      certificate: (formData.get("certificate") as string) || undefined,
      certificateNumber:
        (formData.get("certificateNumber") as string) || undefined,
      certificateUrl: (formData.get("certificateUrl") as string) || undefined,
      price: parseFloat(formData.get("price") as string),
    };

    // Save to database and metafields via existing API endpoint
    const saveResponse = await fetch(
      `/api/admin/products/${productId}/metadata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          type: "stone",
          ...(diamondData as any),
        }),
      },
    );

    const result = await saveResponse.json();
    return Response.json(result);
  }

  if (action === "add_setting") {
    // Parse setting data
    const settingData: SettingFormData = {
      style: formData.get("style") as any,
      compatibleShapes: JSON.parse(
        (formData.get("compatibleShapes") as string) || "[]",
      ),
      basePrices: JSON.parse((formData.get("basePrices") as string) || "{}"),
      settingHeight: (formData.get("settingHeight") as string) || undefined,
      featured: formData.get("featured") === "true",
    };

    // Save to database and metafields via existing API endpoint
    const saveResponse = await fetch(
      `/api/admin/products/${productId}/metadata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          type: "setting",
          style: settingData.style,
          compatibleShapes: JSON.stringify(settingData.compatibleShapes),
          basePrices: JSON.stringify(settingData.basePrices),
          settingHeight: settingData.settingHeight || "",
          featured: settingData.featured ? "true" : "false",
        }),
      },
    );

    const result = await saveResponse.json();
    return Response.json(result);
  }

  if (action === "remove") {
    const type = formData.get("type") as "diamond" | "setting";

    // Delete from database
    if (type === "diamond") {
      await prisma.stoneMetadata.deleteMany({
        where: { shop, productId },
      });
    } else if (type === "setting") {
      await prisma.settingMetadata.deleteMany({
        where: { shop, productId },
      });
    }

    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}

export default function ProductsPage() {
  const { products, totalCount, currentPage, totalPages } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalType, setModalType] = useState<"diamond" | "setting" | null>(
    null,
  );

  const handleAddDiamond = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalType("diamond");
    }
  };

  const handleAddSetting = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalType("setting");
    }
  };

  const handleSaveDiamond = async (data: DiamondFormData) => {
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("action", "add_diamond");
    formData.append("productId", selectedProduct.id);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    fetcher.submit(formData, { method: "POST" });
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleSaveSetting = async (data: SettingFormData) => {
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("action", "add_setting");
    formData.append("productId", selectedProduct.id);
    formData.append("style", data.style);
    formData.append("compatibleShapes", JSON.stringify(data.compatibleShapes));
    formData.append("basePrices", JSON.stringify(data.basePrices));
    if (data.settingHeight)
      formData.append("settingHeight", data.settingHeight);
    formData.append("featured", data.featured ? "true" : "false");

    fetcher.submit(formData, { method: "POST" });
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleEdit = (productId: string, type: "diamond" | "setting") => {
    // For now, open the same modal (future: pre-fill with existing data)
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalType(type);
    }
  };

  const handleRemove = async (
    productId: string,
    type: "diamond" | "setting",
  ) => {
    if (
      !confirm(
        "Are you sure you want to remove this product from the ring builder?",
      )
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("action", "remove");
    formData.append("productId", productId);
    formData.append("type", type);

    fetcher.submit(formData, { method: "POST" });
  };

  const handleSync = () => {
    // Trigger a page reload to fetch latest from Shopify
    window.location.reload();
  };

  return (
    <div className="products-page-v2">
      <ProductDashboard
        products={products}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          window.location.href = `/app/builder/products?page=${page}`;
        }}
        onSync={handleSync}
        onAddDiamond={handleAddDiamond}
        onAddSetting={handleAddSetting}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSearch={(query) => {
          // Implement search (refresh with query param)
          window.location.href = `/app/builder/products?search=${query}`;
        }}
        onFilterChange={(filter) => {
          // Implement filter (refresh with filter param)
          window.location.href = `/app/builder/products?filter=${filter}`;
        }}
        isLoading={fetcher.state === "submitting"}
      />

      {/* Add Diamond Modal */}
      {modalType === "diamond" && selectedProduct && (
        <AddDiamondModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => {
            setModalType(null);
            setSelectedProduct(null);
          }}
          onSave={handleSaveDiamond}
        />
      )}

      {/* Add Setting Modal */}
      {modalType === "setting" && selectedProduct && (
        <AddSettingModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => {
            setModalType(null);
            setSelectedProduct(null);
          }}
          onSave={handleSaveSetting}
        />
      )}

      <style>{`
        .products-page-v2 {
          background: #f7f7f7;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
