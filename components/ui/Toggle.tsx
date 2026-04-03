"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    
    // Uncontrolled state if checked is not provided
    const [internalChecked, setInternalChecked] = React.useState(false);
    const [ripples, setRipples] = React.useState<number[]>([]);
    
    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
      setRipples(prev => [...prev, Date.now()]);
      onCheckedChange?.(newChecked);
    };

    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
           <AnimatePresence>
             {ripples.map(id => (
               <motion.div
                 key={id}
                 initial={{ scale: 0.5, opacity: 0.5 }}
                 animate={{ scale: 2.5, opacity: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.5 }}
                 onAnimationComplete={() => setRipples(prev => prev.filter(r => r !== id))}
                 className="absolute w-6 h-6 rounded-full bg-accent-primary mix-blend-screen"
               />
             ))}
           </AnimatePresence>
        </div>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-primary peer-focus:ring-offset-2 peer-focus:ring-offset-background rounded-sm z-10 relative peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-accent-primary after:border-gray-300 after:border after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-surface-container-low"></div>
      </label>
    )
  }
)
Toggle.displayName = "Toggle"
