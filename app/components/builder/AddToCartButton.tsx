/**
 * Add to Cart Button Component
 *
 * Handles adding configured ring to Shopify cart.
 */

import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { useBuilder } from "./BuilderProvider";

interface AddToCartButtonProps {
  shop: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AddToCartButton({
  shop,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const {
    selectedSetting,
    selectedMetalType,
    selectedStone,
    ringSize,
    sideStones,
    priceBreakdown,
    trackEvent,
    showToast,
    refreshCartCount,
  } = useBuilder();

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!selectedSetting || !selectedMetalType || !selectedStone || !ringSize) {
      setError("Please complete all required selections");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      // Prepare configuration data
      const formData = new FormData();
      formData.append("shop", shop);
      formData.append("settingId", selectedSetting.productId);
      formData.append("stoneId", selectedStone.productId);
      formData.append("metalType", selectedMetalType);
      formData.append("ringSize", ringSize);
      formData.append("totalPrice", priceBreakdown.total.toString());

      if (sideStones) {
        formData.append("sideStones", JSON.stringify(sideStones));
      }

      // Add customer info if available (will implement in future)
      // formData.append("customerEmail", customerEmail);
      // formData.append("customerId", customerId);

      // Call cart API
      const response = await fetch("/api/builder/cart", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add to cart");
      }

      console.log("🛒 Cart API Response:", result);
      console.log("📦 Cart Data:", result.cartData);

      await trackEvent('add_to_cart', {
        configurationId: result.configurationId,
        settingId: selectedSetting.productId,
        stoneId: selectedStone.productId,
        metalType: selectedMetalType,
        ringSize,
        totalPrice: priceBreakdown.total,
        success: true,
      });

      // Check if we're in admin context (check hostname and pathname)
      const isAdminContext = window.location.hostname.includes("admin.shopify.com") ||
        window.location.pathname.includes("/app/builder") ||
        window.parent !== window;

      // Check if this is a scraped product (can't add to Shopify cart)
      const isScrapedProduct = result.isScrapedProduct;

      // In admin context OR scraped product - just save config, don't add to cart
      if (isAdminContext || isScrapedProduct) {
        console.log("✅ Configuration saved!");
        console.log("Configuration ID:", result.configurationId);
        console.log("Context:", { isAdminContext, isScrapedProduct });

        const message = isScrapedProduct
          ? `Configuration Saved! ID: ${result.configurationId}. This is a sample product - please contact us to purchase.`
          : `Configuration saved successfully! ID: ${result.configurationId}`;

        showToast({
          message,
          type: "success",
          duration: 6000,
        });

        if (onSuccess) {
          onSuccess();
        }
        return;
      }

      // On actual storefront - add to Shopify cart using Ajax Cart API
      try {
        const cartResponse = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [result.cartData],
          }),
        });

        if (!cartResponse.ok) {
          // Check if response is HTML (404 page) instead of JSON
          const contentType = cartResponse.headers.get("content-type");
          if (contentType?.includes("text/html")) {
            console.log("⚠️ Cart API returned HTML (preview mode detected)");
            showToast({
              message: `Configuration saved successfully! ID: ${result.configurationId}. You're in preview mode - on real storefront, this would add to cart.`,
              type: "info",
              duration: 6000,
            });
            if (onSuccess) {
              onSuccess();
            }
            return;
          }

          // Try to parse JSON error
          try {
            const cartError = await cartResponse.json();
            throw new Error(
              cartError.message || "Failed to add to Shopify cart",
            );
          } catch {
            throw new Error("Failed to add to cart");
          }
        }

        // Success!
        showToast({
          message: "Added to cart successfully!",
          type: "success",
          duration: 3000,
        });
        await refreshCartCount();
        if (onSuccess) {
          onSuccess();
        } else {
          setTimeout(() => {
            window.location.href = result.redirectUrl || "/cart";
          }, 1000);
        }
      } catch (cartError: any) {
        console.error("Cart API error:", cartError);

        // If it's a JSON parse error, we're likely in preview mode
        if (cartError.message?.includes("Unexpected token")) {
          showToast({
            message: `Configuration saved successfully! ID: ${result.configurationId}. Cart integration requires a real storefront.`,
            type: "info",
            duration: 6000,
          });
          if (onSuccess) {
            onSuccess();
          }
          return;
        }

        throw cartError;
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred. Please try again.";
      setError(errorMessage);

      await trackEvent('add_to_cart', {
        configurationId: null,
        settingId: selectedSetting?.productId,
        stoneId: selectedStone?.productId,
        metalType: selectedMetalType,
        ringSize,
        totalPrice: priceBreakdown.total,
        success: false,
        error: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !selectedSetting || !selectedStone || !ringSize}
        className="add-to-cart-button"
        aria-label={isAdding ? "Adding to cart" : "Add configured ring to cart"}
        aria-busy={isAdding}
      >
        {isAdding ? (
          <>
            <Icon icon={Loader2} size="sm" className="spinner" />
            Adding to Cart...
          </>
        ) : (
          <>
            <Icon icon={ShoppingCart} size="sm" />
            Add to Cart
          </>
        )}
      </button>

      {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}

      <style>{`
        .add-to-cart-button {
          width: 100%;
          padding: 18px 32px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .add-to-cart-button:hover:not(:disabled) {
          background: #c29d2f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .add-to-cart-button:disabled {
          background: #c9cccf;
          cursor: not-allowed;
          transform: none;
        }

        .add-to-cart-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .error-message {
          margin-top: 12px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #991b1b;
          font-size: 14px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .add-to-cart-button {
            padding: 16px 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
