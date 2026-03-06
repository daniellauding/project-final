# Block Library Proposal

**Date**: March 6, 2026  
**Author**: Agent 4 (Design System Research)  
**Version**: 1.0  
**Status**: Proposal (Not Implemented)

---

## Overview

This document proposes a comprehensive block library for Pejla – a collection of 15 pre-built, reusable page blocks that combine Pejla's UI components into common layout patterns.

**Inspiration**: Tailwind UI, shadcn/ui blocks, Chakra Templates, and Material Design 3 layouts.

**Goal**: Enable rapid prototyping and consistent design patterns across Pejla's marketing site and app.

---

## What is a Block?

A **block** is a pre-composed, ready-to-use section of a page made from existing UI components. Unlike components (Button, Card, Input), blocks are higher-level patterns (Hero, Pricing, Feature Grid).

**Characteristics**:
- **Composable**: Built from existing Storybook components
- **Variants**: Multiple visual styles (light/dark, left/right, 2-column/3-column)
- **Responsive**: Mobile-first, adapts to all screen sizes
- **Copy-paste ready**: Export as code snippet
- **Documented**: Storybook story with live editor

**Not**:
- Not one-size-fits-all (customizable via props/slots)
- Not rigid (can be broken apart and reassembled)
- Not separate components (reuses existing component library)

---

## Block Categories

### 1. Marketing Blocks (6)
For landing pages, marketing site, product pages.

### 2. App Blocks (6)
For app UI, dashboards, settings, user profiles.

### 3. Form Blocks (3)
For multi-step forms, file uploads, search/filter UI.

---

## Marketing Blocks

### Block 1: Hero-1 (Centered)

**Purpose**: Homepage hero, product launch page, campaign landing page.

**Layout**:
```
┌─────────────────────────────────────────┐
│          [Badge: New Feature]           │
│                                         │
│        Large Headline Text Here         │
│                                         │
│      Subtitle explaining the value      │
│        proposition in 1-2 lines         │
│                                         │
│    [Primary CTA]  [Secondary CTA]       │
│                                         │
│     [Screenshot or Product Image]       │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Badge` (new/beta label)
- `Heading` (custom typography component)
- `Text` (subtitle)
- `Button` (primary + secondary CTAs)
- `Image` or `Video` (hero media)

**Variants**:
1. **With badge**: Promotional label above headline
2. **Without badge**: Clean headline only
3. **With video**: Embedded video instead of image
4. **With background**: Full-width background image/gradient

**Code Example**:

```tsx
export function HeroBlock({
  badge,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
  media,
  variant = "default"
}: HeroBlockProps) {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {badge && (
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
          )}
          
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {headline}
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <a href={primaryCta.href}>{primaryCta.label}</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={secondaryCta.href}>{secondaryCta.label}</a>
            </Button>
          </div>
        </div>
        
        {media && (
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src={media.src}
                alt={media.alt}
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```

**Usage**:

```tsx
<HeroBlock
  badge="New in 2026"
  headline="Get better feedback on your designs"
  subtitle="Pejla helps you collect structured design feedback from your team and stakeholders."
  primaryCta={{ label: "Start Free Trial", href: "/signup" }}
  secondaryCta={{ label: "Watch Demo", href: "/demo" }}
  media={{ src: "/dashboard-preview.png", alt: "Pejla Dashboard" }}
/>
```

---

### Block 2: Hero-2 (Split Layout)

**Purpose**: Feature pages, product showcases, about pages.

**Layout**:
```
┌─────────────────┬─────────────────┐
│  Large Headline │                 │
│                 │     [Image      │
│  Subtitle text  │      or         │
│  goes here with │     Video]      │
│  more room      │                 │
│                 │                 │
│  [CTA Buttons]  │                 │
│                 │                 │
└─────────────────┴─────────────────┘
```

**Components Used**:
- `Heading`, `Text`, `Button` (left side)
- `Image` or `Video` (right side)

**Variants**:
1. **Image left, text right**: Reverse layout
2. **Dark background**: White text on dark surface
3. **Gradient background**: Colorful gradient
4. **Video embed**: Embedded video player

**Code Example**:

```tsx
export function HeroSplitBlock({
  headline,
  subtitle,
  features,
  cta,
  media,
  reverse = false
}: HeroSplitBlockProps) {
  return (
    <section className="overflow-hidden bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={cn(
          "mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2",
          reverse && "lg:grid-flow-col-dense"
        )}>
          <div className={cn("lg:pr-8 lg:pt-4", reverse && "lg:col-start-2 lg:pl-8 lg:pr-0")}>
            <div className="lg:max-w-lg">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {headline}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {subtitle}
              </p>
              
              {features && (
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-foreground">
                        <feature.icon className="absolute left-1 top-1 h-5 w-5 text-primary" />
                        {feature.name}
                      </dt>
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
              
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" asChild>
                  <a href={cta.href}>{cta.label}</a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-start justify-end",
            reverse && "lg:col-start-1"
          )}>
            <img
              src={media.src}
              alt={media.alt}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

### Block 3: Feature Grid (3-Column)

**Purpose**: Feature pages, service offerings, benefits list.

**Layout**:
```
┌──────────┬──────────┬──────────┐
│  [Icon]  │  [Icon]  │  [Icon]  │
│          │          │          │
│ Feature  │ Feature  │ Feature  │
│  Name    │  Name    │  Name    │
│          │          │          │
│ Short    │ Short    │ Short    │
│ descrip- │ descrip- │ descrip- │
│ tion     │ tion     │ tion     │
└──────────┴──────────┴──────────┘
```

**Components Used**:
- `Card` (optional, for bordered variant)
- Icon (from lucide-react or custom SVG)
- `Heading`, `Text`

**Variants**:
1. **Plain**: No card, just icon + text
2. **Cards**: Each feature in a Card component
3. **Hover effects**: Lift card on hover
4. **2-column**: Responsive (2-col on mobile, 3-col on desktop)

**Code Example**:

```tsx
export function FeatureGridBlock({
  title,
  description,
  features,
  variant = "plain"
}: FeatureGridBlockProps) {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const content = (
                <>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <feature.icon className="h-5 w-5 flex-none text-primary" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                    {feature.link && (
                      <p className="mt-6">
                        <a href={feature.link.href} className="text-sm font-semibold leading-6 text-primary">
                          {feature.link.label} <span aria-hidden="true">→</span>
                        </a>
                      </p>
                    )}
                  </dd>
                </>
              )
              
              if (variant === "cards") {
                return (
                  <Card key={feature.name} elevation="raised" className="p-6">
                    {content}
                  </Card>
                )
              }
              
              return <div key={feature.name}>{content}</div>
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
```

---

### Block 4: Pricing Table (3-Tier)

**Purpose**: Pricing page, subscription plans, feature comparison.

**Layout**:
```
┌──────────┬──────────┬──────────┐
│  Free    │ Pro      │ Enterprise│
│          │ [Popular]│          │
│  $0/mo   │ $29/mo   │ Custom   │
│          │          │          │
│ [Features│ [Features│ [Features│
│  list]   │  list]   │  list]   │
│          │          │          │
│ [CTA]    │ [CTA]    │ [CTA]    │
└──────────┴──────────┴──────────┘
```

**Components Used**:
- `Card` (each pricing tier)
- `Badge` ("Popular" label)
- `Button` (CTA for each tier)
- `CheckIcon` (feature checkmarks)

**Variants**:
1. **Highlight middle**: Popular tier elevated
2. **Annual toggle**: Switch monthly/annual pricing
3. **Feature comparison**: Table with ✓/✗ per feature
4. **Compact**: Single column on mobile

**Code Example**:

```tsx
export function PricingTableBlock({
  tiers,
  billingPeriod = "monthly"
}: PricingTableBlockProps) {
  const [period, setPeriod] = useState<"monthly" | "annual">(billingPeriod)
  
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pricing plans for teams of all sizes
          </h2>
        </div>
        
        {/* Billing toggle */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
            <button
              onClick={() => setPeriod("monthly")}
              className={cn(
                "cursor-pointer rounded-full px-2.5 py-1",
                period === "monthly" && "bg-primary text-white"
              )}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={cn(
                "cursor-pointer rounded-full px-2.5 py-1",
                period === "annual" && "bg-primary text-white"
              )}
            >
              Annual billing
            </button>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              elevation={tier.popular ? "floating" : "raised"}
              className={cn(
                "p-8 xl:p-10",
                tier.popular && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-foreground">
                  {tier.name}
                </h3>
                {tier.popular && (
                  <Badge variant="default">Most popular</Badge>
                )}
              </div>
              
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {tier.price[period]}
                </span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">
                  /{period === "monthly" ? "month" : "year"}
                </span>
              </p>
              
              <Button
                variant={tier.popular ? "default" : "outline"}
                className="mt-6 w-full"
                asChild
              >
                <a href={tier.href}>{tier.cta}</a>
              </Button>
              
              <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### Block 5: Testimonial Carousel

**Purpose**: Social proof, customer quotes, case studies.

**Layout**:
```
┌─────────────────────────────────────────┐
│  "Pejla transformed our design review   │
│   process. Highly recommended!"         │
│                                         │
│   [Avatar] Sarah Johnson               │
│            Head of Design, Acme Corp    │
│                                         │
│        [← Prev]  [Next →]              │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Avatar` (customer photo)
- `Card` (optional, for bordered variant)
- `Button` (carousel navigation)
- `Text` (quote + attribution)

---

### Block 6: CTA Section (Full-Width)

**Purpose**: Newsletter signup, trial signup, contact form.

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│       Ready to get better feedback?     │
│                                         │
│  Start your free trial today. No credit │
│  card required.                         │
│                                         │
│   [Email Input]  [Get Started Button]   │
│                                         │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Heading`, `Text`
- `Input` (email)
- `Button` (submit)

---

## App Blocks

### Block 7: Settings Panel (Sidebar + Content)

**Purpose**: User settings, preferences, profile pages.

**Layout**:
```
┌──────────┬──────────────────────────┐
│ General  │  General Settings        │
│ Security │                          │
│ Billing  │  [Form Fields]           │
│ Team     │                          │
│          │  [Save Button]           │
└──────────┴──────────────────────────┘
```

**Components Used**:
- Sidebar navigation (custom or Tabs)
- `Card` (settings sections)
- `Input`, `Label`, `Button` (form elements)

---

### Block 8: Empty State

**Purpose**: No results, empty list, onboarding.

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│             [Large Icon]                │
│                                         │
│          No polls created yet           │
│                                         │
│  Create your first poll to get started  │
│  collecting feedback from your team.    │
│                                         │
│          [Create First Poll]            │
│                                         │
└─────────────────────────────────────────┘
```

**Components Used**:
- Icon (large, muted)
- `Heading`, `Text`
- `Button` (primary action)

**Code Example**:

```tsx
export function EmptyStateBlock({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateBlockProps) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">
        <Button asChild>
          <a href={action.href}>
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            {action.label}
          </a>
        </Button>
      </div>
    </div>
  )
}
```

**Usage**:

```tsx
<EmptyStateBlock
  icon={FileQuestionIcon}
  title="No polls created yet"
  description="Create your first poll to get started collecting feedback."
  action={{ label: "Create Poll", href: "/polls/new" }}
/>
```

---

### Block 9: Data Table

**Purpose**: List view, admin tables, data grids.

**Layout**:
```
┌─────────────────────────────────────────┐
│ [Search]           [Filter] [Actions]   │
├─────────┬──────────┬──────────┬────────┤
│ Name    │ Status   │ Votes    │ Actions│
├─────────┼──────────┼──────────┼────────┤
│ Poll 1  │ Active   │ 123      │ [•••]  │
│ Poll 2  │ Draft    │ 0        │ [•••]  │
│ Poll 3  │ Closed   │ 456      │ [•••]  │
├─────────┴──────────┴──────────┴────────┤
│                [Pagination]             │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Input` (search)
- `DropdownMenu` (filters, actions)
- `Table` (data grid)
- `Badge` (status)
- `Pagination` (page navigation)

---

### Block 10: Stat Dashboard (4-Column KPIs)

**Purpose**: Dashboard, analytics, metrics overview.

**Layout**:
```
┌──────────┬──────────┬──────────┬──────────┐
│ Total    │ Active   │ Avg      │ Response │
│ Polls    │ Users    │ Rating   │ Rate     │
│          │          │          │          │
│  142     │  1,234   │  4.8★    │  87%     │
│ +12% ↗  │ +3% ↗   │ +0.2 ↗  │ -2% ↘   │
└──────────┴──────────┴──────────┴──────────┘
```

**Components Used**:
- `Card` (stat card)
- `Heading`, `Text` (label, value)
- `Badge` or colored arrow (trend indicator)

**Code Example**:

```tsx
export function StatDashboardBlock({
  stats
}: StatDashboardBlockProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} elevation="raised" className="p-6">
          <dt className="text-sm font-medium text-muted-foreground">
            {stat.name}
          </dt>
          <dd className="mt-2 flex items-baseline gap-x-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </span>
            {stat.change && (
              <span className={cn(
                "text-sm font-medium",
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              )}>
                {stat.change}
              </span>
            )}
          </dd>
        </Card>
      ))}
    </div>
  )
}
```

---

### Block 11: Activity Feed (Timeline)

**Purpose**: Recent activity, notifications, comment threads.

**Layout**:
```
┌─────────────────────────────────────────┐
│ [●] Sarah commented on "Design Poll"    │
│     2 hours ago                         │
│                                         │
│ [●] John created a new poll             │
│     Yesterday at 3:45 PM                │
│                                         │
│ [●] Team meeting scheduled              │
│     Mar 5, 2026                         │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Avatar` (user photo)
- `Card` (activity item)
- `Text` (activity description, timestamp)
- `Badge` (activity type)

---

### Block 12: User Profile Header

**Purpose**: Profile page header, account overview.

**Layout**:
```
┌─────────────────────────────────────────┐
│ [Cover Photo]                           │
│                                         │
│   [Avatar]  Sarah Johnson               │
│             Head of Design @ Acme       │
│             San Francisco, CA           │
│                                         │
│   [Edit Profile] [Share] [•••]          │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Avatar` (large, overlapping cover)
- `Button` (actions)
- `Text` (name, bio, location)

---

## Form Blocks

### Block 13: Multi-Step Form

**Purpose**: Onboarding flow, long forms, survey.

**Layout**:
```
┌─────────────────────────────────────────┐
│  Step 1 of 3: Basic Information         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  [Form Fields]                          │
│                                         │
│                                         │
│        [← Back]      [Next →]           │
└─────────────────────────────────────────┘
```

**Components Used**:
- Progress indicator (custom or Tabs)
- `Input`, `Label`, `Textarea` (form fields)
- `Button` (navigation)

**Code Example**:

```tsx
export function MultiStepFormBlock({
  steps,
  currentStep,
  onNext,
  onBack
}: MultiStepFormBlockProps) {
  const progress = ((currentStep + 1) / steps.length) * 100
  
  return (
    <Card elevation="raised" className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {steps[currentStep].fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            required={field.required}
          />
        ))}
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button onClick={onNext}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </Card>
  )
}
```

---

### Block 14: File Upload Zone

**Purpose**: File uploads, image galleries, attachment forms.

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│           [Upload Icon]                 │
│                                         │
│  Drag and drop files here, or click     │
│  to browse                              │
│                                         │
│  Supports: PNG, JPG, PDF (Max 10MB)     │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ file1.png      [×]           │       │
│  │ ████████████░░ 80%           │       │
│  └──────────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Components Used**:
- Drag-drop zone (custom with react-dropzone)
- `Progress` (upload progress)
- `Button` (remove file)
- `Badge` (file type, size)

---

### Block 15: Search with Filters

**Purpose**: Search results, product catalog, directory.

**Layout**:
```
┌─────────────────────────────────────────┐
│  [Search Input]                         │
│                                         │
│  Filters: [Status ▼] [Date ▼] [Sort ▼] │
├─────────────────────────────────────────┤
│  [Search Result 1]                      │
│  [Search Result 2]                      │
│  [Search Result 3]                      │
│                                         │
│  Showing 1-10 of 234 results            │
│                                         │
│         [Load More]                     │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Input` (search)
- `DropdownMenu` (filters)
- `Card` (result item)
- `Button` (load more)

---

## Implementation Plan

### Phase 1: Priority Blocks (Week 1)

**Marketing**:
- [ ] Hero-1 (Centered)
- [ ] Feature Grid (3-column)
- [ ] CTA Section

**App**:
- [ ] Empty State
- [ ] Stat Dashboard

**Forms**:
- [ ] Multi-Step Form

### Phase 2: Additional Blocks (Week 2)

**Marketing**:
- [ ] Hero-2 (Split)
- [ ] Pricing Table

**App**:
- [ ] Settings Panel
- [ ] Data Table

**Forms**:
- [ ] File Upload Zone
- [ ] Search with Filters

### Phase 3: Advanced Blocks (Week 3)

**Marketing**:
- [ ] Testimonial Carousel

**App**:
- [ ] Activity Feed
- [ ] User Profile Header

### Phase 4: Documentation (Week 4)

- [ ] Storybook stories for all blocks
- [ ] Usage documentation
- [ ] Code export functionality
- [ ] Figma component sync

---

## Block Organization

### File Structure

```
src/
├── blocks/
│   ├── marketing/
│   │   ├── hero-1.tsx
│   │   ├── hero-2.tsx
│   │   ├── feature-grid.tsx
│   │   ├── pricing-table.tsx
│   │   ├── testimonial-carousel.tsx
│   │   └── cta-section.tsx
│   ├── app/
│   │   ├── settings-panel.tsx
│   │   ├── empty-state.tsx
│   │   ├── data-table.tsx
│   │   ├── stat-dashboard.tsx
│   │   ├── activity-feed.tsx
│   │   └── user-profile-header.tsx
│   └── forms/
│       ├── multi-step-form.tsx
│       ├── file-upload-zone.tsx
│       └── search-with-filters.tsx
└── blocks.stories.tsx
```

### Storybook Organization

```
Blocks
├── Marketing
│   ├── Hero-1
│   ├── Hero-2
│   ├── Feature Grid
│   ├── Pricing Table
│   ├── Testimonial Carousel
│   └── CTA Section
├── App
│   ├── Settings Panel
│   ├── Empty State
│   ├── Data Table
│   ├── Stat Dashboard
│   ├── Activity Feed
│   └── User Profile Header
└── Forms
    ├── Multi-Step Form
    ├── File Upload Zone
    └── Search with Filters
```

---

## Usage Guidelines

### When to Use Blocks

**Use blocks when**:
- Starting a new page (landing, feature, dashboard)
- Need a common pattern (pricing, testimonials, stats)
- Want consistent design across pages
- Rapid prototyping (hackathons, demos)

**Don't use blocks when**:
- Highly custom, one-off layout needed
- Block doesn't fit your content (force-fitting)
- You need deep customization (build from components instead)

### Customization Levels

**Level 1** (Content only):
Just pass props (text, images, links). No code changes.

**Level 2** (Style tweaks):
Pass className to override specific styles. CSS customization.

**Level 3** (Component replacement):
Replace slots (e.g., use custom Button, Card variant).

**Level 4** (Fork the block):
Copy block code, modify structure, save as new block.

---

## Success Metrics

**Block usage tracking**:
- Number of blocks used in production
- Most popular blocks (analytics)
- Time saved (vs building from scratch)

**Quality metrics**:
- Lighthouse score: 95+ (performance)
- Accessibility score: 100 (WCAG AA)
- Mobile responsiveness: Works on all breakpoints

**Developer experience**:
- Onboarding time: <30 minutes (copy block, customize, deploy)
- Documentation completeness: 100% (all blocks documented)
- Code export: 1-click copy to clipboard

---

**End of Block Library Proposal**

Next steps:
1. Implement Priority Blocks (Phase 1)
2. Create Storybook stories with live editor
3. Document usage patterns
4. Sync with Figma (design tokens + components)
