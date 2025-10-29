/**
 * Filter Group Component
 *
 * Collapsible group of filter options (checkboxes or radio buttons).
 * Enhanced with lucide-react icons and smooth animations.
 */

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

interface FilterGroupProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  collapsible?: boolean;
}

export function FilterGroup({
  title,
  options,
  selected,
  onChange,
  multiSelect = true,
  collapsible = true,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const sectionId = `filter-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const contentId = `${sectionId}-content`;

  const handleChange = (value: string, checked: boolean) => {
    if (multiSelect) {
      if (checked) {
        onChange([...selected, value]);
      } else {
        onChange(selected.filter((v) => v !== value));
      }
    } else {
      onChange(checked ? [value] : []);
    }
  };

  return (
    <div
      className="space-y-3 border-b border-border/60 pb-6 last:border-b-0"
      role="group"
      aria-labelledby={sectionId}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition",
          "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !collapsible && "cursor-default"
        )}
        onClick={() => collapsible && setIsOpen((prev) => !prev)}
        aria-expanded={collapsible ? isOpen : undefined}
        aria-controls={collapsible ? contentId : undefined}
        id={sectionId}
      >
        <span className="text-sm font-semibold tracking-wide text-foreground">
          {title}
        </span>
        {collapsible && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        )}
      </button>

      {(!collapsible || isOpen) && (
        <div id={contentId} role="group" className="space-y-2">
          {options.map((option) => {
            const isChecked = selected.includes(option.value);

            return (
              <label
                key={option.value}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-sm transition",
                  isChecked
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-border/40 bg-card/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleChange(option.value, Boolean(checked))
                    }
                    aria-label={option.label}
                  />
                  <span className={cn("font-medium", isChecked && "text-primary")}
                  >
                    {option.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
