/**
 * Add to Cart Button Component
 *
 * Handles adding configured ring to Shopify cart.
 */

import React, { useState } from "react";
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

      // Check if we're in admin preview mode (no /cart/add.js available)
      const isAdminPreview = window.location.pathname.includes(
        "/app/builder/preview",
      );

      if (isAdminPreview) {
        // In admin preview - just show success message
        console.log(
          "✅ Configuration saved! (Admin preview mode - no actual cart)",
        );
        console.log("Configuration ID:", result.configurationId);
        console.log("Check Prisma Studio to see the saved configuration!");

        alert(
          `✅ Success! Configuration saved!\n\n` +
            `Configuration ID: ${result.configurationId}\n\n` +
            `In a real storefront, this would add to cart.\n` +
            `Check Prisma Studio to see the saved data!\n\n` +
            `(This is preview mode - cart API not available)`,
        );

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
            // This is the admin preview - cart API not available
            console.log("⚠️ Cart API returned HTML (preview mode detected)");
            alert(
              `✅ Configuration Saved!\n\n` +
                `Configuration ID: ${result.configurationId}\n\n` +
                `The configuration was saved to the database successfully!\n\n` +
                `Note: You're in preview mode. On the real storefront, this would add to the Shopify cart.\n\n` +
                `Check Prisma Studio to see the saved configuration!`,
            );
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
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to cart
          window.location.href = result.redirectUrl || "/cart";
        }
      } catch (cartError: any) {
        console.error("Cart API error:", cartError);

        // If it's a JSON parse error, we're likely in preview mode
        if (cartError.message?.includes("Unexpected token")) {
          alert(
            `✅ Configuration Saved!\n\n` +
              `Configuration ID: ${result.configurationId}\n\n` +
              `Your ring configuration was successfully saved to the database!\n\n` +
              `Note: Cart integration requires a real Shopify storefront. Check Prisma Studio to see your saved data.`,
          );
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
      >
        {isAdding ? "Adding to Cart..." : "Add to Cart"}
      </button>

      {error && <div className="error-message">{error}</div>}

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
      `}</style>
    </>
  );
}
