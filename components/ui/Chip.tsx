import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-geist transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-accent-primary hover:bg-primary/20",
        secondary: "border-transparent bg-secondary/10 text-accent-secondary hover:bg-secondary/20",
        destructive: "border-transparent bg-error/10 text-error",
        outline: "text-on-surface-variant border-outline-variant",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant }), className)} {...props} />
  )
}

export { Chip, chipVariants }
