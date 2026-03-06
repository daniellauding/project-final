import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border transition-all duration-200",
  {
    variants: {
      elevation: {
        flat: "bg-surface-container-lowest shadow-none border-outline",
        raised: "bg-surface-container-low shadow-md border-transparent",
        floating: "bg-surface-container-high shadow-xl border-transparent",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "raised",
      interactive: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
  onPress?: () => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, interactive, asChild = false, onPress, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    const handleClick = onPress || onClick
    const isInteractive = !!handleClick || interactive
    
    return (
      <Comp
        ref={ref}
        data-slot="card"
        data-elevation={elevation}
        data-interactive={isInteractive}
        className={cn(cardVariants({ elevation, interactive: isInteractive, className }), "py-6")}
        onClick={handleClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={isInteractive ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick?.(e as any)
          }
        } : undefined}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-media"
      className={cn("overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-0", className)}
      {...props}
    />
  )
)
CardMedia.displayName = "CardMedia"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
)
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

const CardActions = CardFooter
CardActions.displayName = "CardActions"

export {
  Card,
  CardMedia,
  CardHeader,
  CardFooter,
  CardActions,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
