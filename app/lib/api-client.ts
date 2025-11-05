/**
 * API Client Abstraction
 *
 * Centralized API client for all frontend API calls.
 * Provides type-safe methods and consistent error handling.
 */

import { parseApiResponse } from "./api-response";
import { logger } from "~/utils/logger";

interface CartItem {
  id: string;
  configuration_id: string;
  title: string;
  price: number;
  quantity: number;
  properties: Record<string, string>;
  line_price: number;
  is_from_database: boolean;
  created_at: string;
}

interface CartData {
  items: CartItem[];
  item_count: number;
  total_price: number;
  currency: string;
}

interface CartAddData {
  shop: string;
  settingId: string;
  stoneId: string;
  metalType: string;
  ringSize: string;
  totalPrice: string;
  sideStonesConfig?: string;
  customerEmail?: string;
  customerId?: string;
}

interface CartAddResponse {
  success: boolean;
  configurationId: string;
  isScrapedProduct: boolean;
  cartData: {
    id: string;
    quantity: number;
    properties: Record<string, string>;
  };
  redirectUrl: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: { message: "Request failed" }
      }));

      throw new ApiError(
        error.error?.message || error.message || "Request failed",
        response.status,
        error.error?.code || error.code
      );
    }

    return parseApiResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      undefined,
      "NETWORK_ERROR"
    );
  }
}

export const apiClient = {
  cart: {
    async get(shop: string, customerId?: string): Promise<CartData> {
      const params = new URLSearchParams({ shop });
      if (customerId) {
        params.append("customerId", customerId);
      }

      return fetcher<CartData>(`/api/builder/cart/get?${params}`);
    },

    async add(data: CartAddData): Promise<CartAddResponse> {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch("/api/builder/cart", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Failed to add to cart"
        }));
        throw new ApiError(
          error.error || "Failed to add to cart",
          response.status
        );
      }

      return response.json();
    },

    async remove(id: string, shop: string): Promise<{ success: boolean }> {
      return fetcher(`/api/builder/cart/remove`, {
        method: "POST",
        body: JSON.stringify({ id, shop }),
      });
    },
  },

  builder: {
    async getSettings(shop: string) {
      return fetcher(`/api/builder/settings?shop=${shop}`);
    },

    async getStones(shop: string) {
      return fetcher(`/api/builder/stones?shop=${shop}`);
    },

    async saveConfiguration(data: unknown) {
      return fetcher(`/api/builder/save`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async shareConfiguration(configurationId: string, shop: string) {
      return fetcher(`/api/builder/share`, {
        method: "POST",
        body: JSON.stringify({ configurationId, shop }),
      });
    },
  },

  analytics: {
    async track(eventType: string, data: unknown) {
      return fetcher(`/api/builder/analytics/track`, {
        method: "POST",
        body: JSON.stringify({ eventType, data }),
      }).catch((error) => {
        logger.warn("Analytics tracking failed", { error: error instanceof Error ? error.message : String(error) });
      });
    },
  },
};

export { ApiError };
export type { CartData, CartItem, CartAddData, CartAddResponse };
