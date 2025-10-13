import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Initialize default Ring Builder settings if they don't exist
  const existingSettings = await prisma.appSettings.findUnique({
    where: { shop },
  });

  if (!existingSettings) {
    await prisma.appSettings.create({
      data: {
        shop,
        builderEnabled: true,
        markupPercent: 0,
        notifyOnConfig: false,
        sideStones: JSON.stringify({
          enabled: false,
          qualities: [],
          pricing: {},
          minQuantity: 0,
          maxQuantity: 50,
        }),
      },
    });
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading="Ring Builder - Admin Dashboard">
      <s-section heading="Welcome to Ring Builder! 💍">
        <s-paragraph>
          Your custom ring builder app is ready to use. Get started by managing
          your products and configuring your builder settings.
        </s-paragraph>
      </s-section>

      <s-section heading="Quick Actions">
        <s-stack direction="block" gap="large">
          <s-box
            padding="large"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="base">
              <s-heading>1. Manage Products</s-heading>
              <s-paragraph>
                Mark your Shopify products as ring settings or stones, then add
                detailed metadata for the builder.
              </s-paragraph>
              <s-button href="/app/builder/products" variant="primary">
                Go to Products →
              </s-button>
            </s-stack>
          </s-box>

          <s-box
            padding="large"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="base">
              <s-heading>2. Configure Builder Settings</s-heading>
              <s-paragraph>
                Set up your markup percentage, enable side stones, and customize
                your builder preferences.
              </s-paragraph>
              <s-button href="/app/builder/settings" variant="primary">
                Go to Settings →
              </s-button>
            </s-stack>
          </s-box>

          <s-box
            padding="large"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="base">
              <s-heading>3. Import Stones (CSV)</s-heading>
              <s-paragraph>
                Bulk import your diamond inventory using CSV for faster setup.
              </s-paragraph>
              <s-button href="/app/builder/products" variant="secondary">
                Import CSV →
              </s-button>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Getting Started">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            <strong>Step 1:</strong> Mark products as Settings or Stones
          </s-paragraph>
          <s-paragraph>
            <strong>Step 2:</strong> Add metadata (prices, specs, etc.)
          </s-paragraph>
          <s-paragraph>
            <strong>Step 3:</strong> Configure builder settings
          </s-paragraph>
          <s-paragraph>
            <strong>Step 4:</strong> Add to your storefront theme
          </s-paragraph>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Documentation">
        <s-unordered-list>
          <s-list-item>
            <s-text>Setup Guide: docs/MERCHANT_SETUP.md</s-text>
          </s-list-item>
          <s-list-item>
            <s-text>API Testing: docs/API_TESTING.md</s-text>
          </s-list-item>
          <s-list-item>
            <s-text>Testing Guide: TESTING_GUIDE_START_HERE.md</s-text>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
