/**
 * Cart View Component
 *
 * Displays cart items with ring configurations.
 */

import React, { useState, useEffect, useCallback } from "react";
import { X, Trash2, ShoppingBag, Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { useBuilder } from "./BuilderProvider";
import { Icon } from "~/components/ui/Icon";

interface CartItem {
  id: string | number;
  configuration_id?: string;
  variant_id: number;
  product_id: string | number;
  title: string;
  price: number;
  quantity: number;
  properties?: Record<string, string>;
  image?: string;
  vendor?: string;
  is_from_database?: boolean;
  created_at?: string;
}

interface CartData {
  items: CartItem[];
  item_count: number;
  total_price: number;
  currency: string;
  isAdminContext?: boolean;
  message?: string;
  error?: string;
}

interface CartViewProps {
  shop: string;
  onClose: () => void;
}

export function CartView({ shop, onClose }: CartViewProps) {
  const [cart, setCart] = useState<CartData>({
    items: [],
    item_count: 0,
    total_price: 0,
    currency: "USD",
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useBuilder();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/builder/cart/get?shop=${shop}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      showToast({
        message: "Failed to load cart",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [shop, showToast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = useCallback(async (item: CartItem) => {
    try {
      // If item is from database, delete the configuration
      if (item.is_from_database && item.id) {
        const formData = new FormData();
        formData.append("configurationId", item.id.toString());
        formData.append("shop", shop);

        const response = await fetch("/api/builder/cart/remove", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to remove item");
        }
      } else {
        // For Shopify cart items, use cart API
        const response = await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            quantity: 0,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove item");
        }
      }

      showToast({
        message: "Item removed from cart",
        type: "success",
      });

      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      showToast({
        message: "Failed to remove item from cart",
        type: "error",
      });
    }
  }, [shop, showToast, fetchCart]);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const renderCartItem = (item: CartItem, index: number) => {
    const configId = item.properties?.["Configuration ID"];
    const metalType = item.properties?.["Metal Type"];
    const ringSize = item.properties?.["Ring Size"];
    const stoneCarat = item.properties?.["Stone Carat"];
    const stoneShape = item.properties?.["Stone Shape"];
    const stoneColor = item.properties?.["Stone Color"];
    const stoneClarity = item.properties?.["Stone Clarity"];

    return (
      <div key={item.id} className="cart-item">
        <div className="cart-item-image">
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <div className="cart-item-placeholder">
            <Icon icon={ShoppingBag} size="xl" style={{ opacity: 0.3 }} />
          </div>
          )}
        </div>

        <div className="cart-item-details">
          <h3 className="cart-item-title">{item.title}</h3>

          {configId && (
            <p className="cart-item-config-id">
              <span className="label">Config ID:</span> {configId}
            </p>
          )}

          <div className="cart-item-specs">
            {metalType && (
              <div className="spec">
                <span className="spec-label">Metal:</span>
                <span className="spec-value">{metalType}</span>
              </div>
            )}
            {ringSize && (
              <div className="spec">
                <span className="spec-label">Size:</span>
                <span className="spec-value">{ringSize}</span>
              </div>
            )}
          </div>

          {stoneCarat && (
            <div className="cart-item-stone">
              <span className="stone-label">Center Stone:</span>
              <span className="stone-details">
                {stoneCarat}ct {stoneShape} {stoneColor} {stoneClarity}
              </span>
            </div>
          )}

          <div className="cart-item-footer">
            <div className="cart-item-price">{formatPrice(item.price)}</div>
            <div className="cart-item-quantity">Qty: {item.quantity}</div>
            <button
              className="cart-item-remove"
              onClick={() => handleRemoveItem(item)}
              aria-label="Remove item from cart"
            >
              <Icon icon={Trash2} size="xs" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            <Icon icon={X} size="md" />
          </button>
        </div>

        <div className="cart-content">
          {loading ? (
            <div className="cart-loading">
              <Icon icon={Loader2} size="xl" className="spinner" />
              <p>Loading cart...</p>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <p className="cart-empty-subtitle">
                Configure a ring to add it to your cart
              </p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item, index) => renderCartItem(item, index))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal ({cart.item_count} items):</span>
                  <span className="cart-summary-total">
                    {formatPrice(cart.total_price)}
                  </span>
                </div>
                <button
                  className="cart-checkout-button"
                  onClick={() => {
                    window.location.href = "/checkout";
                  }}
                >
                  <Icon icon={CreditCard} size="sm" />
                  <span>Proceed to Checkout</span>
                </button>
                <button
                  className="cart-continue-button"
                  onClick={onClose}
                >
                  <Icon icon={ArrowLeft} size="sm" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </>
          )}
        </div>

        <style>{`
          .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: flex-end;
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .cart-panel {
            width: 100%;
            max-width: 500px;
            background: white;
            height: 100vh;
            overflow-y: auto;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
            display: flex;
            flex-direction: column;
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }

          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #e5e5e5;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
          }

          .cart-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
          }

          .cart-close {
            background: none;
            border: none;
            font-size: 32px;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
          }

          .cart-close:hover {
            color: #1a1a1a;
          }

          .cart-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .cart-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: #666;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .cart-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: #666;
          }

          .cart-empty p {
            margin: 0 0 8px;
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .cart-empty-subtitle {
            font-size: 14px !important;
            color: #999 !important;
            font-weight: 400 !important;
          }

          .cart-message {
            font-size: 16px !important;
            margin-bottom: 12px !important;
          }

          .cart-info {
            font-size: 14px !important;
            color: #666 !important;
          }

          .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }

          .cart-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 8px;
            margin-bottom: 16px;
          }

          .cart-item-image {
            flex-shrink: 0;
            width: 100px;
            height: 100px;
            border-radius: 6px;
            overflow: hidden;
            background: white;
            border: 1px solid #e5e5e5;
          }

          .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .cart-item-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
          }

          .cart-item-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .cart-item-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .cart-item-config-id {
            margin: 0;
            font-size: 12px;
            color: #666;
            font-family: monospace;
          }

          .cart-item-config-id .label {
            font-weight: 600;
          }

          .cart-item-specs {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }

          .spec {
            display: flex;
            gap: 4px;
            font-size: 13px;
          }

          .spec-label {
            color: #666;
          }

          .spec-value {
            color: #1a1a1a;
            font-weight: 500;
          }

          .cart-item-stone {
            font-size: 13px;
            padding: 6px 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
          }

          .stone-label {
            color: #666;
            margin-right: 6px;
          }

          .stone-details {
            color: #1a1a1a;
            font-weight: 500;
          }

          .cart-item-footer {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: auto;
            padding-top: 8px;
            border-top: 1px solid #e5e5e5;
          }

          .cart-item-price {
            font-size: 18px;
            font-weight: 700;
            color: #d4af37;
          }

          .cart-item-quantity {
            font-size: 13px;
            color: #666;
            margin-left: auto;
          }

          .cart-item-remove {
            background: none;
            border: none;
            color: #e74c3c;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            padding: 4px 8px;
            transition: opacity 0.2s;
          }

          .cart-item-remove:hover {
            opacity: 0.7;
            text-decoration: underline;
          }

          .cart-summary {
            padding: 20px 24px;
            border-top: 2px solid #e5e5e5;
            background: white;
            position: sticky;
            bottom: 0;
          }

          .cart-summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            font-size: 16px;
          }

          .cart-summary-total {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
          }

          .cart-checkout-button {
            width: 100%;
            padding: 16px;
            background: #d4af37;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }

          .cart-checkout-button:hover {
            background: #c29d2f;
          }

          .cart-continue-button {
            width: 100%;
            padding: 12px;
            background: transparent;
            color: #666;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cart-continue-button:hover {
            background: #f9f9f9;
            border-color: #d4af37;
            color: #1a1a1a;
          }

          @media (max-width: 768px) {
            .cart-panel {
              max-width: 100%;
            }

            .cart-item {
              flex-direction: column;
            }

            .cart-item-image {
              width: 100%;
              height: 200px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
