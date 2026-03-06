import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FormStep {
  id: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface MultiStepFormProps {
  steps: FormStep[]
  onComplete?: (data: any) => void
  onStepChange?: (step: number) => void
  defaultStep?: number
  showProgress?: boolean
  className?: string
}

export function MultiStepForm({
  steps,
  onComplete,
  onStepChange,
  defaultStep = 0,
  showProgress = true,
  className
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = React.useState(defaultStep)
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100
  
  const goToNext = () => {
    if (!isLastStep) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange?.(nextStep)
    } else {
      onComplete?.(formData)
    }
  }
  
  const goToPrevious = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
      onStepChange?.(step)
    }
  }
  
  const currentStepData = steps[currentStep]
  
  return (
    <Card className={cn("mx-auto max-w-2xl", className)}>
      <div className="p-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
          
          {showProgress && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {/* Step indicators */}
          <div className="mt-4 flex items-center justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  index === currentStep
                    ? "bg-primary text-white"
                    : index < currentStep
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                aria-label={`Go to ${step.title}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-sm text-muted-foreground mb-6">
              {currentStepData.description}
            </p>
          )}
          
          <div className="space-y-6">
            {currentStepData.content}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={isFirstStep}
          >
            Previous
          </Button>
          
          <Button onClick={goToNext}>
            {isLastStep ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
