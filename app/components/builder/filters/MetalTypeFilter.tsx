/**
 * Metal Type Filter Component
 *
 * Visual filter with color swatches for metal selection.
 * Enhanced UX with realistic metal colors and smooth animations.
 */

import { Check, Sparkles } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { cn } from "~/lib/utils";
import type { MetalType } from "~/utils/constants";

interface MetalOption {
  value: MetalType;
  label: string;
  color: string;
  gradient: string;
}

const METAL_OPTIONS: MetalOption[] = [
  {
    value: "14k_white_gold",
    label: "14K White Gold",
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
  },
  {
    value: "14k_yellow_gold",
    label: "14K Yellow Gold",
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)",
  },
  {
    value: "14k_rose_gold",
    label: "14K Rose Gold",
    color: "#B76E79",
    gradient: "linear-gradient(135deg, #B76E79 0%, #A85A64 100%)",
  },
  {
    value: "18k_white_gold",
    label: "18K White Gold",
    color: "#E8E8E8",
    gradient: "linear-gradient(135deg, #E8E8E8 0%, #C5C5C5 100%)",
  },
  {
    value: "18k_yellow_gold",
    label: "18K Yellow Gold",
    color: "#FFDF00",
    gradient: "linear-gradient(135deg, #FFDF00 0%, #FFD000 100%)",
  },
  {
    value: "18k_rose_gold",
    label: "18K Rose Gold",
    color: "#C07080",
    gradient: "linear-gradient(135deg, #C07080 0%, #B06070 100%)",
  },
  {
    value: "platinum",
    label: "Platinum",
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #A8A8A8 100%)",
  },
];

interface MetalTypeFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

export function MetalTypeFilter({
  selected,
  onChange,
  multiSelect = true,
}: MetalTypeFilterProps) {
  const isSelected = (value: string) => selected.includes(value);

  const handleClick = (value: string) => {
    if (multiSelect) {
      if (isSelected(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div
      className="space-y-3 border-b border-border/60 pb-6 last:border-b-0"
      role="group"
      aria-labelledby="metal-type-filter-label"
    >
      <div className="flex items-center justify-between">
        <span
          id="metal-type-filter-label"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Icon icon={Sparkles} size="xs" className="h-3 w-3 text-primary/70" />
          Metal Type
        </span>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-primary/80">
            {selected.length} selected
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {METAL_OPTIONS.map((metal) => {
          const itemSelected = isSelected(metal.value);
          return (
            <button
              key={metal.value}
              type="button"
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                itemSelected
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
              )}
              onClick={() => handleClick(metal.value)}
              aria-label={`Filter by ${metal.label}`}
              aria-pressed={itemSelected}
            >
              <span
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/60 shadow-inner"
                style={{ background: metal.gradient }}
              >
                {itemSelected && (
                  <Icon icon={Check} size="sm" className="text-white drop-shadow-sm" />
                )}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold capitalize">
                  {metal.label}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {metal.value.replace(/_/g, " ")}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
