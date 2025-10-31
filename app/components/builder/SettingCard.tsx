import { ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react"
import { Link } from "react-router"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"
import type { Setting } from "~/types/builder"
import { currencyFormatter, formatToken } from "./utils"

interface SettingCardProps {
    setting: Setting
    price: number
    selected: boolean
    href: string
}

export function SettingCard({ setting, price, selected, href }: SettingCardProps) {
    return (
        <Link
            to={href}
            className={cn(
                "group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4",
                "focus-visible:ring-offset-background"
            )}
            aria-label={`View details for ${setting.name}`}
        >
            <Card
                className={cn(
                    "relative h-full overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-lg transition-transform duration-300",
                    "group-hover:-translate-y-1.5 group-hover:shadow-xl",
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
                    <CardTitle className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                        {setting.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
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
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/70 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                        {selected ? "Selected • View details" : "View details"}
                        <ArrowUpRight className="size-4" />
                    </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
