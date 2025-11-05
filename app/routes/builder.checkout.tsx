import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { ShoppingBag, CreditCard, User, MapPin, Mail, Phone, ArrowLeft, Lock } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { currencyFormatter } from "~/components/builder/utils";
import { logger } from "~/utils/logger";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required").max(200, "Address is too long"),
  city: z.string().min(2, "City is required").max(100, "City name is too long"),
  state: z.string().min(2, "State is required").max(50, "State name is too long"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits").max(10, "ZIP code is too long"),
  country: z.string().min(2, "Country is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

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

  if (cartData.items.length === 0) {
    throw new Response("Cart is empty", { status: 400 });
  }

  return { shop, cartData };
}

export default function BuilderCheckoutPage() {
  const { shop, cartData } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBackToCart = () => {
    navigate(`/builder/cart?shop=${shop}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = checkoutSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path[0] as keyof CheckoutFormData;
        if (field) {
          fieldErrors[field] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);

    try {
      alert("Checkout functionality coming soon! This will integrate with Stripe for payment processing.");

    } catch (error) {
      logger.error("Checkout error", { error: error instanceof Error ? error.message : String(error), shop });
      alert("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartData.total_price;
  const shipping = 0;
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-stone-50/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-12">
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToCart}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Cart
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                Checkout
              </h1>
              <p className="text-stone-600">
                Complete your order securely
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <Card className="border-2 border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-stone-900">
                    <User className="size-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-stone-600">
                    We'll use this to send order updates and shipping notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-stone-700">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`border-stone-200 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-stone-700">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`border-stone-200 ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-stone-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`border-stone-200 pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-stone-700">
                      Phone number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`border-stone-200 pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-stone-900">
                    <MapPin className="size-5 text-primary" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription className="text-stone-600">
                    Where should we deliver your ring?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-stone-700">
                      Street address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`border-stone-200 ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-stone-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`border-stone-200 ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-stone-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`border-stone-200 ${errors.state ? 'border-red-500' : ''}`}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm font-medium text-stone-700">
                        ZIP code
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`border-stone-200 ${errors.zipCode ? 'border-red-500' : ''}`}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-600">{errors.zipCode}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-stone-700">
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="border-stone-200"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-stone-900">
                    <CreditCard className="size-5 text-primary" />
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-stone-600">
                    Secure payment processing powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                    <Lock className="mx-auto mb-3 size-8 text-stone-400" />
                    <p className="text-sm font-medium text-stone-600">
                      Payment integration coming soon
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Stripe checkout will be integrated here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="sticky top-8 h-fit border-2 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-stone-900">
                  Order Summary
                </CardTitle>
                <CardDescription className="text-stone-600">
                  {cartData.item_count} {cartData.item_count === 1 ? "item" : "items"} in your order
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {cartData.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <h4 className="mb-2 font-bold text-stone-900">{item.title}</h4>
                    <div className="mb-3 grid gap-1.5 text-sm">
                      {Object.entries(item.properties).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-stone-600">{key}:</span>
                            <Badge variant="outline" className="border-stone-200 bg-stone-50 text-xs text-stone-700">
                              {value}
                            </Badge>
                          </div>
                        )
                      ))}
                    </div>
                    <div className="text-right font-bold text-stone-900">
                      {currencyFormatter.format(item.price / 100)}
                    </div>
                  </div>
                ))}

                <Separator className="bg-stone-300" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold text-stone-900">
                      {currencyFormatter.format(subtotal / 100)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-semibold text-stone-900">FREE</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Estimated tax</span>
                    <span className="font-semibold text-stone-900">
                      {currencyFormatter.format(tax / 100)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-stone-300" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {currencyFormatter.format(total / 100)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t-2 border-stone-300 bg-gradient-to-br from-stone-50 to-white pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  disabled={isProcessing}
                >
                  <Lock className="size-4" />
                  {isProcessing ? "Processing..." : "Complete Order"}
                </Button>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <Lock className="size-3 text-stone-400" />
                  <span>Secure checkout • 256-bit SSL encryption</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
}
