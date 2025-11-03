/**
 * PUBLIC STOREFRONT ROUTE - Shopping Cart
 *
 * Displays configured rings in cart with ability to:
 * - Review selections
 * - Update quantities
 * - Remove items
 * - Proceed to checkout
 */

import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { currencyFormatter } from "~/components/builder/utils";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    throw new Response("Shop parameter required", { status: 400 });
  }

  const cartResponse = await fetch(
    `${url.origin}/api/builder/cart/get?shop=${shop}`,
    {
      headers: request.headers,
    }
  );

  const cartData: CartData = await cartResponse.json();

  return { shop, cartData };
}

export default function BuilderCartPage() {
  const { shop, cartData } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId));

    try {
      await fetch("/api/builder/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, shop }),
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to remove item:", error);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleContinueShopping = () => {
    navigate(`/builder?shop=${shop}`);
  };

  const handleCheckout = () => {
    navigate(`/builder/checkout?shop=${shop}`);
  };

  const isEmpty = cartData.items.length === 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-stone-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleContinueShopping}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="size-4" />
            Continue Shopping
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                Shopping Cart
              </h1>
              <p className="text-stone-600">
                {cartData.item_count} {cartData.item_count === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </header>

        {isEmpty ? (
          <Card className="border-2 border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-stone-100">
                <Package className="size-10 text-stone-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-stone-900">Your cart is empty</h2>
              <p className="mb-6 text-stone-600">
                Start building your perfect ring to add items to your cart.
              </p>
              <Button onClick={handleContinueShopping} size="lg" className="gap-2">
                Start Building
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartData.items.map((item) => (
                <Card
                  key={item.id}
                  className="border-2 border-stone-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-bold text-stone-900">
                          {item.title}
                        </h3>

                        <div className="mb-4 grid gap-2 sm:grid-cols-2">
                          {Object.entries(item.properties).map(([key, value]) => (
                            value && (
                              <div key={key} className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-stone-600">{key}:</span>
                                <Badge variant="outline" className="border-stone-200 bg-stone-50 text-stone-700">
                                  {value}
                                </Badge>
                              </div>
                            )
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-stone-900">
                            {currencyFormatter.format(item.price / 100)}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removingItems.has(item.id)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                            {removingItems.has(item.id) ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="sticky top-8 h-fit border-2 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-stone-900">
                  Order Summary
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Review your selections before checkout
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    {currencyFormatter.format(cartData.total_price / 100)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-semibold text-stone-900">FREE</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">Tax</span>
                  <span className="text-stone-600 text-xs">Calculated at checkout</span>
                </div>

                <Separator className="bg-stone-300" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {currencyFormatter.format(cartData.total_price / 100)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t-2 border-stone-300 bg-gradient-to-br from-stone-50 to-white pt-6">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="size-4" />
                </Button>

                <p className="text-center text-xs text-stone-600">
                  Secure checkout powered by Stripe
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
