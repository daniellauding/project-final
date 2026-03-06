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

## Priority 1: Core Color Tokens

### 1. Tertiary Brand Color

```css
/* Add to :root */
--color-brand-tertiary: oklch(0.76 0.19 55);  /* Orange/amber accent */
--color-brand-tertiary-foreground: var(--color-gray-950);
```

**Use Cases**: CTA buttons, promotional badges, notification dots, chart accents

---

### 2. Surface Container Tokens (M3-Inspired)

```css
:root {
  --color-surface-container-lowest: var(--color-white);
  --color-surface-container-low: oklch(0.96 0.004 90);
  --color-surface-container: oklch(0.94 0.005 90);
  --color-surface-container-high: oklch(0.92 0.006 90);
  --color-surface-container-highest: oklch(0.90 0.008 90);
}
```

**Elevation Mapping**:
- **Lowest**: Page background
- **Low**: Cards on page
- **Default**: Modals, dialogs
- **High**: Dropdown menus
- **Highest**: Tooltips, popovers

---

### 3. State Layer Opacity Tokens

```css
:root {
  --opacity-state-hover: 0.08;
  --opacity-state-focus: 0.12;
  --opacity-state-pressed: 0.12;
  --opacity-state-dragged: 0.16;
  --opacity-state-disabled: 0.38;
  --color-state-layer: var(--color-foreground);
}
```

**Usage**: Consistent hover/focus states via overlay pseudo-elements.

---

## Priority 2: Spacing & Layout

### 4. Fine-Grained Spacing

```css
--spacing-3-5: 14px;   /* NEW */
--spacing-11: 44px;    /* NEW */
--spacing-14: 56px;    /* NEW */
--spacing-28: 112px;   /* NEW */
/* ... additional values */
```

---

### 5. Aspect Ratio Tokens

```css
--aspect-square: 1 / 1;
--aspect-video: 16 / 9;
--aspect-portrait: 3 / 4;
--aspect-landscape: 4 / 3;
--aspect-ultrawide: 21 / 9;
```

---

## Priority 3: Shadows & Animation

### 6. Enhanced Shadows

```css
--shadow-2xs: 0 1px 0 0 rgba(0, 0, 0, 0.05);  /* NEW */
--drop-shadow-xs: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));  /* NEW */
--drop-shadow-sm: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));   /* NEW */
/* ... additional drop-shadow tokens */
```

---

### 7. Animation Tokens

```css
/* M3-inspired easing curves */
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Additional durations */
--duration-short-1: 50ms;   /* NEW */
--duration-medium-1: 250ms; /* NEW */
--duration-long-1: 450ms;   /* NEW */
```

---

## Implementation Checklist

### Phase 1: Core Tokens (Week 1)
- [ ] Add tertiary brand color
- [ ] Add surface container tokens (5 levels)
- [ ] Add state layer opacity tokens
- [ ] Update design-tokens.json
- [ ] Regenerate tokens.css
- [ ] Run TypeScript type generation

### Phase 2: Spacing & Layout (Week 2)
- [ ] Add fine-grained spacing tokens
- [ ] Add aspect ratio tokens

### Phase 3: Shadows & Animation (Week 3)
- [ ] Add drop-shadow tokens
- [ ] Add easing curve variants
- [ ] Add duration variants

### Phase 4: Documentation (Week 4)
- [ ] Document all new tokens in Storybook
- [ ] Create token usage examples
- [ ] Update component stories
- [ ] Create migration guide

---

**See DESIGN-SYSTEM-V2-ROADMAP.md for detailed implementation schedule.**
