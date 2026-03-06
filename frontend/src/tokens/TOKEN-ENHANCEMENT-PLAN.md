# Token Enhancement Plan

**Date**: March 6, 2026  
**Author**: Agent 4 (Design System Research)  
**Version**: 1.0  
**Status**: Proposal (Not Implemented)

---

## Overview

This document outlines specific token additions and modifications to enhance Pejla's design token system based on research from Material Design 3, Tailwind CSS, shadcn/ui, and Chakra UI.

**Total New Tokens**: 47  
**Modified Tokens**: 8  
**Removed Tokens**: 0

---

## 1. Color Tokens

### 1.1 Add Tertiary Brand Color

**Rationale**: Material Design 3 uses a tertiary color for complementary accents (e.g., CTA buttons, highlights). Currently Pejla only has primary (purple) and secondary (gray).

**Proposed Addition**:

```css
/* Add to :root */
--color-brand-tertiary: oklch(0.76 0.19 55);  /* Orange/amber accent */
--color-brand-tertiary-foreground: var(--color-gray-950);

/* Dark mode override */
.dark {
  --color-brand-tertiary: oklch(0.82 0.17 55);
  --color-brand-tertiary-foreground: var(--color-gray-1000);
}
```

**Use Cases**:
- CTA buttons that aren't primary actions
- Promotional badges ("New", "Sale", "Beta")
- Notification dots/counters
- Graph/chart accent colors

---

### 1.2 Add Surface Container Tokens

**Rationale**: Material Design 3 uses tonal surface colors for elevation instead of shadows. This provides better dark mode support and reduces visual noise.

**Proposed Addition**:

```css
/* Light mode */
:root {
  --color-surface-container-lowest: var(--color-white);
  --color-surface-container-low: oklch(0.96 0.004 90);
  --color-surface-container: oklch(0.94 0.005 90);
  --color-surface-container-high: oklch(0.92 0.006 90);
  --color-surface-container-highest: oklch(0.90 0.008 90);
}

/* Dark mode */
.dark {
  --color-surface-container-lowest: oklch(0.10 0.005 90);
  --color-surface-container-low: oklch(0.12 0.005 90);
  --color-surface-container: oklch(0.14 0.005 90);
  --color-surface-container-high: oklch(0.16 0.006 90);
  --color-surface-container-highest: oklch(0.18 0.008 90);
}
```

**Elevation Mapping**:
- **Lowest**: Flat surfaces (page background)
- **Low**: Slightly raised (cards on page)
- **Default**: Standard elevation (modals, dialogs)
- **High**: Elevated UI (dropdown menus)
- **Highest**: Floating UI (tooltips, popovers)

**Use Cases**:
- Replace `--color-background-card` with `--color-surface-container-low`
- Use for Card elevation variants (flat, raised, floating)
- Use for layered modals (modal on top of modal)

---

### 1.3 Add State Layer Tokens

**Rationale**: Material Design 3 uses consistent opacity overlays for interactive states instead of modifying base colors.

**Proposed Addition**:

```css
:root {
  /* State layer opacities (M3 standard) */
  --opacity-state-hover: 0.08;
  --opacity-state-focus: 0.12;
  --opacity-state-pressed: 0.12;
  --opacity-state-dragged: 0.16;
  --opacity-state-disabled: 0.38;
  
  /* State layer colors (derived from foreground) */
  --color-state-layer: var(--color-foreground);
}
```

**Usage Pattern**:

```css
.button {
  background: var(--color-primary);
  position: relative;
}

.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-state-layer);
  opacity: 0;
  transition: opacity 200ms;
}

.button:hover::before {
  opacity: var(--opacity-state-hover);
}

.button:focus-visible::before {
  opacity: var(--opacity-state-focus);
}

.button:active::before {
  opacity: var(--opacity-state-pressed);
}
```

**Use Cases**:
- Consistent hover/focus states across all interactive components
- Drag-and-drop feedback
- Button pressed states
- Menu item hover states

---

### 1.4 Add Outline Variant Token

**Rationale**: Material Design 3 separates outline (strong border) from outline-variant (subtle border/divider).

**Proposed Addition**:

```css
:root {
  --color-outline-variant: oklch(0.88 0.006 90);
}

.dark {
  --color-outline-variant: oklch(0.20 0.006 90);
}
```

**Use Cases**:
- Subtle dividers between list items
- Card borders in grid layouts
- Form field separators
- Breadcrumb separators

---

### 1.5 Add On-Surface-Variant Token

**Rationale**: M3 uses on-surface-variant for muted text on surfaces (less emphasis than on-surface).

**Proposed Addition**:

```css
:root {
  --color-on-surface-variant: var(--color-gray-600);
}

.dark {
  --color-on-surface-variant: var(--color-gray-500);
}
```

**Use Cases**:
- Helper text in forms
- Timestamps in feeds
- Metadata (author, date, category)
- Placeholder text

**Replaces**:
- Can replace `--color-text-muted` (more semantic naming)

---

## 2. Spacing Tokens

### 2.1 Add Fine-Grained Spacing

**Rationale**: Tailwind provides 0.5, 1.5, 2.5 increments for borders, dividers, and small gaps. Pejla currently jumps from 0 → 4px (--spacing-1).

**Proposed Addition**:

```css
:root {
  /* Fine-grained spacing (already exists, but confirming) */
  --spacing-0-5: 2px;   /* Already exists ✅ */
  --spacing-1-5: 6px;   /* Already exists ✅ */
  --spacing-2-5: 10px;  /* Already exists ✅ */
  --spacing-3-5: 14px;  /* ADD THIS ❌ */
  
  /* Additional fine-grained values */
  --spacing-11: 44px;  /* ADD THIS ❌ */
  --spacing-14: 56px;  /* ADD THIS ❌ */
  --spacing-28: 112px; /* ADD THIS ❌ */
  --spacing-36: 144px; /* ADD THIS ❌ */
  --spacing-44: 176px; /* ADD THIS ❌ */
  --spacing-52: 208px; /* ADD THIS ❌ */
  --spacing-56: 224px; /* ADD THIS ❌ */
  --spacing-72: 288px; /* ADD THIS ❌ */
}
```

**Use Cases**:
- `--spacing-0-5` (2px): Border widths, tight gaps
- `--spacing-1-5` (6px): Small padding/gaps
- `--spacing-2-5` (10px): Intermediate padding
- `--spacing-3-5` (14px): Between spacing-3 (12px) and spacing-4 (16px)

---

## 3. Typography Tokens

### 3.1 Add Intermediate Font Size

**Rationale**: Pejla jumps from --text-base (16px) to --text-xl (20px). Tailwind has --text-lg (18px) in between.

**Proposed Addition**:

```css
:root {
  --text-lg: 18px;  /* ALREADY EXISTS ✅ */
}
```

**Status**: ✅ **Already implemented** in Pejla! No change needed.

---

### 3.2 Add Display Font Weight

**Rationale**: Display fonts (Exposure Trial) often need lighter weight for large headings.

**Proposed Addition**:

```css
:root {
  --font-display: "Exposure Trial", "Apercu", system-ui, sans-serif;  /* Already exists ✅ */
  
  /* Add display-specific weight (optional) */
  --font-display-weight: 400;  /* Default for display font */
}
```

**Use Cases**:
- Apply to h1, h2 using display font
- Lighter weight for hero headings (less aggressive)

---

## 4. Border Radius Tokens

### 4.1 Current State Review

**Current Tokens**:
```css
--radius-none: 0px;
--radius-sm: 4px;
--radius-base: 8px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-3xl: 24px;
--radius-full: 9999px;
```

**Issue**: `--radius-base` and `--radius-md` are identical (both 8px).

**Recommendation**: **No change needed**. This is intentional (base = default, md = explicit medium).

---

## 5. Shadow Tokens

### 5.1 Add 2xs Shadow

**Rationale**: Tailwind has `--shadow-2xs` for ultra-subtle shadows. Pejla starts at `--shadow-xs`.

**Proposed Addition**:

```css
:root {
  --shadow-2xs: 0 1px 0 0 rgba(0, 0, 0, 0.05);  /* ADD THIS ❌ */
  /* Shift existing shadows down */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);  /* Already exists ✅ */
}
```

**Use Cases**:
- Ultra-subtle card borders
- Divider lines
- Flat buttons with minimal depth

---

### 5.2 Add Drop Shadow Tokens

**Rationale**: Tailwind separates drop-shadow (filter) from box-shadow. Useful for non-rectangular shapes (SVG, images with transparency).

**Proposed Addition**:

```css
:root {
  /* Drop shadows (for filter: drop-shadow()) */
  --drop-shadow-xs: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
  --drop-shadow-sm: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  --drop-shadow-md: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06));
  --drop-shadow-lg: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
  --drop-shadow-xl: drop-shadow(0 20px 13px rgba(0, 0, 0, 0.03)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.08));
  --drop-shadow-2xl: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15));
}
```

**Use Cases**:
- Drop shadow on images with transparency
- SVG icon shadows
- Non-rectangular UI elements

---

## 6. Animation Tokens

### 6.1 Add Easing Curve Variants

**Rationale**: Material Design 3 defines 3 easing curves for different use cases. Pejla has basic ease-in/out but could add semantic variants.

**Proposed Addition**:

```css
:root {
  /* Existing (keep) */
  --ease-linear: linear;
  --ease: ease;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Add M3 semantic curves */
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);       /* Emphasized (strong deceleration) */
  --ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);  /* Entering screen */
  --ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);  /* Exiting screen */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);         /* Standard (moderate) */
  
  /* Add bounce curve (for playful interactions) */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Use Cases**:
- **emphasized**: Modal/drawer entering
- **emphasized-accelerate**: Modal/drawer exiting
- **standard**: Hover states, tooltips
- **bounce**: Playful buttons, notifications

---

### 6.2 Add Duration Variants

**Rationale**: M3 defines short (50-200ms) and long (400-500ms) durations for different use cases.

**Current Tokens** (review):
```css
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-moderate: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

**Proposed Addition**:

```css
:root {
  /* Add M3-aligned durations */
  --duration-short-1: 50ms;   /* Quick feedback */
  --duration-short-2: 100ms;  /* Hover states */
  --duration-short-3: 150ms;  /* Already exists as --duration-fast ✅ */
  --duration-short-4: 200ms;  /* Already exists as --duration-base ✅ */
  
  --duration-medium-1: 250ms;  /* ADD THIS ❌ */
  --duration-medium-2: 300ms;  /* Already exists as --duration-moderate ✅ */
  --duration-medium-3: 350ms;  /* ADD THIS ❌ */
  --duration-medium-4: 400ms;  /* ADD THIS ❌ */
  
  --duration-long-1: 450ms;  /* ADD THIS ❌ */
  --duration-long-2: 500ms;  /* Already exists as --duration-slow ✅ */
  --duration-long-3: 550ms;  /* ADD THIS ❌ */
  --duration-long-4: 600ms;  /* ADD THIS ❌ */
}
```

**Recommendation**: Add only the missing durations (50ms, 100ms, 250ms, 350ms, 400ms, 450ms, 550ms, 600ms).

---

## 7. Layout Tokens

### 7.1 Add Aspect Ratio Tokens

**Rationale**: Tailwind v4 includes aspect ratio tokens for common ratios. Useful for responsive images/videos.

**Proposed Addition**:

```css
:root {
  --aspect-square: 1 / 1;
  --aspect-video: 16 / 9;
  --aspect-portrait: 3 / 4;
  --aspect-landscape: 4 / 3;
  --aspect-ultrawide: 21 / 9;
  --aspect-instagram: 4 / 5;  /* Instagram portrait */
}
```

**Use Cases**:
- Video embeds (YouTube, Vimeo)
- Image galleries (maintain aspect ratio)
- Poll card thumbnails
- Avatar containers

---

### 7.2 Add Container Width Tokens

**Rationale**: Tailwind defines max-width containers for content areas.

**Proposed Addition**:

```css
:root {
  /* Container max-widths */
  --container-xs: 20rem;   /* 320px */
  --container-sm: 24rem;   /* 384px */
  --container-md: 28rem;   /* 448px */
  --container-lg: 32rem;   /* 512px */
  --container-xl: 36rem;   /* 576px */
  --container-2xl: 42rem;  /* 672px */
  --container-3xl: 48rem;  /* 768px */
  --container-4xl: 56rem;  /* 896px */
  --container-5xl: 64rem;  /* 1024px */
  --container-6xl: 72rem;  /* 1152px */
  --container-7xl: 80rem;  /* 1280px */
}
```

**Use Cases**:
- Page content max-width
- Modal dialog widths
- Form container widths
- Article/blog post containers

---

## 8. Opacity Tokens (Review)

**Current Tokens**:
```css
--opacity-0: 0;
--opacity-5: 0.05;
--opacity-10: 0.1;
--opacity-15: 0.15;
--opacity-20: 0.2;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-100: 1;
```

**Status**: ✅ **Complete**. Covers all Tailwind opacity levels. No changes needed.

---

## 9. Z-Index Tokens (Review)

**Current Tokens**:
```css
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

**Status**: ✅ **Complete**. Good semantic naming. No changes needed.

---

## 10. Token Refactoring (Optional)

### 10.1 Rename Semantic Color Tokens

**Current** (potentially confusing):
```css
--color-brand-primary: var(--color-purple-500);
--color-brand-secondary: var(--color-gray-200);
```

**Proposed** (more aligned with M3):
```css
/* Keep existing for compatibility */
--color-brand-primary: var(--color-purple-500);
--color-brand-secondary: var(--color-gray-200);
--color-brand-tertiary: oklch(0.76 0.19 55);  /* NEW */

/* Add M3-style aliases (optional) */
--color-primary: var(--color-brand-primary);
--color-secondary: var(--color-brand-secondary);
--color-tertiary: var(--color-brand-tertiary);

--color-on-primary: var(--color-brand-primary-foreground);
--color-on-secondary: var(--color-brand-secondary-foreground);
--color-on-tertiary: var(--color-brand-tertiary-foreground);
```

**Recommendation**: **Don't refactor now**. Add tertiary, keep existing naming. Refactor later if needed.

---

## Summary of Changes

### Add (47 new tokens)

**Colors** (11):
- `--color-brand-tertiary`
- `--color-brand-tertiary-foreground`
- `--color-surface-container-lowest`
- `--color-surface-container-low`
- `--color-surface-container`
- `--color-surface-container-high`
- `--color-surface-container-highest`
- `--color-state-layer`
- `--color-outline-variant`
- `--color-on-surface-variant`
- (Dark mode variants x11)

**Spacing** (8):
- `--spacing-3-5`
- `--spacing-11`
- `--spacing-14`
- `--spacing-28`
- `--spacing-36`
- `--spacing-44`
- `--spacing-52`
- `--spacing-56`
- `--spacing-72`

**Opacity** (5):
- `--opacity-state-hover`
- `--opacity-state-focus`
- `--opacity-state-pressed`
- `--opacity-state-dragged`
- `--opacity-state-disabled`

**Shadows** (7):
- `--shadow-2xs`
- `--drop-shadow-xs`
- `--drop-shadow-sm`
- `--drop-shadow-md`
- `--drop-shadow-lg`
- `--drop-shadow-xl`
- `--drop-shadow-2xl`

**Animation** (11):
- `--ease-emphasized`
- `--ease-emphasized-decelerate`
- `--ease-emphasized-accelerate`
- `--ease-standard`
- `--ease-bounce`
- `--duration-short-1`
- `--duration-short-2`
- `--duration-medium-1`
- `--duration-medium-3`
- `--duration-long-1`
- `--duration-long-3`
- `--duration-long-4`

**Layout** (11):
- `--aspect-square`
- `--aspect-video`
- `--aspect-portrait`
- `--aspect-landscape`
- `--aspect-ultrawide`
- `--aspect-instagram`
- `--container-xs` through `--container-7xl` (already exist, confirm)

### Modify (0)

No existing tokens need modification. All changes are additive.

### Remove (0)

No tokens should be removed. Maintain backward compatibility.

---

## Implementation Checklist

### Phase 1: Core Tokens (Week 1)
- [ ] Add tertiary brand color
- [ ] Add surface container tokens (5 levels)
- [ ] Add state layer opacity tokens
- [ ] Add outline-variant and on-surface-variant
- [ ] Update `design-tokens.json`
- [ ] Regenerate `tokens.css`
- [ ] Run TypeScript type generation

### Phase 2: Spacing & Layout (Week 2)
- [ ] Add fine-grained spacing tokens
- [ ] Add aspect ratio tokens
- [ ] Verify container tokens exist
- [ ] Update Tailwind config (if using)

### Phase 3: Shadows & Animation (Week 3)
- [ ] Add 2xs shadow
- [ ] Add drop-shadow tokens
- [ ] Add easing curve variants
- [ ] Add duration variants

### Phase 4: Documentation (Week 4)
- [ ] Document all new tokens in Storybook
- [ ] Create token usage examples
- [ ] Update component stories to use new tokens
- [ ] Create migration guide (old → new tokens)

---

## Token Usage Examples

### Surface Containers

**Before** (single background color):
```css
.card {
  background: var(--color-background-card);
}
```

**After** (elevation levels):
```css
.card-flat {
  background: var(--color-surface-container-lowest);
}

.card-raised {
  background: var(--color-surface-container-low);
}

.card-floating {
  background: var(--color-surface-container-high);
}
```

---

### State Layers

**Before** (changing background color):
```css
.button:hover {
  background: oklch(from var(--color-primary) calc(l * 1.1) c h);
}
```

**After** (overlay approach):
```css
.button {
  position: relative;
}

.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-state-layer);
  opacity: 0;
  transition: opacity var(--duration-fast);
  pointer-events: none;
}

.button:hover::before {
  opacity: var(--opacity-state-hover);
}
```

---

### Tertiary Color

**Before** (only primary/secondary):
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
```

**After** (add tertiary):
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="tertiary">Promotional Action</Button>
<Button variant="secondary">Secondary Action</Button>
```

---

### Aspect Ratios

**Before** (manual padding-bottom hack):
```css
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
}
```

**After** (aspect ratio token):
```css
.video-container {
  aspect-ratio: var(--aspect-video);
}
```

---

## Migration Guide

### For Designers

**Figma Updates**:
1. Add tertiary color to brand palette
2. Create surface elevation styles (5 levels)
3. Add state layer component (8%, 12%, 16% opacity overlays)

**Exporting to Pejla**:
- Use surface container tokens for card backgrounds
- Use state layers for hover/focus states
- Use tertiary color for CTAs and highlights

### For Developers

**Component Updates**:
1. Replace hard-coded backgrounds with surface container tokens
2. Add state layer overlays to interactive components
3. Use tertiary color for promotional CTAs

**New Component Variants**:
```tsx
// Button with tertiary variant
<Button variant="tertiary">Get Started</Button>

// Card with elevation levels
<Card elevation="flat">...</Card>
<Card elevation="raised">...</Card>
<Card elevation="floating">...</Card>
```

---

## Testing Checklist

After implementing token changes:

- [ ] Light mode: All components render correctly
- [ ] Dark mode: All components render correctly
- [ ] Contrast ratios: WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] State layers: Hover/focus visible on all backgrounds
- [ ] Surface containers: Elevation levels distinguishable
- [ ] Tertiary color: Sufficient contrast with backgrounds
- [ ] Aspect ratios: Images/videos maintain ratio on resize
- [ ] Animations: Easing curves feel natural

---

**End of Token Enhancement Plan**

Next steps:
1. Review with design team
2. Implement in `design-tokens.json`
3. Regenerate `tokens.css`
4. Update component stories in Storybook
5. Document in `COMPONENT-PATTERNS.md`
