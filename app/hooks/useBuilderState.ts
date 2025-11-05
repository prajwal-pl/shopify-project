import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import type { Setting, Stone } from "~/types/builder"
import { METAL_TYPES, RING_SIZES, type MetalType, type RingSize } from "~/utils/constants"
import { logger } from "~/utils/logger"

const STEP_SEQUENCE = ["setting", "diamond", "review"] as const
type StepId = typeof STEP_SEQUENCE[number]

function isStepId(value: string | null): value is StepId {
    return STEP_SEQUENCE.includes(value as StepId)
}

function isMetalTypeValue(value: string | null): value is MetalType {
    if (!value) return false
    return METAL_TYPES.some((metal) => metal.value === value)
}

function isRingSizeValue(value: string | null): value is RingSize {
    if (!value) return false
    return RING_SIZES.includes(value as RingSize)
}

interface UseBuilderStateProps {
    shop: string
    settings: Setting[]
    diamonds: Stone[]
}

export function useBuilderState({ shop, settings, diamonds }: UseBuilderStateProps) {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchParamsSnapshot = searchParams.toString()

    const paramsSnapshotRef = useRef(searchParamsSnapshot)
    useEffect(() => {
        paramsSnapshotRef.current = searchParamsSnapshot
    }, [searchParamsSnapshot])

    const stepParam = searchParams.get("step")
    const settingIdParam = searchParams.get("settingId")
    const metalParam = searchParams.get("metal")
    const ringSizeParam = searchParams.get("ringSize")

    const [step, setStepState] = useState<StepId>(() => (isStepId(stepParam) ? stepParam : "setting"))
    const [selectedSettingId, setSelectedSettingId] = useState<string | null>(() => settingIdParam)
    const [selectedStone, setSelectedStone] = useState<Stone | null>(null)
    const [metalType, setMetalType] = useState<MetalType>(() =>
        isMetalTypeValue(metalParam) ? metalParam : METAL_TYPES[0].value,
    )
    const [ringSize, setRingSize] = useState<RingSize>(() =>
        isRingSizeValue(ringSizeParam) ? (ringSizeParam as RingSize) : RING_SIZES[6],
    )
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    useEffect(() => {
        if (isStepId(stepParam)) {
            setStepState(stepParam)
        } else if (!stepParam) {
            setStepState("setting")
        }
    }, [stepParam])

    useEffect(() => {
        setSelectedSettingId(settingIdParam)
    }, [settingIdParam])

    useEffect(() => {
        if (isMetalTypeValue(metalParam)) {
            setMetalType(metalParam)
        }
    }, [metalParam])

    useEffect(() => {
        if (isRingSizeValue(ringSizeParam)) {
            setRingSize(ringSizeParam as RingSize)
        }
    }, [ringSizeParam])

    const selectedSetting = useMemo(() => {
        if (!selectedSettingId) return null
        return settings.find((candidate) => candidate.id === selectedSettingId) ?? null
    }, [selectedSettingId, settings])

    const detailBaseQueryString = useMemo(() => {
        const params = new URLSearchParams()
        if (shop) params.set("shop", shop)
        if (metalType) params.set("metal", metalType)
        if (ringSize) params.set("ringSize", ringSize)
        return params.toString()
    }, [shop, metalType, ringSize])

    const previousSettingIdRef = useRef<string | null>(selectedSettingId)
    useEffect(() => {
        if (previousSettingIdRef.current && previousSettingIdRef.current !== selectedSettingId) {
            setSelectedStone(null)
        }
        if (!selectedSettingId) {
            setSelectedStone(null)
        }
        previousSettingIdRef.current = selectedSettingId
    }, [selectedSettingId])

    useEffect(() => {
        const base = new URLSearchParams(paramsSnapshotRef.current)

        if (selectedSettingId) {
            base.set("settingId", selectedSettingId)
        } else {
            base.delete("settingId")
        }

        if (step !== "setting") {
            base.set("step", step)
        } else {
            base.delete("step")
        }

        if (metalType) {
            base.set("metal", metalType)
        } else {
            base.delete("metal")
        }

        if (ringSize) {
            base.set("ringSize", ringSize)
        } else {
            base.delete("ringSize")
        }

        if (shop) {
            base.set("shop", shop)
        }

        const nextString = base.toString()
        if (nextString !== paramsSnapshotRef.current) {
            paramsSnapshotRef.current = nextString
            setSearchParams(base, { replace: true })
        }
    }, [selectedSettingId, step, metalType, ringSize, shop, setSearchParams])

    const totals = useMemo(() => {
        const settingPrice = selectedSetting?.basePrices[metalType] ?? 0
        const stonePrice = selectedStone?.price ?? 0
        const subtotal = settingPrice + stonePrice
        const protection = Math.round(subtotal * 0.015)
        const taxEstimate = Math.round(subtotal * 0.0825)
        const total = subtotal + protection + taxEstimate

        return {
            settingPrice,
            stonePrice,
            subtotal,
            protection,
            taxEstimate,
            total,
        }
    }, [metalType, selectedSetting, selectedStone])

    const canAdvanceToDiamond = Boolean(selectedSetting)
    const canAdvanceToReview = canAdvanceToDiamond && Boolean(selectedStone)

    const handleAddToCart = async () => {
        if (!selectedSetting || !selectedStone) return

        setIsAddingToCart(true)

        try {
            const settingId = selectedSetting.id.startsWith("gid://") ? selectedSetting.id : `scraped:${selectedSetting.id}`
            const stoneId = selectedStone.id.startsWith("gid://") ? selectedStone.id : `scraped:${selectedStone.id}`

            const formData = new FormData()
            formData.append("shop", shop)
            formData.append("settingId", settingId)
            formData.append("stoneId", stoneId)
            formData.append("metalType", metalType)
            formData.append("ringSize", ringSize)
            formData.append("totalPrice", totals.total.toString())

            const response = await fetch("/api/builder/cart", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                logger.error("Failed to add to cart", { error: data.error, shop })
                alert(data.error || "Failed to add to cart. Please try again.")
                return
            }

            window.location.href = `/builder/cart?shop=${shop}`
        } catch (error) {
            logger.error("Error adding to cart", { error: error instanceof Error ? error.message : String(error), shop })
            alert("Failed to add to cart. Please try again.")
        } finally {
            setIsAddingToCart(false)
        }
    }

    return {
        step,
        setStep: setStepState,
        selectedSettingId,
        setSelectedSettingId,
        selectedSetting,
        selectedStone,
        setSelectedStone,
        metalType,
        setMetalType,
        ringSize,
        setRingSize,
        detailBaseQueryString,
        totals,
        canAdvanceToDiamond,
        canAdvanceToReview,
        isAddingToCart,
        handleAddToCart,
        STEP_SEQUENCE,
    }
}

export type { StepId }
