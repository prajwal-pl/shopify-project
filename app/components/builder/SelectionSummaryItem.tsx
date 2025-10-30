import { Badge } from "~/components/ui/badge"
import { currencyFormatter } from "./utils"

interface SelectionSummaryItemProps {
    title: string
    description: string
    price: number
    media?: string
    accent?: string
}

export function SelectionSummaryItem({ title, description, price, media, accent }: SelectionSummaryItemProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-primary/20 bg-background/70 p-5 shadow-sm">
            <div className="flex items-center gap-3">
                {media ? (
                    <div className="size-16 overflow-hidden rounded-xl border bg-muted/40">
                        <img src={media} alt={title} className="size-full object-cover" loading="lazy" />
                    </div>
                ) : (
                    <div className="size-16 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/40" />
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                        {title}
                    </span>
                    <span className="text-base font-semibold text-foreground">
                        {description}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                {accent ? (
                    <Badge variant="outline" className="border-primary/30 text-xs uppercase tracking-wide text-primary">
                        {accent}
                    </Badge>
                ) : (
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Configured</span>
                )}
                <span className="text-lg font-semibold text-foreground">
                    {currencyFormatter.format(price)}
                </span>
            </div>
        </div>
    )
}
