import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:brightness-110 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_0_rgba(0,0,0,0.15)]",
        destructive:
          "bg-destructive text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_1px_3px_0_rgba(0,0,0,0.1)] hover:brightness-110 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_12px_0_rgba(0,0,0,0.15)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-accent hover:text-accent-foreground hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_1px_2px_0_rgba(0,0,0,0.06)] hover:bg-secondary/70 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_2px_8px_0_rgba(0,0,0,0.08)]",
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

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
