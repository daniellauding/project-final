import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  link?: { label: string; href: string }
}

export interface FeatureGridProps {
  title: string
  description?: string
  features: Feature[]
  variant?: "plain" | "cards"
  className?: string
}

export function FeatureGrid({
  title,
  description,
  features,
  variant = "plain",
  className
}: FeatureGridProps) {
  return (
    <section className={cn("bg-background py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => {
              const content = (
                <>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <div className="text-primary">{feature.icon}</div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                    {feature.link && (
                      <p className="mt-6">
                        <a href={feature.link.href} className="text-sm font-semibold leading-6 text-primary hover:text-primary/80">
                          {feature.link.label} <span aria-hidden="true">→</span>
                        </a>
                      </p>
                    )}
                  </dd>
                </>
              )
              
              if (variant === "cards") {
                return (
                  <Card key={index} className="p-6">
                    {content}
                  </Card>
                )
              }
              
              return <div key={index}>{content}</div>
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
