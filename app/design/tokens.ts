export type TokenScale<T extends string> = Record<T, string>

export const radius = {
    none: "0px",
    xs: "0.4rem",
    sm: "0.6rem",
    md: "0.8rem",
    lg: "1.2rem",
    xl: "1.6rem",
} satisfies TokenScale<"none" | "xs" | "sm" | "md" | "lg" | "xl">

export const spacing = {
    "0": "0rem",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
} satisfies TokenScale<"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "10" | "12" | "16" | "20" | "24">

export const fontSizes = {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
} satisfies TokenScale<"xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl">

export const lineHeights = {
    tight: "1.1",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.7",
} satisfies TokenScale<"tight" | "snug" | "normal" | "relaxed">

export const fontWeights = {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
} satisfies TokenScale<"regular" | "medium" | "semibold" | "bold">

export const elevations = {
    none: "0 0 0 1px var(--color-border)",
    sm: "0 10px 30px -12px rgb(15 23 42 / 0.12)",
    md: "0 18px 42px -18px rgb(15 23 42 / 0.16)",
    lg: "0 24px 60px -24px rgb(15 23 42 / 0.2)",
} satisfies TokenScale<"none" | "sm" | "md" | "lg">

export const durations = {
    instant: "75ms",
    fast: "120ms",
    base: "180ms",
    slow: "260ms",
} satisfies TokenScale<"instant" | "fast" | "base" | "slow">

export const easings = {
    entrance: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 0.6, 1)",
    emphasis: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} satisfies TokenScale<"entrance" | "exit" | "emphasis">

export const colors = {
    background: "var(--color-background)",
    foreground: "var(--color-foreground)",
    card: "var(--color-card)",
    cardForeground: "var(--color-card-foreground)",
    popover: "var(--color-popover)",
    popoverForeground: "var(--color-popover-foreground)",
    primary: "var(--color-primary)",
    primaryForeground: "var(--color-primary-foreground)",
    secondary: "var(--color-secondary)",
    secondaryForeground: "var(--color-secondary-foreground)",
    accent: "var(--color-accent)",
    accentForeground: "var(--color-accent-foreground)",
    muted: "var(--color-muted)",
    mutedForeground: "var(--color-muted-foreground)",
    destructive: "var(--color-destructive)",
    border: "var(--color-border)",
    input: "var(--color-input)",
    ring: "var(--color-ring)",
    success: "oklch(0.72 0.14 145)",
    warning: "oklch(0.83 0.17 75)",
    info: "oklch(0.72 0.09 260)",
} satisfies TokenScale<
    | "background"
    | "foreground"
    | "card"
    | "cardForeground"
    | "popover"
    | "popoverForeground"
    | "primary"
    | "primaryForeground"
    | "secondary"
    | "secondaryForeground"
    | "accent"
    | "accentForeground"
    | "muted"
    | "mutedForeground"
    | "destructive"
    | "border"
    | "input"
    | "ring"
    | "success"
    | "warning"
    | "info"
>

export const layout = {
    maxWidth: "1180px",
    contentWidth: "min(1180px, 100% - 2 * var(--page-padding))",
} satisfies TokenScale<"maxWidth" | "contentWidth">

export const page = {
    padding: "clamp(1.25rem, 3vw, 3rem)",
    sectionGap: "clamp(2rem, 5vw, 4rem)",
    gridGap: "clamp(1.5rem, 3vw, 2.5rem)",
} satisfies TokenScale<"padding" | "sectionGap" | "gridGap">

export const tokens = {
    radius,
    spacing,
    fontSizes,
    lineHeights,
    fontWeights,
    elevations,
    durations,
    easings,
    colors,
    layout,
    page,
}
export type DesignTokens = typeof tokens
