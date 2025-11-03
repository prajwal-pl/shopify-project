import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"

import { TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "~/lib/utils"

export interface BuilderStep {
    id: string
    title: string
    description: string
    icon: LucideIcon
    disabled?: boolean
    completed?: boolean
}

interface BuilderStepTabsProps {
    steps: BuilderStep[]
    currentStep: string
}

export function BuilderStepTabs({ steps, currentStep }: BuilderStepTabsProps) {
    const rawActiveIndex = steps.findIndex((step) => step.id === currentStep)
    const activeIndex = Math.max(0, rawActiveIndex)
    const maxIndex = Math.max(steps.length - 1, 1)
    const progress = steps.length > 1 ? Math.min((activeIndex / maxIndex) * 100, 100) : 0

    return (
        <div className="relative isolate w-full">
            {/* Progress track container constrained inside the tabs area */}
            <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden -translate-y-1/2 sm:block lg:inset-x-8">
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-muted/70">
                    <div
                        className="absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-primary transition-transform duration-500"
                        style={{ transform: `scaleX(${Math.max(0, progress) / 100})` }}
                    />
                </div>
            </div>

            <TabsList
                className={cn(
                    "relative z-10 mb-4 w-full rounded-lg border border-stone-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] h-full",
                    "flex flex-col gap-3 p-3",
                    "sm:grid sm:auto-rows-fr sm:grid-cols-3 sm:gap-4 sm:p-4",
                    "lg:gap-5 lg:p-5",
                )}
            >
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === step.id
                    const showCheckmark = step.completed && !isActive

                    return (
                        <TabsTrigger
                            key={step.id}
                            value={step.id}
                            disabled={step.disabled}
                            data-complete={step.completed}
                            className={cn(
                                "group relative flex h-full w-full flex-col justify-between gap-3 rounded-md border border-transparent bg-stone-50/50 px-4 py-3 text-left transition-all duration-300",
                                "sm:min-h-[112px] lg:min-h-[124px]",
                                "shadow-sm",
                                "hover:border-stone-200 hover:bg-white hover:shadow-sm",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                "data-[state=active]:border-primary/50 data-[state=active]:bg-white data-[state=active]:shadow-md",
                                step.completed && "border-primary/40 bg-primary/5",
                                step.disabled && "cursor-not-allowed opacity-60",
                                "items-stretch whitespace-normal",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "flex size-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-all duration-300",
                                        "group-data-[state=active]:border-primary/70 group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary",
                                        step.completed && "border-primary/70 bg-primary/10 text-primary",
                                    )}
                                >
                                    {showCheckmark ? <Check className="size-4" /> : <Icon className="size-4" />}
                                </span>
                                <div className="flex flex-1 flex-col gap-1">
                                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                                        Step {index + 1}
                                    </span>
                                    <span className="text-sm font-semibold leading-snug text-foreground group-data-[state=active]:text-foreground">
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </div>
    )
}
