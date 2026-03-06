import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string
  description?: string
  error?: string
  loading?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    description, 
    error, 
    loading = false,
    prefix,
    suffix,
    id,
    disabled,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const descriptionId = `${inputId}-description`
    const errorId = `${inputId}-error`
    
    const InputElement = (
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-muted-foreground pointer-events-none">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            prefix && "pl-10",
            (suffix || loading) && "pr-10",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          disabled={disabled || loading}
          {...props}
        />
        
        {loading && (
          <span className="absolute right-3 text-muted-foreground pointer-events-none">
            <Loader2 className="size-4 animate-spin" />
          </span>
        )}
        
        {!loading && suffix && (
          <span className="absolute right-3 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    )
    
    if (!label && !description && !error) {
      return InputElement
    }
    
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {InputElement}
        
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
Input.displayName = "Input"

export { Input }
