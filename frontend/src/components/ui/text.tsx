import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva("", {
  variants: {
    variant: {
      display: "text-4xl font-bold tracking-tight",
      h1: "text-3xl font-bold tracking-tight",
      h2: "text-2xl font-semibold tracking-tight",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      h5: "text-base font-semibold",
      h6: "text-sm font-semibold",
      body: "text-base",
      "body-sm": "text-sm",
      caption: "text-sm",
      overline: "text-xs uppercase tracking-wide font-medium",
      label: "text-sm font-medium",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
})

export interface TextProps<C extends React.ElementType = "p">
  extends React.ComponentPropsWithoutRef<C>,
    VariantProps<typeof textVariants> {
  as?: C
  asChild?: boolean
}

const Text = React.forwardRef(
  <C extends React.ElementType = "p">(
    { 
      className, 
      variant, 
      color, 
      align,
      weight,
      as, 
      asChild = false, 
      ...props 
    }: TextProps<C>,
    ref: React.ForwardedRef<any>
  ) => {
    // Determine the component to render
    const Comp = asChild ? Slot : (as || "p")
    
    return (
      <Comp
        ref={ref}
        data-slot="text"
        data-variant={variant}
        className={cn(textVariants({ variant, color, align, weight, className }))}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text, textVariants }
