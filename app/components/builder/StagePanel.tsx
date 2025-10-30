import { AnimatePresence, motion } from "framer-motion"
import type { PropsWithChildren } from "react"

import { cn } from "~/lib/utils"

interface StagePanelProps extends PropsWithChildren {
    panelKey: string
    className?: string
}

export function StagePanel({ panelKey, className, children }: StagePanelProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={panelKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(className)}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
