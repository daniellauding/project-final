# Component Patterns & Best Practices

**Date**: March 6, 2026  
**Author**: Agent 4 (Design System Research)  
**Version**: 1.0  
**Status**: Guidance Document

---

## Overview

This document outlines component composition patterns, slot architectures, and best practices derived from Material Design 3, Radix UI, shadcn/ui, and Chakra UI research.

**Key Patterns Covered**:
- Slot-based component architecture
- Polymorphic components (`as` prop)
- Compound components (Card.Header, Card.Footer)
- `asChild` composition pattern
- State management patterns
- Accessibility primitives

---

## 1. Slot Pattern Architecture

### 1.1 What is a Slot?

A **slot** is a named placeholder in a component where specific content goes. Instead of relying on children order, slots make component structure explicit.

**Without slots** (implicit, order-dependent):
```tsx
<Button>
  <SearchIcon />  {/* Is this leading or trailing? */}
  Search
</Button>
```

**With slots** (explicit, self-documenting):
```tsx
<Button>
  <Button.Icon slot="leading"><SearchIcon /></Button.Icon>
  Search
  <Button.Icon slot="trailing"><ChevronDownIcon /></Button.Icon>
</Button>
```

### 1.2 Common Slot Names

Based on Material Design 3 component anatomy:

**Icon Slots**:
- `leading` – Icon before text (search, back, menu)
- `trailing` – Icon after text (chevron, close, external link)
- `only` – Icon-only button (no text)

**Layout Slots**:
- `header` – Top section (title, actions)
- `body` / `content` – Main content area
- `footer` – Bottom section (actions, metadata)
- `aside` – Sidebar content
- `media` – Image/video section

**Component-Specific Slots**:
- `label` – Text label
- `description` – Helper text
- `error` – Error message
- `hint` – Hint text
- `prefix` – Before input field (icon, text)
- `suffix` – After input field (unit, button)

---

## 2. Button Component Enhancement

### 2.1 Current Implementation

```tsx
// ~/Work/pejla/frontend/src/components/ui/button.tsx
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
```

**Strengths**:
- ✅ Uses `asChild` for composition
- ✅ Uses CVA for variants
- ✅ Data attributes for styling hooks

**Gaps**:
- ❌ No explicit icon slots
- ❌ No loading state prop
- ❌ No polymorphic `as` prop (only `asChild`)

### 2.2 Enhanced Button Pattern

**Proposed API**:

```tsx
<Button
  variant="default | destructive | outline | secondary | ghost | link | tertiary"
  size="xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg"
  loading={boolean}
  loadingText="string"
  asChild={boolean}
  as="button | a | Link"
>
  <Button.Icon slot="leading"><SearchIcon /></Button.Icon>
  Button Text
  <Button.Icon slot="trailing"><ChevronIcon /></Button.Icon>
</Button>
```

**Implementation** (enhanced):

```tsx
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  as?: React.ElementType
  loading?: boolean
  loadingText?: string
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  as,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Determine component type
  const Comp = asChild ? Slot.Root : (as || "button")
  
  // Extract slot children
  const leadingIcon = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props?.slot === "leading"
  )
  const trailingIcon = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props?.slot === "trailing"
  )
  const textContent = React.Children.toArray(children).filter(
    (child) => !React.isValidElement(child) || !child.props?.slot
  )

  return (
    <Comp
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
          <Spinner className="size-4" />
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

// Icon slot component
function ButtonIcon({
  slot,
  className,
  children,
  ...props
}: { slot: "leading" | "trailing" | "only" } & React.ComponentProps<"span">) {
  return (
    <span
      data-slot={`button-icon-${slot}`}
      className={cn("inline-flex shrink-0", className)}
      {...props}
    >
      {children}
    </span>
  )
}

Button.Icon = ButtonIcon

export { Button, buttonVariants }
```

**Usage Examples**:

```tsx
// Leading icon
<Button variant="default">
  <Button.Icon slot="leading"><SearchIcon /></Button.Icon>
  Search
</Button>

// Trailing icon
<Button variant="outline">
  Open Menu
  <Button.Icon slot="trailing"><ChevronDownIcon /></Button.Icon>
</Button>

// Both icons
<Button variant="secondary">
  <Button.Icon slot="leading"><DownloadIcon /></Button.Icon>
  Download
  <Button.Icon slot="trailing"><ExternalLinkIcon /></Button.Icon>
</Button>

// Icon only
<Button size="icon">
  <Button.Icon slot="only"><SettingsIcon /></Button.Icon>
</Button>

// Loading state
<Button loading loadingText="Saving...">
  Save Changes
</Button>

// As link
<Button as="a" href="/dashboard">
  Dashboard
</Button>

// Composition with Radix
<Tooltip.Trigger asChild>
  <Button variant="ghost">
    <Button.Icon slot="only"><InfoIcon /></Button.Icon>
  </Button>
</Tooltip.Trigger>
```

### 2.3 Add Tertiary Variant

Based on TOKEN-ENHANCEMENT-PLAN.md:

```tsx
const buttonVariants = cva(
  "...", // base classes
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        tertiary: "bg-brand-tertiary text-brand-tertiary-foreground shadow-[var(--shadow-button-default)] hover:brightness-110",
        destructive: "...",
        outline: "...",
        secondary: "...",
        ghost: "...",
        link: "...",
      },
      size: { ... },
    },
  }
)
```

---

## 3. Card Component Enhancement

### 3.1 Current Implementation

```tsx
// ~/Work/pejla/frontend/src/components/ui/card.tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6",
        className
      )}
      {...props}
    />
  )
}

Card.Header = CardHeader
Card.Footer = CardFooter
Card.Title = CardTitle
Card.Action = CardAction
Card.Description = CardDescription
Card.Content = CardContent
```

**Strengths**:
- ✅ Compound component pattern
- ✅ Semantic slot names (Header, Footer, Content)
- ✅ Data-slot attributes

**Gaps**:
- ❌ No elevation variants (flat, raised, floating)
- ❌ No interactive states (clickable card)
- ❌ No media slot (for images/video)
- ❌ No `asChild` support

### 3.2 Enhanced Card Pattern

**Proposed API**:

```tsx
<Card
  elevation="flat | raised | floating"
  interactive={boolean}
  asChild={boolean}
  onPress={() => {}}
>
  <Card.Media>
    <img src="..." alt="..." />
  </Card.Media>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
    <Card.Action>
      <Button size="icon-sm">...</Button>
    </Card.Action>
  </Card.Header>
  <Card.Content>
    Content
  </Card.Content>
  <Card.Footer>
    Footer actions
  </Card.Footer>
</Card>
```

**Implementation** (enhanced):

```tsx
const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border transition-all duration-200",
  {
    variants: {
      elevation: {
        flat: "bg-surface-container-lowest shadow-none",
        raised: "bg-surface-container-low shadow-md",
        floating: "bg-surface-container-high shadow-xl",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-lg active:scale-[0.99]",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "raised",
      interactive: false,
    },
  }
)

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  asChild?: boolean
  onPress?: () => void
}

function Card({
  className,
  elevation = "raised",
  interactive = false,
  asChild = false,
  onPress,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot.Root : "div"
  
  const handleClick = interactive ? onPress : undefined

  return (
    <Comp
      data-slot="card"
      data-elevation={elevation}
      data-interactive={interactive}
      className={cn(cardVariants({ elevation, interactive, className }))}
      onClick={handleClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    />
  )
}

// Media slot component
function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn("overflow-hidden rounded-t-lg -mt-6 -mx-6", className)}
      {...props}
    />
  )
}

Card.Media = CardMedia
// ... other slots (Header, Footer, Content, etc.)
```

**Usage Examples**:

```tsx
// Flat card (no elevation)
<Card elevation="flat">
  <Card.Content>Simple card</Card.Content>
</Card>

// Raised card (default)
<Card elevation="raised">
  <Card.Header>
    <Card.Title>Poll Results</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card>

// Floating card (modal-like)
<Card elevation="floating">
  <Card.Header>
    <Card.Title>Dialog Card</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card>

// Interactive card (clickable)
<Card interactive onPress={() => router.push('/poll/123')}>
  <Card.Media>
    <img src="thumbnail.jpg" alt="Poll" />
  </Card.Media>
  <Card.Header>
    <Card.Title>What's your favorite color?</Card.Title>
    <Card.Description>1,234 votes • 2 days ago</Card.Description>
  </Card.Header>
</Card>

// Card with action menu
<Card>
  <Card.Header>
    <Card.Title>Project Dashboard</Card.Title>
    <Card.Action>
      <DropdownMenu>...</DropdownMenu>
    </Card.Action>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card>
```

---

## 4. Input Component Enhancement

### 4.1 Enhanced Input Pattern

**Proposed API**:

```tsx
<Input
  label="Email"
  description="We'll never share your email"
  error="Invalid email format"
  prefix={<MailIcon />}
  suffix={<Button>Verify</Button>}
  required
/>
```

**Implementation**:

```tsx
interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  description?: string
  error?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

function Input({
  label,
  description,
  error,
  prefix,
  suffix,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || useId()

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-muted-foreground">
            {prefix}
          </span>
        )}
        
        <input
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-base",
            prefix && "pl-10",
            suffix && "pr-10",
            error && "border-destructive ring-destructive/20",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-3 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      
      {description && !error && (
        <p id={`${inputId}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
```

**Usage Examples**:

```tsx
// Simple input with label
<Input label="Username" placeholder="Enter username" />

// Input with description
<Input
  label="Password"
  type="password"
  description="Must be at least 8 characters"
/>

// Input with error
<Input
  label="Email"
  type="email"
  error="Invalid email format"
  defaultValue="invalid@"
/>

// Input with prefix icon
<Input
  label="Search"
  prefix={<SearchIcon className="size-4" />}
  placeholder="Search polls..."
/>

// Input with suffix button
<Input
  label="Invite Code"
  suffix={<Button size="xs">Apply</Button>}
  placeholder="Enter code"
/>

// Required field
<Input label="Full Name" required />
```

---

## 5. Dialog Component Enhancement

### 5.1 Current Pattern (Radix-based)

Pejla likely uses Radix Dialog primitive. Enhance with better composition:

```tsx
<Dialog>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog description</Dialog.Description>
    </Dialog.Header>
    
    <Dialog.Body>
      {/* Content */}
    </Dialog.Body>
    
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### 5.2 Add Size Variants

```tsx
const dialogVariants = cva(
  "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background border rounded-lg shadow-xl",
  {
    variants: {
      size: {
        sm: "w-full max-w-md",
        md: "w-full max-w-lg",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

<Dialog.Content size="lg">...</Dialog.Content>
```

---

## 6. Polymorphic Component Pattern

### 6.1 `as` Prop Implementation

Allow components to render as different HTML elements or React components:

```tsx
type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"]

type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

// Usage in Button
type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  VariantProps<typeof buttonVariants>
>

function Button<C extends React.ElementType = "button">({
  as,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps<C>) {
  const Comp = as || "button"
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

**Usage**:

```tsx
// As button (default)
<Button>Click me</Button>

// As link
<Button as="a" href="/dashboard">Dashboard</Button>

// As Next.js Link
<Button as={Link} to="/profile">Profile</Button>

// As custom component
<Button as={CustomNavItem} route="/settings">Settings</Button>
```

---

## 7. State Management Patterns

### 7.1 Controlled vs Uncontrolled

**Uncontrolled** (component manages state):
```tsx
function Toggle() {
  const [checked, setChecked] = useState(false)
  
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  )
}
```

**Controlled** (parent manages state):
```tsx
function Form() {
  const [toggled, setToggled] = useState(false)
  
  return (
    <Toggle
      checked={toggled}
      onCheckedChange={setToggled}
    />
  )
}
```

**Best Practice**: Support both patterns:

```tsx
interface ToggleProps {
  checked?: boolean                    // Controlled
  defaultChecked?: boolean             // Uncontrolled
  onCheckedChange?: (checked: boolean) => void
}

function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  
  const checked = controlledChecked ?? internalChecked
  const setChecked = onCheckedChange ?? setInternalChecked
  
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  )
}

// Usage (uncontrolled)
<Toggle defaultChecked={false} />

// Usage (controlled)
const [checked, setChecked] = useState(false)
<Toggle checked={checked} onCheckedChange={setChecked} />
```

### 7.2 Render Props Pattern

Expose internal state via render props:

```tsx
<Disclosure>
  {({ open }) => (
    <>
      <Disclosure.Button>
        {open ? "Hide" : "Show"} Details
      </Disclosure.Button>
      <Disclosure.Panel>
        Details content
      </Disclosure.Panel>
    </>
  )}
</Disclosure>
```

---

## 8. Accessibility Patterns

### 8.1 ARIA Labeling

**Label associations**:
```tsx
// Explicit association (best for custom components)
<Label htmlFor="email-input">Email</Label>
<Input id="email-input" />

// Implicit association (simpler, but less flexible)
<label>
  Email
  <input />
</label>

// aria-label (no visible label)
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

// aria-labelledby (label elsewhere)
<div id="dialog-title">Confirm Delete</div>
<Dialog aria-labelledby="dialog-title">...</Dialog>
```

### 8.2 Keyboard Navigation

**Focus management**:
```tsx
// Trap focus in modal
<Dialog>
  <FocusTrap>
    <Dialog.Content>...</Dialog.Content>
  </FocusTrap>
</Dialog>

// Roving tabindex (tabs, menus)
<Tabs>
  <TabList>
    <Tab tabIndex={0}>Tab 1</Tab>  {/* First tab tabbable */}
    <Tab tabIndex={-1}>Tab 2</Tab> {/* Others not in tab order */}
    <Tab tabIndex={-1}>Tab 3</Tab>
  </TabList>
</Tabs>

// Arrow key navigation (Radix handles this)
<RadioGroup>
  <RadioGroupItem value="1" />
  <RadioGroupItem value="2" />
  <RadioGroupItem value="3" />
</RadioGroup>
```

**Keyboard shortcuts**:
```tsx
// Escape to close
<Dialog onEscapeKeyDown={(e) => setOpen(false)}>...</Dialog>

// Enter to submit
<form onSubmit={(e) => { e.preventDefault(); submit() }}>
  <Input onKeyDown={(e) => e.key === "Enter" && submit()} />
</form>
```

### 8.3 Live Regions

Announce dynamic content to screen readers:

```tsx
// Polite announcement (wait for user pause)
<div role="status" aria-live="polite">
  {successMessage}
</div>

// Assertive announcement (interrupt)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Example: Form submission
function Form() {
  const [status, setStatus] = useState("")
  
  const submit = async () => {
    setStatus("Submitting...")
    await api.submit()
    setStatus("Submitted successfully!")
  }
  
  return (
    <form onSubmit={submit}>
      {/* Form fields */}
      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
    </form>
  )
}
```

---

## 9. Composition Examples

### 9.1 Tooltip + Button

```tsx
<Tooltip>
  <Tooltip.Trigger asChild>
    <Button variant="ghost" size="icon">
      <HelpIcon />
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    Get help with this feature
  </Tooltip.Content>
</Tooltip>
```

### 9.2 Dialog + Form

```tsx
<Dialog>
  <Dialog.Trigger asChild>
    <Button>Create Poll</Button>
  </Dialog.Trigger>
  
  <Dialog.Content size="lg">
    <Dialog.Header>
      <Dialog.Title>Create New Poll</Dialog.Title>
      <Dialog.Description>
        Fill in the details below to create a poll
      </Dialog.Description>
    </Dialog.Header>
    
    <form onSubmit={handleSubmit}>
      <Dialog.Body>
        <Input label="Poll Question" required />
        <Input label="Option 1" required />
        <Input label="Option 2" required />
      </Dialog.Body>
      
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button type="submit">Create Poll</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog>
```

### 9.3 DropdownMenu + Button

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline">
      Options
      <Button.Icon slot="trailing"><ChevronDownIcon /></Button.Icon>
    </Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.Item onSelect={() => edit()}>
      <EditIcon /> Edit
    </DropdownMenu.Item>
    <DropdownMenu.Item onSelect={() => duplicate()}>
      <CopyIcon /> Duplicate
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      variant="destructive"
      onSelect={() => deletePoll()}
    >
      <TrashIcon /> Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

---

## 10. Component Testing Patterns

### 10.1 Accessibility Testing

```tsx
import { render, screen } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

test("Button has no accessibility violations", async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

test("Input is properly labeled", () => {
  render(<Input label="Email" />)
  const input = screen.getByLabelText("Email")
  expect(input).toBeInTheDocument()
})

test("Error message is associated with input", () => {
  render(<Input label="Email" error="Invalid email" />)
  const input = screen.getByLabelText("Email")
  expect(input).toHaveAttribute("aria-invalid", "true")
  expect(input).toHaveAccessibleDescription("Invalid email")
})
```

### 10.2 Keyboard Testing

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

test("Dialog closes on Escape key", async () => {
  const user = userEvent.setup()
  const onClose = jest.fn()
  
  render(
    <Dialog open onOpenChange={onClose}>
      <Dialog.Content>Content</Dialog.Content>
    </Dialog>
  )
  
  await user.keyboard("{Escape}")
  expect(onClose).toHaveBeenCalledWith(false)
})

test("Button activates on Enter and Space", async () => {
  const user = userEvent.setup()
  const onClick = jest.fn()
  
  render(<Button onClick={onClick}>Click me</Button>)
  
  const button = screen.getByRole("button")
  button.focus()
  
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
  
  await user.keyboard(" ")
  expect(onClick).toHaveBeenCalledTimes(2)
})
```

---

## Summary Checklist

### For Each Component:

**Structure**:
- [ ] Uses CVA for variants (size, variant, color)
- [ ] Supports `asChild` prop (Radix composition)
- [ ] Supports polymorphic `as` prop (render as different element)
- [ ] Has explicit slot components (Header, Footer, Icon, etc.)
- [ ] Uses data attributes for styling hooks

**States**:
- [ ] Supports controlled and uncontrolled patterns
- [ ] Has loading state (if applicable)
- [ ] Has error state (if applicable)
- [ ] Has disabled state
- [ ] Has focus-visible state

**Accessibility**:
- [ ] Proper ARIA attributes (role, aria-label, aria-describedby)
- [ ] Keyboard navigation (Tab, Enter, Space, Escape, Arrows)
- [ ] Focus management (focus trap, roving tabindex)
- [ ] Screen reader announcements (live regions)
- [ ] Color contrast WCAG AA (4.5:1 text, 3:1 UI)

**Composition**:
- [ ] Composes with Radix primitives (Tooltip, Dialog, DropdownMenu)
- [ ] Can be used in compound patterns (ButtonGroup, Form)
- [ ] Exposes internal state via render props (if applicable)

**Documentation**:
- [ ] Storybook story with all variants
- [ ] Usage examples (simple, advanced, composition)
- [ ] Accessibility notes
- [ ] Keyboard shortcuts documented

---

**End of Component Patterns Document**

Next steps:
1. Apply patterns to existing components (Button, Card, Input)
2. Create new components following these patterns
3. Document in Storybook with live examples
4. Run accessibility audits (axe, Lighthouse)
