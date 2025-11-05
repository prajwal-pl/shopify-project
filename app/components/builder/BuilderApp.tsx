import { useMemo } from "react"
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
import { BuilderStepTabs } from "./BuilderStepTabs"
import { DiamondCard } from "./DiamondCard"
import { MetalSelector } from "./MetalSelector"
import { PriceSummaryCard } from "./PriceSummaryCard"
import { RingSizeSelector } from "./RingSizeSelector"
import { SelectionSummaryItem } from "./SelectionSummaryItem"
import { SettingCard } from "./SettingCard"
import { StagePanel } from "./StagePanel"
import { DIAMOND_TYPE_LABEL, formatToken } from "./utils"
import { useBuilderState } from "~/hooks/useBuilderState"

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
    const {
        step,
        setStep,
        selectedSetting,
        selectedStone,
        setSelectedStone,
        metalType,
        setMetalType,
        ringSize,
        setRingSize,
        detailBaseQueryString,
        totals,
        canAdvanceToDiamond,
        canAdvanceToReview,
        isAddingToCart,
        handleAddToCart,
        STEP_SEQUENCE,
    } = useBuilderState({ shop, settings, diamonds })

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-stone-50/40 pb-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-8 sm:px-8 lg:px-12">
                <header className="flex flex-col gap-4">
                    <Badge variant="outline" className="w-fit gap-2 border-transparent bg-primary/10 text-sm text-primary">
                        <Wand2 className="size-3.5" />
                        Build your ring — {shop}
                    </Badge>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                            Craft a ring as unique as your story
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-stone-600">
                            Follow the guided steps to pair a designer setting with a dazzling diamond, then review every detail before checkout. Save progress or share with a loved one at any point.
                        </p>
                    </div>
                </header>

                <Tabs
                    value={step}
                    onValueChange={(value) => {
                        const stepIndex = STEP_SEQUENCE.indexOf(value as StepId)
                        const currentIndex = STEP_SEQUENCE.indexOf(step)

                        if (stepIndex > currentIndex) {
                            if (value === "diamond" && !canAdvanceToDiamond) return
                            if (value === "review" && !canAdvanceToReview) return
                        }

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
                                    const detailParams = new URLSearchParams(detailBaseQueryString)
                                    detailParams.set("from", "builder")
                                    const href = `/builder/setting/${setting.id}?${detailParams.toString()}`
                                    return (
                                        <SettingCard
                                            key={setting.id}
                                            setting={setting}
                                            price={price}
                                            selected={isSelected}
                                            href={href}
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
                            <Card className="border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                                <CardHeader className="gap-3">
                                    <CardTitle className="text-2xl font-bold text-stone-900">
                                        Final review
                                    </CardTitle>
                                    <CardDescription className="text-base leading-relaxed text-stone-600">
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

                                    <Card className="rounded-lg border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-white shadow-sm">
                                        <CardHeader className="gap-1">
                                            <CardTitle className="flex items-center gap-2 text-base font-bold text-stone-900">
                                                <Palette className="size-4 text-primary" />
                                                Customize fit
                                            </CardTitle>
                                            <CardDescription className="text-sm text-stone-600">
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
                                <CardFooter className="flex flex-col items-start gap-3 border-t border-stone-200 pt-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BadgeCheck className="size-4 text-success" />
                                        Free 60-day resizing and insured shipping included.
                                    </div>
                                </CardFooter>
                            </Card>

                            <PriceSummaryCard totals={totals} onAddToCart={handleAddToCart} disabled={!canAdvanceToReview} loading={isAddingToCart} />
                        </StagePanel>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
