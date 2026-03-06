import * as React from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Stat {
  label: string
  value: string | number
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  description?: string
}

export interface StatDashboardProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatDashboard({
  stats,
  columns = 4,
  className
}: StatDashboardProps) {
  const gridClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4"
  }[columns]
  
  return (
    <div className={cn(
      "grid grid-cols-1 gap-6 sm:grid-cols-2",
      gridClass,
      className
    )}>
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            {stat.icon && (
              <div className="text-primary">{stat.icon}</div>
            )}
          </div>
          
          <div className="mt-3">
            <p className="text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            
            {stat.trend && (
              <div className="mt-2 flex items-center gap-1">
                {stat.trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  stat.trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {stat.trend.value}
                </span>
              </div>
            )}
            
            {stat.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
