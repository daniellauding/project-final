import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string
  description?: string
  error?: string
  loading?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    loading = false,
    id,
    disabled,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId()
    const descriptionId = `${textareaId}-description`
    const errorId = `${textareaId}-error`
    
    const TextareaElement = (
      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          data-slot="textarea"
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            loading && "pr-10",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          disabled={disabled || loading}
          {...props}
        />
        
        {loading && (
          <span className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
            <Loader2 className="size-4 animate-spin" />
          </span>
        )}
      </div>
    )
    
    if (!label && !description && !error) {
      return TextareaElement
    }
    
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {TextareaElement}
        
        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
