import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Gem, Palette, ShoppingBag, Sparkles, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Customize Every Detail",
    description:
      "Choose from a variety of ring settings, metals, and styles to create a truly unique piece that reflects your personal taste.",
  },
  {
    icon: Gem,
    title: "Premium Diamond Selection",
    description:
      "Browse certified diamonds with detailed specifications including cut, clarity, color, and carat weight. Find the perfect stone for your budget.",
  },
  {
    icon: Sparkles,
    title: "Real-Time Preview",
    description:
      "See your ring come to life with instant visual previews as you make selections. Know exactly what you're getting before you buy.",
  },
  {
    icon: Shield,
    title: "Certified Quality",
    description:
      "All diamonds come with certificates from recognized gemological institutes, ensuring authenticity and quality standards.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Our streamlined process gets you from idea to cart in minutes. No complex forms or confusing options—just simple, intuitive design.",
  },
  {
    icon: ShoppingBag,
    title: "Seamless Checkout",
    description:
      "Complete your purchase with confidence using our secure checkout process integrated directly with your Shopify store.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to create the perfect ring
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features that make ring customization simple and enjoyable
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
