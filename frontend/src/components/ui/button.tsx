import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--shadow-button-default)] hover:brightness-110 hover:shadow-[var(--shadow-button-hover)]",
        destructive:
          "bg-destructive text-white shadow-[var(--shadow-button-destructive)] hover:brightness-110 hover:shadow-[var(--shadow-button-hover)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-[var(--shadow-button-outline)] hover:bg-accent hover:text-accent-foreground hover:shadow-[var(--shadow-button-outline-hover)] dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-button-secondary)] hover:bg-secondary/70 hover:shadow-[var(--shadow-button-secondary-hover)]",
        tertiary:
          "bg-brand-tertiary text-brand-tertiary-foreground shadow-[var(--shadow-button-default)] hover:brightness-110 hover:shadow-[var(--shadow-button-hover)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 text-[15px] has-[>svg]:px-5",
        xs: "h-8 gap-1 px-4 text-xs has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-5 text-sm has-[>svg]:px-4",
        lg: "h-12 px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Extract icon slots from children
    const childArray = React.Children.toArray(children)
    const leadingIcon = childArray.find((child) => 
      React.isValidElement(child) && child.props?.slot === "leading"
    )
    const trailingIcon = childArray.find((child) =>
      React.isValidElement(child) && child.props?.slot === "trailing"
    )
    const textContent = childArray.filter((child) =>
      !React.isValidElement(child) || (child.props?.slot !== "leading" && child.props?.slot !== "trailing")
    )
    
    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText || textContent}
          </>
        ) : (
          <>
            {leadingIcon}
            {textContent}
            {trailingIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Icon slot component
const ButtonIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { slot: "leading" | "trailing" }
>(({ slot, className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot={`button-icon-${slot}`}
      className={cn("inline-flex shrink-0", className)}
      {...props}
    >
      {children}
    </span>
  )
})
ButtonIcon.displayName = "ButtonIcon"

export { Button, ButtonIcon, buttonVariants }
