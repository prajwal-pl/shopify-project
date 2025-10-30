import { BadgeCheck, Diamond } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { Stone } from "~/types/builder"
import { currencyFormatter, DIAMOND_TYPE_LABEL, formatToken } from "./utils"

interface DiamondCardProps {
    stone: Stone
    selected: boolean
    onSelect: () => void
}

export function DiamondCard({ stone, selected, onSelect }: DiamondCardProps) {
    const specs = [
        `${stone.carat.toFixed(2)}ct`,
        stone.cut ? formatToken(stone.cut) : null,
        stone.color?.toUpperCase() ?? null,
        stone.clarity?.toUpperCase() ?? null,
    ].filter(Boolean) as string[]

    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-transparent bg-background/80 shadow-lg transition-transform duration-300",
                "hover:-translate-y-1.5 hover:shadow-xl",
                selected ? "ring-2 ring-primary/60" : "ring-1 ring-border"
            )}
        >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 via-background to-transparent">
                <img
                    src={stone.images[0]}
                    alt={`${formatToken(stone.shape)} diamond`}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <Diamond className="size-3 text-primary" />
                    {DIAMOND_TYPE_LABEL[stone.diamondType]}
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
                    {formatToken(stone.shape)} Cut
                </CardTitle>
                <CardDescription className="text-sm">
                    {stone.certificate
                        ? `Certified by ${stone.certificate.toUpperCase()}`
                        : "Certification available on request."}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-foreground">
                        {currencyFormatter.format(stone.price)}
                    </span>
                    <Badge variant="outline" className="border-primary/30 text-xs uppercase tracking-wide text-primary">
                        {specs.length > 0 ? specs.join(" • ") : "Premium"}
                    </Badge>
                </div>
                {stone.certificateUrl ? (
                    <a
                        href={stone.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        View certificate
                    </a>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        Each diamond includes full certification and lifetime warranty.
                    </p>
                )}
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
                    {selected ? "Chosen" : "Select this diamond"}
                </button>
            </CardFooter>
        </Card>
    )
}
