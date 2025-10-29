/**
 * Range Slider Component
 *
 * Modern double-ended slider leveraging Radix Slider via shadcn wrapper.
 */

import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { Slider } from "~/components/ui/slider";

interface RangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
  formatValue?: (value: number) => string;
  label?: string;
}

export function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  formatValue = (v) => v.toString(),
  label,
}: RangeSliderProps) {
  const [clampedMin, clampedMax] = useMemo(() => {
    const safeMin = Math.min(Math.max(valueMin, min), max);
    const safeMax = Math.min(Math.max(valueMax, safeMin), max);
    return [safeMin, safeMax] as const;
  }, [min, max, valueMin, valueMax]);

  const handleValueChange = (values: number[]) => {
    if (values.length < 2) return;
    const [nextMin, nextMax] = values;
    onChange(nextMin, nextMax);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
      {label && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Icon icon={Sparkles} size="xs" className="h-3 w-3 text-primary/70" />
            {label}
          </span>
          <span className="text-xs text-muted-foreground/70">
            {formatValue(min)} – {formatValue(max)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
        <span>{formatValue(clampedMin)}</span>
        <span className="text-muted-foreground">—</span>
        <span>{formatValue(clampedMax)}</span>
      </div>

      <Slider
        min={min}
        max={max}
        step={step}
        value={[clampedMin, clampedMax]}
        onValueChange={handleValueChange}
        aria-label={label ?? "Range"}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
