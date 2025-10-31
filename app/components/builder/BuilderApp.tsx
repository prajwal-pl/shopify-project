import { useMemo, useState } from "react"
import {
    BadgeCheck,
    Diamond,
    Sparkles,
    ShoppingBag,
    Wand2,
    Palette,
    type LucideIcon,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent } from "~/components/ui/tabs"
import type { Setting, Stone } from "~/types/builder"
import { METAL_TYPES, RING_SIZES, type MetalType, type RingSize } from "~/utils/constants"
import { BuilderStepTabs } from "./BuilderStepTabs"
import { DiamondCard } from "./DiamondCard"
import { MetalSelector } from "./MetalSelector"
import { PriceSummaryCard } from "./PriceSummaryCard"
import { RingSizeSelector } from "./RingSizeSelector"
import { SelectionSummaryItem } from "./SelectionSummaryItem"
import { SettingCard } from "./SettingCard"
import { StagePanel } from "./StagePanel"
import { DIAMOND_TYPE_LABEL, formatToken } from "./utils"

const STEPS = [
    {
        id: "setting",
        title: "Choose Your Setting",
        description: "Select a band style to form the foundation of your ring.",
        icon: Sparkles,
    },
    {
        id: "diamond",
        title: "Select a Diamond",
        description: "Compare stones and find the perfect centerpiece.",
        icon: Diamond,
    },
    {
        id: "review",
        title: "Review & Complete",
        description: "Confirm every detail before adding to cart.",
        icon: ShoppingBag,
    },
] as const satisfies ReadonlyArray<{
    id: "setting" | "diamond" | "review"
    title: string
    description: string
    icon: LucideIcon
}>

type StepId = (typeof STEPS)[number]["id"]

interface BuilderAppProps {
    shop: string
    settings: Setting[]
    diamonds: Stone[]
}

export function BuilderApp({ shop, settings, diamonds }: BuilderAppProps) {
    const [step, setStep] = useState<StepId>("setting")
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
    const [selectedStone, setSelectedStone] = useState<Stone | null>(null)
    const [metalType, setMetalType] = useState<MetalType>(METAL_TYPES[0].value)
    const [ringSize, setRingSize] = useState<RingSize>(RING_SIZES[6])

    const totals = useMemo(() => {
        const settingPrice = selectedSetting?.basePrices[metalType] ?? 0
        const stonePrice = selectedStone?.price ?? 0
        const subtotal = settingPrice + stonePrice
        const protection = Math.round(subtotal * 0.015)
        const taxEstimate = Math.round(subtotal * 0.0825)
        const total = subtotal + protection + taxEstimate

        return {
            settingPrice,
            stonePrice,
            subtotal,
            protection,
            taxEstimate,
            total,
        }
    }, [metalType, selectedSetting, selectedStone])

    const canAdvanceToDiamond = Boolean(selectedSetting)
    const canAdvanceToReview = canAdvanceToDiamond && Boolean(selectedStone)

    const stepStates = useMemo(() => {
        const hasSetting = Boolean(selectedSetting)
        const hasStone = Boolean(selectedStone)

        return STEPS.map((definition) => {
            const disabled =
                (definition.id === "diamond" && !hasSetting) ||
                (definition.id === "review" && !hasStone)

            const completed =
                (definition.id === "setting" && hasSetting) ||
                (definition.id === "diamond" && hasStone) ||
                (definition.id === "review" && hasSetting && hasStone)

            return {
                ...definition,
                disabled,
                completed,
            }
        })
    }, [selectedSetting, selectedStone])

    const handleAddToCart = () => {
        // Placeholder integration until checkout flow is wired to Shopify cart APIs.
        console.log("builder:add-to-cart", {
            shop,
            settingId: selectedSetting?.id,
            stoneId: selectedStone?.id,
            metalType,
            ringSize,
        })
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(226,207,255,0.25),transparent_55%)] pb-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-8 sm:px-8 lg:px-12">
                <header className="flex flex-col gap-4">
                    <Badge variant="outline" className="w-fit gap-2 border-transparent bg-primary/10 text-sm text-primary">
                        <Wand2 className="size-3.5" />
                        Build your ring — {shop}
                    </Badge>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            Craft a ring as unique as your story
                        </h1>
                        <p className="max-w-2xl text-base text-muted-foreground">
                            Follow the guided steps to pair a designer setting with a dazzling diamond, then review every detail before checkout. Save progress or share with a loved one at any point.
                        </p>
                    </div>
                </header>

                <Tabs
                    value={step}
                    onValueChange={(value) => {
                        if (value === "diamond" && !canAdvanceToDiamond) return
                        if (value === "review" && !canAdvanceToReview) return
                        setStep(value as StepId)
                    }}
                    className="flex flex-col gap-8"
                >
                    <BuilderStepTabs steps={stepStates} currentStep={step} />

                    <TabsContent value="setting" className="focus-visible:outline-none">
                        <StagePanel panelKey="setting" className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                        Select a setting style
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Choose from curated designer settings. Pricing updates automatically for each metal type.
                                    </p>
                                </div>
                                <MetalSelector value={metalType} onChange={setMetalType} />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {settings.map((setting) => {
                                    const isSelected = selectedSetting?.id === setting.id
                                    const price = setting.basePrices[metalType] ?? setting.startingPrice
                                    return (
                                        <SettingCard
                                            key={setting.id}
                                            setting={setting}
                                            price={price}
                                            selected={isSelected}
                                            onSelect={() => {
                                                setSelectedSetting(setting)
                                                setStep("diamond")
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </StagePanel>
                    </TabsContent>

                    <TabsContent value="diamond" className="focus-visible:outline-none">
                        <StagePanel panelKey="diamond" className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                        Find the perfect diamond
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Compare specifications and certifications. Highlighted stones pair beautifully with your chosen setting.
                                    </p>
                                </div>
                                <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
                                    <span className="font-medium text-foreground">
                                        Selected setting
                                    </span>
                                    <span className="mx-2 text-muted-foreground">•</span>
                                    {selectedSetting ? selectedSetting.name : "None yet"}
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {diamonds.map((stone) => {
                                    const isSelected = selectedStone?.id === stone.id
                                    return (
                                        <DiamondCard
                                            key={stone.id}
                                            stone={stone}
                                            selected={isSelected}
                                            onSelect={() => {
                                                setSelectedStone(stone)
                                                setStep("review")
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </StagePanel>
                    </TabsContent>

                    <TabsContent value="review" className="focus-visible:outline-none">
                        <StagePanel panelKey="review" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <Card className="border-0 bg-background/60 shadow-lg backdrop-blur">
                                <CardHeader className="gap-3">
                                    <CardTitle className="text-2xl font-semibold">
                                        Final review
                                    </CardTitle>
                                    <CardDescription className="leading-relaxed">
                                        Confirm your configuration, adjust sizing, and add optional protection before proceeding to checkout.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-6">
                                    <SelectionSummaryItem
                                        title="Setting"
                                        description={selectedSetting ? selectedSetting.name : "No setting selected"}
                                        price={totals.settingPrice}
                                        media={selectedSetting?.images?.[0]}
                                        accent={selectedSetting ? formatToken(selectedSetting.style) : undefined}
                                    />
                                    <SelectionSummaryItem
                                        title="Diamond"
                                        description={
                                            selectedStone
                                                ? `${selectedStone.carat.toFixed(2)}ct ${formatToken(selectedStone.shape)} · ${selectedStone.color?.toUpperCase() ?? "—"} color · ${selectedStone.clarity?.toUpperCase() ?? "—"} clarity`
                                                : "No diamond selected"
                                        }
                                        price={totals.stonePrice}
                                        media={selectedStone?.images?.[0]}
                                        accent={selectedStone ? DIAMOND_TYPE_LABEL[selectedStone.diamondType] : undefined}
                                    />

                                    <Card className="rounded-2xl border-dashed bg-card/60">
                                        <CardHeader className="gap-1">
                                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                                <Palette className="size-4 text-primary" />
                                                Customize fit
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                Pick a metal finish and ring size best suited for daily wear.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-wrap gap-4">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Metal
                                                </span>
                                                <MetalSelector value={metalType} onChange={setMetalType} condensed />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Ring size
                                                </span>
                                                <RingSizeSelector value={ringSize} onChange={setRingSize} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                                <CardFooter className="flex flex-col items-start gap-3 border-t border-dashed/50 pt-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BadgeCheck className="size-4 text-success" />
                                        Free 60-day resizing and insured shipping included.
                                    </div>
                                </CardFooter>
                            </Card>

                            <PriceSummaryCard totals={totals} onAddToCart={handleAddToCart} disabled={!canAdvanceToReview} />
                        </StagePanel>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
