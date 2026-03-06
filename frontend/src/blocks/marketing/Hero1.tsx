import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Hero1Props {
  badge?: string
  title: string
  subtitle: string
  ctaPrimary: { text: string; href?: string; onClick?: () => void }
  ctaSecondary?: { text: string; href?: string; onClick?: () => void }
  backgroundImage?: string
  media?: { src: string; alt: string }
  className?: string
}

export function Hero1({
  badge,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  media,
  className
}: Hero1Props) {
  return (
    <section 
      className={cn(
        "relative flex min-h-[600px] items-center justify-center bg-background px-6 py-24",
        className
      )}
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          {badge && (
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
          )}
          
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild={!!ctaPrimary.href} onClick={ctaPrimary.onClick}>
              {ctaPrimary.href ? (
                <a href={ctaPrimary.href}>{ctaPrimary.text}</a>
              ) : (
                ctaPrimary.text
              )}
            </Button>
            
            {ctaSecondary && (
              <Button 
                size="lg" 
                variant="outline" 
                asChild={!!ctaSecondary.href} 
                onClick={ctaSecondary.onClick}
              >
                {ctaSecondary.href ? (
                  <a href={ctaSecondary.href}>{ctaSecondary.text}</a>
                ) : (
                  ctaSecondary.text
                )}
              </Button>
            )}
          </div>
        </div>
        
        {media && (
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-gray-100/5 dark:ring-gray-100/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src={media.src}
                alt={media.alt}
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
