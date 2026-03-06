import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Hero2Feature {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
}

export interface Hero2Props {
  headline: string
  subtitle: string
  features?: Hero2Feature[]
  cta: { text: string; href?: string; onClick?: () => void }
  media: { src: string; alt: string }
  reverse?: boolean
  className?: string
}

export function Hero2({
  headline,
  subtitle,
  features,
  cta,
  media,
  reverse = false,
  className
}: Hero2Props) {
  return (
    <section className={cn("overflow-hidden bg-background py-20 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={cn(
          "mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2",
          reverse && "lg:grid-flow-col-dense"
        )}>
          <div className={cn("lg:pr-8 lg:pt-4", reverse && "lg:col-start-2 lg:pl-8 lg:pr-0")}>
            <div className="lg:max-w-lg">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {headline}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {subtitle}
              </p>
              
              {features && (
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-foreground">
                        <feature.icon className="absolute left-1 top-1 h-5 w-5 text-primary" />
                        {feature.name}
                      </dt>
                      <dd className="inline"> {feature.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
              
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" asChild={!!cta.href} onClick={cta.onClick}>
                  {cta.href ? (
                    <a href={cta.href}>{cta.text}</a>
                  ) : (
                    cta.text
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-start justify-end",
            reverse && "lg:col-start-1"
          )}>
            <img
              src={media.src}
              alt={media.alt}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
