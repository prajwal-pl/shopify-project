/**
 * Cart Button Component
 *
 * Displays cart icon with item count badge.
 */

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useBuilder } from "./BuilderProvider";
import { Icon } from "~/components/ui/Icon";

export function CartButton() {
  const { cartItemCount, openCart } = useBuilder();

  return (
    <>
      <button className="cart-button" onClick={openCart} aria-label="Open shopping cart">
        <Icon icon={ShoppingCart} size="sm" className="cart-icon" />
        {cartItemCount > 0 && (
          <span className="cart-badge" aria-label={`${cartItemCount} items in cart`}>
            {cartItemCount}
          </span>
        )}
        <span className="cart-text">Cart</span>
      </button>

      <style>{`
        .cart-button {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #d4af37;
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cart-button:hover {
          background: #d4af37;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .cart-button:active {
          transform: translateY(-1px);
        }

        .cart-icon {
          transition: transform 0.2s ease;
        }

        .cart-button:hover .cart-icon {
          transform: scale(1.1);
        }

        .cart-text {
          font-family: inherit;
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #e74c3c;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: pop 0.3s ease-out;
        }

        @keyframes pop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .cart-button {
            padding: 8px 12px;
          }

          .cart-text {
            display: none;
          }

          .cart-badge {
            top: -4px;
            right: -4px;
          }
        }
      `}</style>
    </>
  );
}
