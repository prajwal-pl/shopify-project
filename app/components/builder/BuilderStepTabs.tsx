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
    const activeIndex = steps.findIndex((step) => step.id === currentStep)
    const progress = steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0

    return (
        <div className="relative isolate mb-6 sm:mb-8 md:mb-10">
            {/* Progress track container constrained inside the tabs area */}
            <div className="pointer-events-none absolute inset-x-[3%] top- hidden -translate-y-1/2 sm:block">
                <div className="relative h-[3px]">
                    <div className="absolute inset-0 rounded-full bg-muted" />
                    <div
                        className="absolute inset-y-0 left-0 h-full rounded-full bg-primary/70 transition-transform duration-500"
                        style={{ transform: `scaleX(${Math.max(0, progress) / 100})`, transformOrigin: "left" }}
                    />
                </div>
            </div>

            <TabsList className="relative z-10 grid w-full grid-cols-1 items-stretch gap-3 rounded-3xl border border-border/60 bg-background/90 p-3 shadow-lg backdrop-blur-sm sm:grid-cols-3 sm:p-4">
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
                                "group relative flex h-full min-h-[112px] flex-col justify-between gap-3 rounded-2xl border border-transparent px-4 py-4 text-left transition-all duration-300",
                                "bg-background/80 shadow-sm",
                                "hover:border-primary/30 hover:bg-primary/5",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                "data-[state=active]:border-primary/60 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-primary/5 data-[state=active]:shadow-lg",
                                step.completed && "border-primary/40 bg-primary/5",
                                step.disabled && "cursor-not-allowed opacity-60",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "flex size-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-300",
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
                                    <span className="text-sm font-semibold leading-none text-foreground group-data-[state=active]:text-foreground">
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {step.description}
                            </p>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </div>
    )
}
