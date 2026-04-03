import { cn } from "@/lib/utils"

export interface StatusDotProps {
  status: 'active' | 'warning' | 'error' | 'offline';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ status, pulse = false, className }: StatusDotProps) {
  let colorClass = "bg-on-surface-variant"
  let shadowClass = ""

  switch (status) {
    case 'active':
      colorClass = "bg-accent-secondary" // Neon cyan for active
      shadowClass = "shadow-[0_0_8px_rgba(76,201,240,0.6)]"
      break
    case 'warning':
      colorClass = "bg-accent-tertiary" // Tertiary gold
      shadowClass = "shadow-[0_0_8px_rgba(226,198,45,0.6)]"
      break
    case 'error':
      colorClass = "bg-error"
      shadowClass = "shadow-[0_0_8px_rgba(247,37,133,0.6)]"
      break
    case 'offline':
    default:
      colorClass = "bg-on-surface-variant/50"
      break
  }

  return (
    <div className={cn("relative flex h-2 w-2 items-center justify-center", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            colorClass
          )}
        />
      )}
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colorClass, shadowClass)} />
    </div>
  )
}
