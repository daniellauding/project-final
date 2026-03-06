import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: string
    annual: string
  }
  features: string[]
  cta: string
  href: string
  popular?: boolean
}

export interface PricingTableProps {
  title?: string
  description?: string
  tiers: PricingTier[]
  billingPeriod?: "monthly" | "annual"
  onPeriodChange?: (period: "monthly" | "annual") => void
  className?: string
}

export function PricingTable({
  title = "Pricing plans for teams of all sizes",
  description,
  tiers,
  billingPeriod = "monthly",
  onPeriodChange,
  className
}: PricingTableProps) {
  const [period, setPeriod] = React.useState<"monthly" | "annual">(billingPeriod)
  
  const handlePeriodChange = (newPeriod: "monthly" | "annual") => {
    setPeriod(newPeriod)
    onPeriodChange?.(newPeriod)
  }
  
  return (
    <section className={cn("bg-background py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {/* Billing toggle */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200 dark:ring-gray-800">
            <button
              onClick={() => handlePeriodChange("monthly")}
              className={cn(
                "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
                period === "monthly" && "bg-primary text-white"
              )}
            >
              Monthly billing
            </button>
            <button
              onClick={() => handlePeriodChange("annual")}
              className={cn(
                "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
                period === "annual" && "bg-primary text-white"
              )}
            >
              Annual billing
            </button>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "p-8 xl:p-10",
                tier.popular && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-foreground">
                  {tier.name}
                </h3>
                {tier.popular && (
                  <Badge>Most popular</Badge>
                )}
              </div>
              
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {tier.price[period]}
                </span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">
                  /{period === "monthly" ? "month" : "year"}
                </span>
              </p>
              
              <Button
                variant={tier.popular ? "default" : "outline"}
                className="mt-6 w-full"
                asChild
              >
                <a href={tier.href}>{tier.cta}</a>
              </Button>
              
              <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
