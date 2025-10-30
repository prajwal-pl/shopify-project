import { readFile } from "node:fs/promises"
import { join } from "node:path"

import {
    METAL_TYPES,
    STONE_SHAPES,
    CUT_GRADES,
    CLARITY_GRADES,
    COLOR_GRADES,
    CERTIFICATION_TYPES,
    type MetalType,
    type StoneShape,
    type SettingStyle,
} from "~/utils/constants"
import type { Setting, Stone } from "~/types/builder"

const DATA_DIR = join(process.cwd(), "public", "data")
const RING_PRODUCTS_FILE = join(DATA_DIR, "ring-products.json")
const DIAMONDS_FILE = join(DATA_DIR, "mock-diamonds.json")

interface RawRingProduct {
    id: string
    title: string
    sku?: string
    category?: string
    collection?: string
    price?: number | null
    priceRaw?: string
    metalType?: string
    attributes?: Record<string, string>
    mainImage?: string
    thumbnails?: string[]
    description?: string
    availability?: string
    url?: string
}

interface RawDiamond {
    id: string
    productId: string
    stoneType: string
    shape: string
    carat: number
    cut?: string
    color?: string
    clarity?: string
    diamondType: string
    certificate?: string
    certificateNumber?: string
    certificateUrl?: string
    measurements?: string
    tablePercent?: number
    depthPercent?: number
    polish?: string
    symmetry?: string
    fluorescence?: string
    images?: string[]
    price: number
    available?: boolean
}

const DEFAULT_COMPATIBLE_SHAPES: StoneShape[] = [
    "round",
    "oval",
    "princess",
]

const METAL_MULTIPLIERS: Record<MetalType, number> = METAL_TYPES.reduce(
    (acc, metal, index) => {
        const multiplier = 0.9 + index * 0.05
        acc[metal.value] = Number(multiplier.toFixed(2))
        return acc
    },
    {} as Record<MetalType, number>
)

function parsePrice(raw: RawRingProduct, index: number): number {
    if (typeof raw.price === "number" && !Number.isNaN(raw.price)) {
        return raw.price
    }

    const numericFromRaw = raw.priceRaw?.replace(/[^0-9.]/g, "")
    if (numericFromRaw) {
        const parsed = Number(numericFromRaw)
        if (!Number.isNaN(parsed) && parsed > 0) {
            return parsed
        }
    }

    const seeded = 1150 + index * 45
    return seeded
}

function inferStyle(title: string): SettingStyle {
    const upper = title.toUpperCase()

    if (upper.includes("HALO")) return "halo"
    if (upper.includes("HIDDEN")) return "modern"
    if (upper.includes("VINTAGE")) return "vintage"
    if (upper.includes("THREE")) return "three_stone"
    if (upper.includes("PAVE") || upper.includes("PAVÉ")) return "pave"
    if (upper.includes("TENSION")) return "tension"
    if (upper.includes("CHANNEL")) return "channel"

    return "solitaire"
}

function inferShapes(title: string): StoneShape[] {
    const mapped: StoneShape[] = []
    const normalized = title.toLowerCase()

    if (normalized.includes("oval") || normalized.includes(" ov")) {
        mapped.push("oval")
    }
    if (normalized.includes("emerald") || normalized.includes(" ec")) {
        mapped.push("emerald")
    }
    if (normalized.includes("cushion")) {
        mapped.push("cushion")
    }
    if (normalized.includes("princess")) {
        mapped.push("princess")
    }
    if (normalized.includes("pear")) {
        mapped.push("pear")
    }
    if (mapped.length === 0) {
        return DEFAULT_COMPATIBLE_SHAPES
    }

    return Array.from(new Set(["round", ...mapped]))
}

function normaliseShape(value?: string): StoneShape {
    if (!value) return "round"
    const lower = value.toLowerCase()
    const match = STONE_SHAPES.find((shape) => shape.value === lower)
    return match?.value ?? "round"
}

function ensureImageList(raw: RawRingProduct): string[] {
    if (Array.isArray(raw.thumbnails) && raw.thumbnails.length > 0) {
        return raw.thumbnails
    }
    if (raw.mainImage) {
        return [raw.mainImage]
    }
    return [
        "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
    ]
}

function buildBasePrices(price: number): Record<MetalType, number> {
    return Object.entries(METAL_MULTIPLIERS).reduce(
        (acc, [metal, multiplier]) => {
            acc[metal as MetalType] = Math.round(price * multiplier)
            return acc
        },
        {} as Record<MetalType, number>
    )
}

function normaliseRingProduct(raw: RawRingProduct, index: number): Setting {
    const price = parsePrice(raw, index)
    const basePrices = buildBasePrices(price)
    const images = ensureImageList(raw)
    const compatibleShapes = inferShapes(raw.title)

    return {
        id: raw.id,
        productId: raw.id,
        name: raw.title.trim() || `Setting ${index + 1}`,
        description: raw.description ?? undefined,
        sku: raw.sku ?? undefined,
        style: inferStyle(raw.title),
        compatibleShapes,
        basePrices,
        startingPrice: Math.min(...Object.values(basePrices)),
        images,
        featured: index < 6,
        settingHeight: "medium",
    }
}

function normaliseCutGrade(value?: string): Stone["cut"] {
    if (!value) return undefined
    const lower = value.toLowerCase()
    if (lower === "ideal") return "excellent"
    if (lower === "very good") return "very_good"
    return CUT_GRADES.find((grade) => grade.value === lower)?.value
}

function normaliseColorGrade(value?: string): Stone["color"] {
    if (!value) return undefined
    const lower = value.toLowerCase()
    return COLOR_GRADES.find((grade) => grade.value === lower)?.value
}

function normaliseClarity(value?: string): Stone["clarity"] {
    if (!value) return undefined
    const lower = value.toLowerCase()
    return CLARITY_GRADES.find((grade) => grade.value === lower)?.value
}

function normaliseCertification(value?: string): Stone["certificate"] {
    if (!value) return undefined
    const lower = value.toLowerCase()
    if (lower === "none") return "none"
    return (
        CERTIFICATION_TYPES.find((cert) => cert.value === lower)?.value ?? "none"
    )
}

function normaliseDiamond(raw: RawDiamond): Stone {
    return {
        id: raw.id,
        productId: raw.productId,
        stoneType: raw.stoneType,
        shape: normaliseShape(raw.shape),
        carat: raw.carat,
        cut: normaliseCutGrade(raw.cut),
        color: normaliseColorGrade(raw.color),
        clarity: normaliseClarity(raw.clarity),
        diamondType: (raw.diamondType as Stone["diamondType"]) ?? "mined",
        certificate: normaliseCertification(raw.certificate),
        certificateNumber: raw.certificateNumber,
        certificateUrl: raw.certificateUrl,
        measurements: raw.measurements,
        tablePercent: raw.tablePercent,
        depthPercent: raw.depthPercent,
        polish: raw.polish,
        symmetry: raw.symmetry,
        fluorescence: raw.fluorescence,
        images:
            raw.images && raw.images.length > 0
                ? raw.images
                : [
                    "https://images.unsplash.com/photo-1525164286254-4f519d6c4d9d?auto=format&fit=crop&w=600&q=80",
                ],
        price: Math.round(raw.price),
        available: raw.available ?? true,
    }
}

async function readJsonFile<T>(filepath: string): Promise<T> {
    const buffer = await readFile(filepath, "utf8")
    return JSON.parse(buffer) as T
}

export interface BuilderCatalog {
    settings: Setting[]
    diamonds: Stone[]
}

export async function loadBuilderCatalog(options?: {
    settingsLimit?: number
    diamondsLimit?: number
}): Promise<BuilderCatalog> {
    const [rawSettings, rawDiamonds] = await Promise.all([
        readJsonFile<RawRingProduct[]>(RING_PRODUCTS_FILE),
        readJsonFile<RawDiamond[]>(DIAMONDS_FILE),
    ])

    const settings = rawSettings
        .slice(0, options?.settingsLimit ?? 24)
        .map(normaliseRingProduct)

    const diamonds = rawDiamonds
        .slice(0, options?.diamondsLimit ?? 50)
        .map(normaliseDiamond)

    return { settings, diamonds }
}
