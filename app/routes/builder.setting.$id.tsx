import { type ReactNode, useMemo, useState } from "react"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { Link, useLoaderData, useNavigate } from "react-router"
import { ArrowLeft, BadgeCheck } from "lucide-react"

import { RingSizeSelector } from "~/components/builder/RingSizeSelector"
import { SettingCard } from "~/components/builder/SettingCard"
import { currencyFormatter, formatToken } from "~/components/builder/utils"
import { Badge } from "~/components/ui/badge"
import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { loadBuilderCatalog } from "~/services/builder-data.server"
import type { Setting } from "~/types/builder"
import { METAL_TYPES, RING_SIZES, type MetalType, type RingSize } from "~/utils/constants"

const BAND_WIDTH_OPTIONS = ["1.6 mm", "1.8 mm", "2.0 mm"] as const
const SETTING_HEIGHT_OPTIONS = ["Low", "Signature", "High"] as const
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1400&q=80"

function isMetal(value: string | null): value is MetalType {
  return Boolean(value && METAL_TYPES.some((metal) => metal.value === value))
}

function isRingSize(value: string | null): value is RingSize {
  return Boolean(value && RING_SIZES.includes(value as RingSize))
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params
  console.log("🔍 Setting Detail Loader - ID:", id)

  if (!id) {
    throw new Response("Setting ID required", { status: 400 })
  }

  const url = new URL(request.url)
  const shop = url.searchParams.get("shop")
  console.log("🔍 Setting Detail Loader - Shop:", shop)

  if (!shop) {
    throw new Response("Shop parameter required", { status: 400 })
  }

  console.log("🔍 Loading catalog from JSON files")
  const catalog = await loadBuilderCatalog()

  const setting = catalog.settings.find((s) => s.id === id)
  console.log("🔍 Setting found:", setting ? "YES" : "NO")
  console.log("🔍 Available settings:", catalog.settings.map((s) => s.id).slice(0, 5))

  if (!setting) {
    console.error("❌ Setting not found for ID:", id)
    console.error("Available setting IDs:", catalog.settings.map((s) => s.id).join(", "))
    throw new Response("Setting not found", { status: 404 })
  }

  const related = catalog.settings
    .filter((candidate) => candidate.id !== setting.id)
    .slice(0, 3)

  const metalParam = url.searchParams.get("metal")
  const ringSizeParam = url.searchParams.get("ringSize")
  const from = url.searchParams.get("from") ?? undefined

  const initialMetal = isMetal(metalParam) ? metalParam : METAL_TYPES[0].value
  const initialRingSize = isRingSize(ringSizeParam) ? (ringSizeParam as RingSize) : RING_SIZES[6]

  return {
    shop,
    setting,
    related,
    initialMetal,
    initialRingSize,
    from,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Setting Not Found" },
      { name: "description", content: "We could not find details for this setting." },
    ]
  }

  const { setting } = data
  const title = `${setting.name} | GemFinder`
  const description =
    setting.description ?? `Explore the ${formatToken(setting.style)} ring setting crafted for daily brilliance.`
  const image = setting.images[0] ?? PLACEHOLDER_IMAGE

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ]
}

export default function BuilderSettingDetailRoute() {
  const navigate = useNavigate()
  const { shop, setting, related, initialMetal, initialRingSize, from } = useLoaderData<typeof loader>()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(initialMetal)
  const [bandWidth, setBandWidth] = useState<(typeof BAND_WIDTH_OPTIONS)[number]>(BAND_WIDTH_OPTIONS[1])
  const [settingHeight, setSettingHeight] = useState<(typeof SETTING_HEIGHT_OPTIONS)[number]>(SETTING_HEIGHT_OPTIONS[1])
  const [ringSize, setRingSizeState] = useState<RingSize>(initialRingSize)

  const galleryImages = setting.images.length > 0 ? setting.images : [PLACEHOLDER_IMAGE]
  const price = useMemo(() => {
    return setting.basePrices[selectedMetal] ?? setting.startingPrice
  }, [selectedMetal, setting.basePrices, setting.startingPrice])

  const selectedMetalLabel = useMemo(() => {
    return METAL_TYPES.find((metal) => metal.value === selectedMetal)?.label ?? ""
  }, [selectedMetal])

  const backToBuilderHref = useMemo(() => {
    const params = new URLSearchParams()
    params.set("shop", shop)
    params.set("metal", selectedMetal)
    params.set("ringSize", ringSize)
    params.set("step", "setting")
    params.set("settingId", setting.id)
    if (from) {
      params.set("from", from)
    }
    return `/builder?${params.toString()}`
  }, [from, ringSize, selectedMetal, setting.id, shop])

  const handleSelectSetting = () => {
    const params = new URLSearchParams()
    params.set("shop", shop)
    params.set("settingId", setting.id)
    params.set("metal", selectedMetal)
    params.set("ringSize", ringSize)
    params.set("step", "diamond")
    if (from) {
      params.set("from", from)
    }
    navigate(`/builder?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(240,236,255,0.45),transparent_55%)]">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-8 lg:px-12">
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "group inline-flex items-center gap-2 text-sm"
            )}
            onClick={() => navigate(backToBuilderHref)}
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to settings
          </button>
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Step 1 of 3</span>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,360px)]">
          <div className="flex flex-col gap-8">
            <div className="grid gap-6 lg:grid-cols-[110px_minmax(0,1fr)]">
              <div className="order-last flex gap-3 overflow-x-auto lg:order-first lg:flex-col lg:overflow-visible">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      "relative flex aspect-square size-24 min-w-[92px] items-center justify-center overflow-hidden rounded-2xl border transition",
                      activeImageIndex === index
                        ? "border-primary/60 shadow-lg"
                        : "border-border/60 bg-background/80 hover:border-primary/40"
                    )}
                  >
                    <img
                      src={image}
                      alt={setting.name}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              <div className="relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-background/90 shadow-2xl">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={setting.name}
                  className="size-full max-h-[520px] object-cover"
                />
              </div>
            </div>

            <Card className="border border-border/60 bg-background/70 shadow-lg">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Crafted for daily brilliance
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {setting.description ??
                    "Hand-set pavé accents and a softly tapered band deliver both comfort and sparkle. Each piece is made-to-order by master jewelers in ethically sourced metals."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                <DetailStat label="Style" value={formatToken(setting.style)} />
                <DetailStat label="Compatible shapes" value={`${setting.compatibleShapes.length} center stones`} />
                <DetailStat label="Setting height" value={formatToken(setting.settingHeight ?? settingHeight)} />
                <DetailStat label="Lead time" value="3-4 weeks crafted to order" />
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-background/70 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Included care</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Premium aftercare so your ring keeps its brilliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <IncludedItem>Complimentary insured shipping worldwide</IncludedItem>
                <IncludedItem>60-day resizing and lifetime cleaning</IncludedItem>
                <IncludedItem>Handwritten appraisal and valuation certificate</IncludedItem>
                <IncludedItem>Dedicated stylist consultations on demand</IncludedItem>
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col gap-8">
            <section className="space-y-3">
              <Badge
                variant="outline"
                className="w-fit border-primary/30 bg-primary/10 text-xs uppercase tracking-[0.24em] text-primary"
              >
                Setting spotlight
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {setting.name}
              </h1>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {currencyFormatter.format(price)}
                </span>
                <span className="text-sm text-muted-foreground">{selectedMetalLabel}</span>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/50 bg-background/90 p-6 shadow-lg backdrop-blur-sm">
              <header className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Customize your setting</h2>
                <p className="text-sm text-muted-foreground">
                  Fine-tune metal, proportions, and fit before choosing your centerpiece.
                </p>
              </header>

              <div className="mt-6 space-y-5">
                <OptionGroup label="Precious metal type">
                  <div className="flex flex-wrap gap-2">
                    {METAL_TYPES.map((metal) => (
                      <OptionPill
                        key={metal.value}
                        label={metal.label}
                        active={selectedMetal === metal.value}
                        onClick={() => setSelectedMetal(metal.value)}
                      />
                    ))}
                  </div>
                </OptionGroup>

                <OptionGroup label="Band width">
                  <div className="flex flex-wrap gap-2">
                    {BAND_WIDTH_OPTIONS.map((option) => (
                      <OptionPill
                        key={option}
                        label={option}
                        active={bandWidth === option}
                        onClick={() => setBandWidth(option)}
                      />
                    ))}
                  </div>
                </OptionGroup>

                <OptionGroup label="Setting height">
                  <div className="flex flex-wrap gap-2">
                    {SETTING_HEIGHT_OPTIONS.map((option) => (
                      <OptionPill
                        key={option}
                        label={`${option} setting`}
                        active={settingHeight === option}
                        onClick={() => setSettingHeight(option)}
                      />
                    ))}
                  </div>
                </OptionGroup>

                <OptionGroup label="Ring size">
                  <RingSizeSelector value={ringSize} onChange={setRingSizeState} />
                </OptionGroup>
              </div>
            </section>

            <Card className="border border-primary/30 bg-primary/5 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Select this setting</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Continue to the builder to choose your perfect diamond.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Starting from</span>
                  <span className="text-2xl font-semibold text-foreground">
                    {currencyFormatter.format(price)}
                  </span>
                </div>
                <Button size="lg" className="w-full" onClick={handleSelectSetting}>
                  Select this setting
                </Button>
                <p className="text-xs text-muted-foreground">
                  Pricing updates based on metal choice, ring size, and center stone.
                </p>
              </CardContent>
            </Card>

            {/* <Card className="border border-border/60 bg-background/80 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Need assistance?</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Our stylists can guide you through diamond selection, sizing, and bespoke customization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Email us at support@gemfinder.com or schedule a virtual consultation.</p>
                <Link
                  to={`/app/builder/inquiries?shop=${shop}`}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full border-dashed")}
                >
                  Schedule a consultation
                </Link>
              </CardContent>
            </Card> */}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="">
            <header className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">You may also like</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore additional handcrafted settings that complement your style.
              </p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((candidate) => {
                const detailParams = new URLSearchParams()
                detailParams.set("shop", shop)
                detailParams.set("metal", selectedMetal)
                detailParams.set("ringSize", ringSize)
                if (from) {
                  detailParams.set("from", from)
                }
                const priceForCard = candidate.basePrices[selectedMetal] ?? candidate.startingPrice
                return (
                  <SettingCard
                    key={candidate.id}
                    setting={candidate as Setting}
                    price={priceForCard}
                    selected={candidate.id === setting.id}
                    href={`/builder/setting/${candidate.id}?${detailParams.toString()}`}
                  />
                )
              })}
            </div>
            <div className="mt-6">
              <Link to={backToBuilderHref} className="inline-flex items-center justify-start text-sm font-medium hover:text-primary transition-colors">
                Back to all settings
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

function OptionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground/90">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function OptionPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border/50 bg-background/80 text-muted-foreground hover:border-primary/40"
      )}
    >
      {label}
    </button>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background/60 p-4">
      <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground/80">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function IncludedItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <BadgeCheck className="size-4 text-primary" />
      <span>{children}</span>
    </div>
  )
}
