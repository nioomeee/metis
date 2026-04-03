"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    
    // Uncontrolled state if checked is not provided
    const [internalChecked, setInternalChecked] = React.useState(false);
    
    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
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
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-primary peer-focus:ring-offset-2 peer-focus:ring-offset-background rounded-sm peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-accent-primary after:border-gray-300 after:border after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-surface-container-low"></div>
      </label>
    )
  }
)
Toggle.displayName = "Toggle"
