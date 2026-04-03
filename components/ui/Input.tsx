import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <input
          type={type}
          className={cn(
            "metis-input flex h-10 w-full px-3 py-2 text-sm peer",
            className
          )}
          ref={ref}
          placeholder=" "
          {...props}
        />
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
