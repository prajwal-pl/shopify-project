import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Choose Your Setting",
    description:
      "Start by selecting your preferred ring style, metal type, and size. Browse our curated collection of elegant settings.",
  },
  {
    number: "02",
    title: "Select Your Diamond",
    description:
      "Filter through certified diamonds by shape, carat, cut, color, and clarity. Compare specifications and find your perfect match.",
  },
  {
    number: "03",
    title: "Review & Purchase",
    description:
      "Preview your custom ring, review all details, and complete your purchase securely. Your dream ring is just a click away.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to your perfect ring
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border md:block" />
              )}
              <Card className="relative bg-background">
                <CardHeader>
                  <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {step.number}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
