import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    text: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex min-h-[400px] items-center justify-center rounded-lg bg-background p-12",
      className
    )}>
      <div className="text-center max-w-md">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
        
        <h3 className="mt-6 text-xl font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
        
        {action && (
          <div className="mt-6">
            <Button asChild={!!action.href} onClick={action.onClick}>
              {action.href ? (
                <a href={action.href} className="inline-flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
