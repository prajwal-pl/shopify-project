import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="size-4 text-primary" />
            <span className="text-muted-foreground">
              Craft Your Perfect Ring
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Design Your Dream Ring in{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Three Simple Steps
            </span>
          </h1>
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Create a unique, personalized ring with our intuitive builder.
            Choose your setting, select the perfect diamond, and bring your
            vision to life.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/builder">
              <Button size="lg" className="group">
                Start Building
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
}
