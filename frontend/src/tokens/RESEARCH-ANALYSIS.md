# Design System Research Analysis

**Date**: March 6, 2026  
**Author**: Agent 4 (Design System Research)  
**Version**: 1.0

---

## Executive Summary

### Key Findings

1. **Pejla's foundation is strong** – Using CVA, Radix primitives, data-slot attributes, and compound components. Already aligned with modern best practices (shadcn/ui pattern).

2. **Token gaps exist** – Missing surface containers, state layers, tertiary colors, and fine-grained elevation tokens found in Material Design 3.

3. **Component composition needs enhancement** – Current Card/Button components lack slot-based icon placement, elevation variants, and polymorphic `as` prop patterns.

4. **Block library missing** – No pre-built page blocks (hero, pricing, features) for rapid prototyping. Tailwind UI, shadcn/ui, and Chakra all provide these.

5. **Accessibility patterns underutilized** – Radix provides ARIA primitives (FocusTrap, Portal, Presence) not yet leveraged in custom components.

### Immediate Action Items (Priority 1)

- [ ] Add surface container tokens (container, container-low, container-high)
- [ ] Add tertiary brand color
- [ ] Add state layer opacity tokens (hover: 8%, focus: 12%, pressed: 12%, dragged: 16%)
- [ ] Enhance Button with leading/trailing icon slots
- [ ] Add elevation variants to Card component
- [ ] Create 5 essential blocks (Hero, Feature Grid, CTA, Empty State, Form)

### Long-Term Opportunities (Priority 2-3)

- [ ] Build comprehensive block library (15+ patterns)
- [ ] Implement polymorphic component system (`as` prop for all base components)
- [ ] Create animation token system (spring, bounce, slide)
- [ ] Develop responsive component variants (mobile-first breakpoint system)
- [ ] Document component anatomy patterns (Storybook + MDX)

---

## 1. Material Design 3

**Source**: https://m3.material.io/

### Token Architecture

**Color Role System**:
Material Design 3 uses a semantic color role system that maps to 5 tonal palettes:

```
Primary (main brand color)
├── primary
├── on-primary (text on primary)
├── primary-container (subtle backgrounds)
└── on-primary-container (text on container)

Secondary (accent color)
├── secondary
├── on-secondary
├── secondary-container
└── on-secondary-container

Tertiary (complementary accent)
├── tertiary
├── on-tertiary
├── tertiary-container
└── on-tertiary-container

Error
├── error
├── on-error
├── error-container
└── on-error-container

Neutral (surfaces)
├── surface
├── surface-variant
├── on-surface
├── on-surface-variant
├── outline
└── outline-variant
```

**State Layers**:
M3 uses opacity overlays for interactive states instead of changing base colors:

- **Hover**: 8% opacity overlay
- **Focus**: 12% opacity overlay
- **Pressed**: 12% opacity overlay
- **Dragged**: 16% opacity overlay

**Elevation via Tonal Palettes**:
Instead of shadows, M3 uses tonal surface colors:

- **Level 0** (surface): Base surface color
- **Level 1** (surface-container-low): +2 tonal steps lighter
- **Level 2** (surface-container): +4 tonal steps lighter
- **Level 3** (surface-container-high): +6 tonal steps lighter
- **Level 4** (surface-container-highest): +8 tonal steps lighter

### Component Patterns

**Component Anatomy** (Button example from M3):

```tsx
<Button>
  <StateLayer />        {/* Interactive overlay */}
  <Icon slot="leading" />
  <Label>Text</Label>
  <Icon slot="trailing" />
</Button>
```

Every M3 component has:
- **Container**: Background, shape, elevation
- **State layer**: Hover/focus/pressed overlay
- **Content slots**: Leading icon, label, trailing icon
- **Elevation**: Tonal palette level (0-4)

**Variants**:
- **Filled**: Highest emphasis
- **Tonal**: Medium emphasis with container color
- **Outlined**: Medium emphasis with border
- **Text**: Low emphasis, no background

### Gaps in Pejla

**Missing Tokens**:
- ❌ Tertiary color (third brand color)
- ❌ Surface containers (low, default, high, highest)
- ❌ On-surface-variant (muted text on surfaces)
- ❌ Outline-variant (subtle borders)
- ❌ State layer opacities (standardized interaction states)

**Missing Patterns**:
- ❌ Tonal elevation system (currently only using shadows)
- ❌ State layer components (separate hover/focus overlays)
- ❌ Explicit slot pattern for icons (currently implicit via children)

**What Pejla Has Right**:
- ✅ Semantic color naming (primary, secondary, destructive)
- ✅ On-color naming (primary-foreground)
- ✅ Shadow tokens (though could complement with tonal elevation)

### Recommendations

**Priority 1** (Implement Now):
1. Add `--color-brand-tertiary` and `--color-brand-tertiary-foreground`
2. Add surface container tokens:
   ```css
   --color-surface-container-low: oklch(0.96 0.004 90);
   --color-surface-container: oklch(0.94 0.004 90);
   --color-surface-container-high: oklch(0.92 0.006 90);
   --color-surface-container-highest: oklch(0.90 0.006 90);
   ```
3. Add state layer opacities:
   ```css
   --opacity-state-hover: 0.08;
   --opacity-state-focus: 0.12;
   --opacity-state-pressed: 0.12;
   --opacity-state-dragged: 0.16;
   ```

**Priority 2** (Next Sprint):
- Refactor Card to use surface container tokens instead of hard-coded background
- Add `tonal` variant to Button (uses container colors instead of primary)
- Create StateLayer component for reusable interaction overlays

**Priority 3** (Future):
- Implement full tonal palette generator (like M3's dynamic color)
- Add motion tokens (duration curves from M3: emphasized, standard, decelerated)

---

## 2. Tailwind CSS

**Source**: https://tailwindcss.com/docs/theme

### Utility-First Philosophy

**Why it works**:
- **Constraint-based design**: Limited palette forces consistency
- **No naming overhead**: No need to invent class names (btn-primary, btn-large, etc.)
- **Colocation**: Styles live with markup (easier to maintain)
- **Purging unused CSS**: Unused utilities are removed in production

**How Tailwind v4 works**:
```css
@import "tailwindcss";

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

Now `bg-mint-500`, `text-mint-500`, `border-mint-500` all work automatically.

### Token Structure

**Color Palette** (50-950 scale):
Tailwind uses a 10-step scale with semantic aliases:

```
50  → lightest (backgrounds)
100-200 → subtle backgrounds
300-400 → borders
500 → base color
600-700 → hover states
800-900 → text on light backgrounds
950 → darkest (text on white)
```

**Spacing Scale**:
```
0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
```

**Why this scale?**:
- Fine-grained at small sizes (0.5, 1, 1.5 for borders/dividers)
- Base-4 at medium sizes (4, 8, 12, 16 for padding/gaps)
- Larger jumps at big sizes (64, 80, 96 for sections)

**Typography Scale**:
```
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl-9xl: 1.5rem → 8rem (exponential growth)
```

**Shadow Scale**:
```
2xs, xs, sm, md, lg, xl, 2xl
```

Each shadow has inset, drop-shadow, and text-shadow variants.

### Customization Patterns

**Extending the theme**:
```css
@theme {
  --font-display: "Exposure Trial", sans-serif;
  --color-brand: oklch(0.72 0.11 270);
}
```

**Overriding a namespace**:
```css
@theme {
  --color-*: initial;  /* Remove all default colors */
  --color-brand: ...;
  --color-neutral: ...;
}
```

**Inline theme option** (for CSS variable references):
```css
@theme inline {
  --color-primary: var(--color-brand);
}
```

This makes `.bg-primary` use `var(--color-brand)` instead of a static value.

### Gaps in Pejla

**Missing Granularity**:
- ❌ Fine-grained spacing (0.5, 1.5, 2.5) for borders and small gaps
- ❌ Intermediate font sizes (text-lg = 18px, Pejla jumps from 16px → 20px)
- ❌ Extended shadow scale (Tailwind has 2xs, Pejla starts at xs)

**Missing Utilities**:
- ❌ Drop shadow tokens (for filters, not box-shadow)
- ❌ Blur tokens (already have some, but could extend)
- ❌ Aspect ratio tokens (video, square, portrait, landscape)

**What Pejla Has Right**:
- ✅ Similar spacing scale (base-4)
- ✅ Shadow tokens with multiple levels
- ✅ Typography scale with line-heights
- ✅ Using @theme pattern (tokens.css)

### Recommendations

**Priority 1** (Implement Now):
1. Add fine-grained spacing:
   ```css
   --spacing-0-5: 2px;
   --spacing-1-5: 6px;
   --spacing-2-5: 10px;
   --spacing-3-5: 14px;
   ```
2. Add intermediate font size:
   ```css
   --text-lg: 18px;  /* Between base (16px) and xl (20px) */
   ```

**Priority 2** (Next Sprint):
- Add drop-shadow tokens for filter utilities
- Add aspect-ratio tokens:
  ```css
  --aspect-square: 1 / 1;
  --aspect-video: 16 / 9;
  --aspect-portrait: 3 / 4;
  --aspect-landscape: 4 / 3;
  ```

**Priority 3** (Future):
- Implement Tailwind plugin-style component patterns
- Create utility classes for common Pejla patterns (poll cards, comment threads)

---

## 3. shadcn/ui + Radix UI

**Source**: https://ui.shadcn.com/ | https://www.radix-ui.com/primitives

### Component Composition

**The `asChild` Pattern**:
Radix primitives use `asChild` to merge functionality onto custom components:

```tsx
// Without asChild (default DOM element)
<Tooltip.Trigger>Hover me</Tooltip.Trigger>
// → Renders <button>Hover me</button>

// With asChild (custom component)
<Tooltip.Trigger asChild>
  <Button>Hover me</Button>
</Tooltip.Trigger>
// → Renders <button className="...Button styles">Hover me</button>
// Merges Tooltip props + Button props
```

**How it works**:
1. Parent component clones its child
2. Spreads all props (event handlers, aria attributes, ref)
3. Child component must:
   - Spread `{...props}` onto its root element
   - Forward ref with `React.forwardRef`

**Why it's powerful**:
- Compose multiple behaviors (Tooltip + Dialog + Button)
- No wrapper div pollution
- Keep accessibility props from primitive
- Use your design system components with third-party primitives

### Slot Pattern

**shadcn/ui uses explicit slots**:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content
  </Card.Content>
  <Card.Footer>
    Footer
  </Card.Footer>
</Card>
```

**Benefits**:
- Self-documenting (clear what goes where)
- Easy to style slots independently
- Optional slots (don't render if not provided)
- Slot composition (put multiple things in header)

### Accessibility

**Radix provides 25+ accessible primitives**:
- **Focus management**: FocusTrap, FocusScope
- **Portals**: Render outside parent DOM (modals, popovers)
- **Presence**: Animate exit transitions
- **Dismissable Layer**: Click outside to close
- **Roving Focus**: Arrow key navigation (tabs, menus)

**Built-in ARIA**:
Every Radix primitive handles ARIA attributes automatically:

```tsx
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    {/* Automatically gets:
      - role="dialog"
      - aria-modal="true"
      - aria-labelledby (linked to title)
      - aria-describedby (linked to description)
      - Focus trap
      - Escape key handling
      - Click outside handling
    */}
  </Dialog.Content>
</Dialog.Root>
```

### Variants with CVA

**shadcn/ui uses class-variance-authority**:

```tsx
const buttonVariants = cva(
  "base classes here",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        outline: "...",
      },
      size: {
        sm: "...",
        md: "...",
        lg: "...",
      },
    },
    compoundVariants: [
      {
        variant: "destructive",
        size: "sm",
        className: "special-destructive-small-styles",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)
```

**Compound variants** handle edge cases (e.g., destructive + small = different padding).

### Customization via CSS Variables

**shadcn/ui theming**:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

Then components use `bg-background`, `text-primary`, etc.

**Why this works**:
- Swap entire theme by changing CSS variables
- Works with Tailwind utilities
- Dark mode = just override variables
- No component rewrites needed

### Gaps in Pejla

**Missing Patterns**:
- ❌ Polymorphic `as` prop (Button should accept `as="a"` for links)
- ❌ Compound variants in CVA (currently only simple variants)
- ❌ Portal component for modals/popovers (likely in Dialog already, but not exposed)
- ❌ Presence component for exit animations

**Underutilized**:
- ⚠️ `asChild` only in Button, not other components
- ⚠️ Data attributes (`data-state`, `data-side`) not fully leveraged
- ⚠️ Radix primitives not exposed (can't compose with third-party libs)

**What Pejla Has Right**:
- ✅ Using CVA for variants
- ✅ Using Radix Slot in Button
- ✅ Compound components (Card.Header, Card.Footer)
- ✅ Data-slot attributes for styling hooks
- ✅ CSS variables for theming

### Recommendations

**Priority 1** (Implement Now):
1. Add `asChild` prop to all primitive components (Card, Badge, Label)
2. Add polymorphic `as` prop to Button:
   ```tsx
   <Button as="a" href="/link">Link Button</Button>
   ```
3. Add slot components for Button icons:
   ```tsx
   <Button>
     <Button.Icon slot="leading"><SearchIcon /></Button.Icon>
     Search
     <Button.Icon slot="trailing"><ChevronIcon /></Button.Icon>
   </Button>
   ```

**Priority 2** (Next Sprint):
- Expose Radix primitives (Portal, Presence, FocusTrap) as standalone components
- Add compound variants to Button CVA (e.g., destructive + small)
- Document `asChild` pattern in Storybook

**Priority 3** (Future):
- Create composition guide (how to combine Dialog + Sheet, Tooltip + Button)
- Build accessible navigation primitives (Menu, Tabs, Accordion)

---

## 4. Component Library Patterns

### Chakra UI

**Source**: https://chakra-ui.com/docs/components/button

**Key Patterns**:

1. **Color Palette Prop**:
   ```tsx
   <Button colorPalette="blue">Blue Button</Button>
   <Button colorPalette="red">Red Button</Button>
   ```
   
   Instead of variants, Chakra separates variant (style) from color:
   ```tsx
   <Button variant="solid" colorPalette="blue">Solid Blue</Button>
   <Button variant="outline" colorPalette="blue">Outline Blue</Button>
   ```

2. **Spinner Placement**:
   ```tsx
   <Button loading loadingText="Submitting..." spinnerPlacement="start">
     Submit
   </Button>
   ```

3. **Button Group**:
   ```tsx
   <ButtonGroup attached size="sm" variant="outline">
     <Button>Left</Button>
     <Button>Middle</Button>
     <Button>Right</Button>
   </ButtonGroup>
   ```
   
   Common props propagate to children (size, variant, colorPalette).

4. **Recipe System**:
   Chakra v3 uses "recipes" (like CVA):
   ```ts
   defineRecipe({
     variants: { ... },
     compoundVariants: [ ... ],
     defaultVariants: { ... },
   })
   ```

**Learnings for Pejla**:
- ✅ Separate color from variant (more flexible)
- ✅ Loading states built into Button (don't need separate LoadingButton)
- ✅ Button group for segmented controls
- ✅ Recipe system = CVA (already using)

### Mantine

**Source**: https://mantine.dev/

**Key Patterns**:

1. **Polymorphic Components**:
   ```tsx
   <Button component="a" href="/link">Link</Button>
   <Button component={NextLink} to="/next">Next Link</Button>
   ```

2. **Hooks-Based Architecture**:
   ```tsx
   const { toggle, isOpen } = useDisclosure();
   const form = useForm({ initialValues: { ... } });
   ```
   
   Mantine separates logic (hooks) from UI (components).

3. **Theme Typography System**:
   ```ts
   theme.fontFamily → default font
   theme.fontFamilyMonospace → code font
   theme.headings.fontFamily → heading font
   theme.headings.sizes → h1-h6 sizes
   ```

4. **Compound Components**:
   ```tsx
   <Group>
     <Button>One</Button>
     <Button>Two</Button>
   </Group>
   ```
   
   Group handles spacing/alignment, buttons just render.

**Learnings for Pejla**:
- ✅ Polymorphic `component` prop (same as `as`)
- ✅ Separate font family for headings vs body
- ✅ Custom hooks for common patterns (useToggle, useForm)
- ✅ Layout components (Group, Stack) to avoid flex utilities

### Headless UI

**Source**: https://headlessui.com/

**Key Patterns**:

1. **Unstyled Primitives** (like Radix):
   ```tsx
   <Menu>
     <Menu.Button>Options</Menu.Button>
     <Menu.Items>
       <Menu.Item>
         {({ active }) => (
           <a className={active ? 'bg-blue' : ''}>
             Edit
           </a>
         )}
       </Menu.Item>
     </Menu.Items>
   </Menu>
   ```

2. **Render Props for State**:
   ```tsx
   <Disclosure>
     {({ open }) => (
       <>
         <Disclosure.Button>
           {open ? 'Hide' : 'Show'}
         </Disclosure.Button>
         <Disclosure.Panel>Content</Disclosure.Panel>
       </>
     )}
   </Disclosure>
   ```

3. **Tailwind Integration**:
   Headless UI is designed for Tailwind (no default styles).

**Learnings for Pejla**:
- ✅ Render props expose internal state (open, active, selected)
- ✅ Can extract primitives from Pejla components (styled + unstyled versions)
- ✅ Data attributes for state (`data-headlessui-state="open"`)

### Common Block Patterns

**Hero Blocks**:
- **Hero-1**: Centered, large heading, subtitle, CTA buttons
- **Hero-2**: Split (text left, image/video right)
- **Hero-3**: Full-width background image, overlay, centered content

**Feature Blocks**:
- **Feature Grid**: 3-column, icon + heading + description
- **Feature List**: Alternating image/text rows
- **Feature Cards**: Card grid with hover effects

**Pricing Blocks**:
- **Pricing Table**: 3-tier comparison, feature checkmarks
- **Pricing Cards**: Card-based, highlight "popular" tier
- **Pricing Toggle**: Monthly/Annual toggle

**Form Blocks**:
- **Multi-Step Form**: Progress indicator, back/next buttons
- **File Upload**: Drag-drop zone, file previews
- **Search + Filters**: Input + dropdown filters + results grid

**Data Display Blocks**:
- **Data Table**: Sortable columns, pagination, row selection
- **Stat Dashboard**: 4-column KPI cards with trend indicators
- **Activity Feed**: Timeline with avatars, timestamps

**Empty State Blocks**:
- **Empty State**: Icon + heading + description + CTA

### Gaps in Pejla

**Missing Blocks**:
- ❌ No pre-built page blocks (hero, pricing, features)
- ❌ No layout components (Group, Stack, Grid)
- ❌ No loading states built into components (Button needs loading prop)
- ❌ No polymorphic `as`/`component` prop

**What Pejla Has Right**:
- ✅ Compound components (Card.Header, Card.Footer)
- ✅ Data-slot attributes (good for styling hooks)
- ✅ Variant system with CVA

### Recommendations

**Priority 1** (Implement Now):
1. Add `loading` prop to Button:
   ```tsx
   <Button loading loadingText="Saving...">Save</Button>
   ```
2. Create ButtonGroup component:
   ```tsx
   <ButtonGroup attached size="sm">
     <Button>One</Button>
     <Button>Two</Button>
   </ButtonGroup>
   ```
3. Create 5 essential blocks:
   - Hero-1 (centered)
   - Feature Grid (3-column)
   - CTA Section (full-width)
   - Empty State (icon + text + button)
   - Form Layout (multi-step)

**Priority 2** (Next Sprint):
- Add polymorphic `as` prop to Button, Card, Badge
- Create layout components (Group, Stack, Grid)
- Add 5 more blocks (pricing, testimonials, stats, activity feed, data table)

**Priority 3** (Future):
- Extract unstyled primitives (separate from styled components)
- Build comprehensive block library (20+ patterns)
- Create block playground (drag-drop composition)

---

## Summary Table

| Feature | Material Design 3 | Tailwind CSS | shadcn/ui + Radix | Chakra UI | Pejla Current | Pejla Gap |
|---------|-------------------|--------------|-------------------|-----------|---------------|-----------|
| **Semantic color roles** | ✅ Primary/Secondary/Tertiary | ✅ 50-950 scale | ✅ CSS variables | ✅ colorPalette prop | ✅ Primary/Secondary | ❌ No Tertiary |
| **Surface containers** | ✅ Low/Default/High | ❌ N/A | ❌ N/A | ✅ Surfaces | ❌ Only background | ❌ Missing |
| **State layers** | ✅ 8%/12%/16% | ❌ N/A | ✅ Data states | ✅ _hover/_focus | ⚠️ Partial | ❌ No tokens |
| **Spacing scale** | ✅ Base-4 | ✅ 0.5-96 | ✅ Base-4 | ✅ Base-4 | ✅ Base-4 | ❌ Missing fine-grained |
| **Typography scale** | ✅ Display/Headline/Body | ✅ xs-9xl | ✅ sm-4xl | ✅ xs-2xl | ✅ xs-9xl | ✅ Good |
| **Shadow scale** | ✅ 0-5 elevation | ✅ 2xs-2xl | ✅ sm-2xl | ✅ xs-2xl | ✅ xs-2xl | ⚠️ Missing 2xs |
| **Component slots** | ✅ Leading/Trailing | ❌ Utility-based | ✅ Explicit slots | ✅ Slots | ⚠️ Implicit | ❌ Not explicit |
| **asChild pattern** | ❌ N/A | ❌ N/A | ✅ Core pattern | ❌ Uses `as` | ⚠️ Button only | ❌ Limited |
| **Polymorphic `as`** | ❌ N/A | ❌ N/A | ⚠️ Via asChild | ✅ component prop | ❌ No | ❌ Missing |
| **Variants (CVA)** | ❌ Android XML | ❌ Utility classes | ✅ CVA | ✅ Recipes | ✅ CVA | ✅ Good |
| **Loading states** | ✅ Progress indicators | ❌ Utility-based | ⚠️ Manual | ✅ Built-in | ❌ No | ❌ Missing |
| **Block library** | ✅ M3 templates | ✅ Tailwind UI | ✅ shadcn blocks | ✅ Chakra templates | ❌ No | ❌ Missing |
| **Accessibility** | ✅ ARIA guidelines | ⚠️ Manual | ✅ Radix primitives | ✅ Built-in | ✅ Radix | ✅ Good |

**Legend**:
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

---

## Recommendations Priority Matrix

### Priority 1: Implement Now (Week 1)

**Token Enhancements**:
- [ ] Add tertiary brand color
- [ ] Add surface container tokens (low, default, high)
- [ ] Add state layer opacity tokens (hover, focus, pressed)
- [ ] Add fine-grained spacing (0.5, 1.5, 2.5)

**Component Enhancements**:
- [ ] Add `loading` prop to Button
- [ ] Add explicit icon slots to Button (leading/trailing)
- [ ] Add `asChild` to Card, Badge, Label

**Block Library**:
- [ ] Create Hero-1 block
- [ ] Create Feature Grid block
- [ ] Create Empty State block

### Priority 2: Next Sprint (Week 2-3)

**Token Enhancements**:
- [ ] Add drop-shadow tokens
- [ ] Add aspect-ratio tokens
- [ ] Add animation tokens (spring, bounce)

**Component Enhancements**:
- [ ] Add polymorphic `as` prop to Button, Card
- [ ] Create ButtonGroup component
- [ ] Add elevation variants to Card (flat, raised, floating)
- [ ] Expose Radix primitives (Portal, Presence)

**Block Library**:
- [ ] Create 5 more blocks (pricing, testimonials, CTA, form, stats)
- [ ] Document block usage in Storybook

### Priority 3: Future (Week 4+)

**Token Enhancements**:
- [ ] Implement dynamic color system (M3-style)
- [ ] Add motion tokens (duration curves)

**Component Enhancements**:
- [ ] Extract unstyled primitives
- [ ] Create layout components (Group, Stack, Grid)
- [ ] Add compound variants to all CVA components

**Block Library**:
- [ ] Build full block library (20+ patterns)
- [ ] Create block playground (drag-drop)
- [ ] Generate block documentation site

---

**End of Research Analysis**

This document provides a comprehensive analysis of industry-leading design systems and actionable recommendations for enhancing Pejla's design system. See companion documents for detailed implementation plans:

- `TOKEN-ENHANCEMENT-PLAN.md` – What tokens to add/change
- `COMPONENT-PATTERNS.md` – Slot patterns, composition best practices
- `BLOCK-LIBRARY-PROPOSAL.md` – 15 reusable blocks for Pejla
- `DESIGN-SYSTEM-V2-ROADMAP.md` – 4-week implementation plan
