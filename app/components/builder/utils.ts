import type { DiamondType } from "~/types/builder"

export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
})

export const DIAMOND_TYPE_LABEL: Record<DiamondType, string> = {
    mined: "Natural",
    lab_grown: "Lab Grown",
    fancy_color: "Fancy Color",
}

export function formatToken(value: string | null | undefined) {
    if (!value) return ""

    return value
        .toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}
