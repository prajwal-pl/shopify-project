import { ArrowRight } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { currencyFormatter } from "./utils"

export interface PriceSummaryValues {
    settingPrice: number
    stonePrice: number
    subtotal: number
    protection: number
    taxEstimate: number
    total: number
}

interface PriceSummaryCardProps {
    totals: PriceSummaryValues
    disabled?: boolean
    loading?: boolean
    onAddToCart: () => void
}

export function PriceSummaryCard({ totals, disabled, loading, onAddToCart }: PriceSummaryCardProps) {
    return (
        <Card className="sticky top-12 h-fit border-2 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <CardHeader className="gap-2">
                <CardTitle className="text-xl font-bold text-stone-900">
                    Order summary
                </CardTitle>
                <CardDescription className="text-stone-600">
                    Transparent pricing with protection options.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 text-sm">
                <SummaryLine label="Setting" amount={totals.settingPrice} />
                <SummaryLine label="Diamond" amount={totals.stonePrice} />
                <Separator className="my-1 bg-border" />
                <SummaryLine label="Jewelry protection" amount={totals.protection} helper="Optional care plan" />
                <SummaryLine label="Estimated tax" amount={totals.taxEstimate} helper="Based on shipping to the U.S." />
                <Separator className="my-1 bg-border" />
                <SummaryLine label="Subtotal" amount={totals.subtotal} emphasized />
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t-2 border-stone-300 bg-gradient-to-br from-stone-50 to-white pt-6">
                <div className="flex w-full items-center justify-between text-base">
                    <span className="font-bold text-stone-900">Total due today</span>
                    <span className="text-2xl font-bold text-primary">{currencyFormatter.format(totals.total)}</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" size="lg" onClick={onAddToCart} disabled={disabled || loading}>
                    {loading ? "Adding to cart..." : "Add to cart"}
                    {!loading && <ArrowRight className="size-4" />}
                </Button>
                <p className="text-xs text-muted-foreground">
                    By continuing you agree to receive email updates related to your ring configuration and order status.
                </p>
            </CardFooter>
        </Card>
    )
}

interface SummaryLineProps {
    label: string
    amount: number
    helper?: string
    emphasized?: boolean
}

function SummaryLine({ label, amount, helper, emphasized }: SummaryLineProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
                <span className={emphasized ? "font-bold text-stone-900" : "text-stone-600"}>
                    {label}
                </span>
                <span className={emphasized ? "text-base font-bold text-stone-900" : "text-sm font-semibold text-stone-900"}>
                    {currencyFormatter.format(amount)}
                </span>
            </div>
            {helper && <span className="text-xs text-muted-foreground/80">{helper}</span>}
        </div>
    )
}
