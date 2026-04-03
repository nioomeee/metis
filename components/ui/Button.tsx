import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "metis-btn-primary",
        ghost: "metis-btn-ghost text-on-surface hover:text-accent-primary",
        danger: "bg-transparent border border-error text-error hover:bg-error/10",
        outline: "border border-outline-variant hover:bg-surface-container-high hover:border-outline",
        secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        link: "text-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ id: number, x: number, y: number }[]>([])
    const isGhost = variant === 'ghost' || variant === 'link'

    const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isGhost) {
        onClick?.(e)
        return
      }

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setRipples(prev => [...prev, { id: Date.now(), x, y }])
      onClick?.(e)
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleMouseClick}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </span>
        
        {!isGhost && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <AnimatePresence>
              {ripples.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onAnimationComplete={() => setRipples(prev => prev.filter(item => item.id !== r.id))}
                  className="absolute rounded-full bg-white/20"
                  style={{ top: r.y - 10, left: r.x - 10, width: 20, height: 20 }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
