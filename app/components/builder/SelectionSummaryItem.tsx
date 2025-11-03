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
        <div className="group flex flex-col gap-4 rounded-lg border-2 border-stone-200 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:border-stone-300">
            <div className="flex items-center gap-3">
                {media ? (
                    <div className="size-20 overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-50 shadow-sm">
                        <img src={media} alt={title} className="size-full object-cover" loading="lazy" />
                    </div>
                ) : (
                    <div className="size-20 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50" />
                )}
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        {title}
                    </span>
                    <span className="text-lg font-bold text-stone-900">
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
                <span className="text-xl font-bold text-stone-900">
                    {currencyFormatter.format(price)}
                </span>
            </div>
        </div>
    )
}
