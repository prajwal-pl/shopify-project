import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  showShopLogin: boolean;
}

export function CTA({ showShopLogin }: CTAProps) {
  return (
    <section className="bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {showShopLogin
                  ? "Ready to Add the Ring Builder?"
                  : "Start Creating Your Perfect Ring"}
              </CardTitle>
              <CardDescription className="text-base">
                {showShopLogin
                  ? "Enter your Shopify store domain to install the app and start offering custom rings to your customers."
                  : "Begin your journey to the perfect custom ring today."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showShopLogin ? (
                <Form method="post" action="/auth/login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shop" className="text-base">
                      Shop Domain
                    </Label>
                    <Input
                      id="shop"
                      type="text"
                      name="shop"
                      placeholder="my-shop-domain.myshopify.com"
                      required
                      className="h-12 text-base"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your Shopify store domain
                    </p>
                  </div>
                  <Button type="submit" size="lg" className="w-full group">
                    Install Ring Builder App
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Form>
              ) : (
                <div className="flex justify-center">
                  <a href="/builder">
                    <Button size="lg" className="group">
                      Start Building Now
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
