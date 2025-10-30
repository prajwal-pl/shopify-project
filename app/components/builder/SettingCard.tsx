import { BadgeCheck, Sparkles } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { Setting } from "~/types/builder"
import { currencyFormatter, formatToken } from "./utils"

interface SettingCardProps {
    setting: Setting
    price: number
    selected: boolean
    onSelect: () => void
}

export function SettingCard({ setting, price, selected, onSelect }: SettingCardProps) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-transparent bg-background/80 shadow-lg transition-transform duration-300",
                "hover:-translate-y-1.5 hover:shadow-xl",
                selected ? "ring-2 ring-primary/60" : "ring-1 ring-border"
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={setting.images[0]}
                    alt={setting.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <Sparkles className="size-3 text-primary" />
                    {formatToken(setting.style)}
                </span>
                {selected && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        <BadgeCheck className="size-3" />
                        Selected
                    </span>
                )}
            </div>

            <CardHeader className="gap-2">
                <CardTitle className="text-lg font-semibold leading-snug tracking-tight">
                    {setting.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                    {setting.description ?? "Timeless craftsmanship and ethically sourced materials."}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-foreground">
                        {currencyFormatter.format(price)}
                    </span>
                    <Badge variant="outline" className="border-primary/30 text-xs uppercase tracking-wide text-primary">
                        {setting.compatibleShapes
                            .slice(0, 3)
                            .map((shape) => formatToken(shape))
                            .join(" • ")}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                    Compatible with {setting.compatibleShapes.length} popular diamond shapes.
                </p>
            </CardContent>

            <CardFooter className="px-6 pb-6">
                <button
                    type="button"
                    onClick={onSelect}
                    className={cn(
                        buttonVariants({ variant: selected ? "secondary" : "outline" }),
                        "w-full",
                        selected && "border-primary bg-primary/10 text-primary"
                    )}
                >
                    {selected ? "Chosen" : "Select this setting"}
                </button>
            </CardFooter>
        </Card>
    )
}
