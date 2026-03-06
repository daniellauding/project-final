import * as React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TestimonialItem {
  quote: string
  author: {
    name: string
    role: string
    company: string
    avatar?: string
  }
}

export interface TestimonialProps {
  testimonials: TestimonialItem[]
  autoplay?: boolean
  interval?: number
  className?: string
}

export function Testimonial({
  testimonials,
  autoplay = false,
  interval = 5000,
  className
}: TestimonialProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }
  
  React.useEffect(() => {
    if (!autoplay) return
    
    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, currentIndex])
  
  const current = testimonials[currentIndex]
  
  return (
    <section className={cn("bg-background py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="mx-auto max-w-3xl p-8 lg:p-12">
          <figure className="text-center">
            <blockquote className="text-xl font-semibold leading-8 text-foreground sm:text-2xl sm:leading-9">
              <p>"{current.quote}"</p>
            </blockquote>
            
            <figcaption className="mt-10">
              <div className="flex items-center justify-center space-x-3">
                <Avatar className="h-10 w-10">
                  {current.author.avatar && (
                    <img src={current.author.avatar} alt={current.author.name} />
                  )}
                  {!current.author.avatar && (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-white">
                      {current.author.name.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <div className="text-base">
                  <div className="font-semibold text-foreground">{current.author.name}</div>
                  <div className="text-muted-foreground">
                    {current.author.role} at {current.author.company}
                  </div>
                </div>
              </div>
            </figcaption>
          </figure>
          
          {testimonials.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      index === currentIndex ? "bg-primary" : "bg-muted"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
