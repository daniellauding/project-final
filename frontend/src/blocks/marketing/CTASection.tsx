import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface CTASectionProps {
  title: string
  subtitle?: string
  cta?: {
    text: string
    href?: string
    onClick?: () => void
  }
  emailCapture?: {
    placeholder?: string
    buttonText?: string
    onSubmit?: (email: string) => void
  }
  className?: string
}

export function CTASection({
  title,
  subtitle,
  cta,
  emailCapture,
  className
}: CTASectionProps) {
  const [email, setEmail] = React.useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailCapture?.onSubmit) {
      emailCapture.onSubmit(email)
      setEmail("")
    }
  }
  
  return (
    <section className={cn("bg-primary py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              {subtitle}
            </p>
          )}
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {cta && (
              <Button 
                size="lg" 
                variant="secondary"
                asChild={!!cta.href} 
                onClick={cta.onClick}
              >
                {cta.href ? (
                  <a href={cta.href}>{cta.text}</a>
                ) : (
                  cta.text
                )}
              </Button>
            )}
            
            {emailCapture && (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-x-4">
                <Input
                  type="email"
                  required
                  placeholder={emailCapture.placeholder || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-auto bg-white/10 text-white placeholder:text-white/60 border-white/20 focus:border-white"
                />
                <Button type="submit" variant="secondary" size="default">
                  {emailCapture.buttonText || "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
