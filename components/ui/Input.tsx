import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="relative group w-full">
        <input
          type={type}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            "metis-input flex h-10 w-full px-3 py-2 text-sm peer bg-transparent border-b border-outline-variant/30 focus:border-accent-primary transition-all outline-none",
            className
          )}
          ref={ref}
          placeholder=" "
          {...props}
        />
        
        {/* Animated Underline / Scanline */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/10 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={isFocused ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-primary to-transparent"
          />
        </div>

        {label && (
          <label className="absolute left-3 top-2.5 text-sm text-on-surface-variant font-geist transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-accent-primary peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs">
            {label}
          </label>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
