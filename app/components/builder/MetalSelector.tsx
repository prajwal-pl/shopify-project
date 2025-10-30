import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { METAL_TYPES, type MetalType } from "~/utils/constants"

interface MetalSelectorProps {
    value: MetalType
    onChange: (value: MetalType) => void
    condensed?: boolean
}

export function MetalSelector({ value, onChange, condensed }: MetalSelectorProps) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next as MetalType)}>
            <SelectTrigger size={condensed ? "sm" : "default"} className={condensed ? "min-w-[9rem]" : "min-w-[12rem]"}>
                <SelectValue placeholder="Metal" />
            </SelectTrigger>
            <SelectContent align="start">
                {METAL_TYPES.map((metal) => (
                    <SelectItem key={metal.value} value={metal.value}>
                        {metal.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
