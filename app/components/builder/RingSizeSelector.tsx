import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { RING_SIZES, type RingSize } from "~/utils/constants"

interface RingSizeSelectorProps {
    value: RingSize
    onChange: (value: RingSize) => void
}

export function RingSizeSelector({ value, onChange }: RingSizeSelectorProps) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next as RingSize)}>
            <SelectTrigger size="sm" className="min-w-[7rem]">
                <SelectValue placeholder="Ring size" />
            </SelectTrigger>
            <SelectContent align="start">
                {RING_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                        Size {size}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
