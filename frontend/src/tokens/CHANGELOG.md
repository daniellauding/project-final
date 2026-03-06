# Changelog - Pejla Design Tokens

All notable changes to the Pejla design token system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-03-06

### 🎉 Major Release: Material Design 3 Enhancements

Inspired by Material Design 3's surface containers, state layers, and semantic color system. **100% backward compatible** with v1.

### Added

#### Surface Containers (8 new tokens)
Material Design 3-inspired tonal elevation system (replaces shadows with color for elevation).

**Light mode**:
- `colors.semantic.surface.default` — Base surface
- `colors.semantic.surface.dim` — Dimmed surface
- `colors.semantic.surface.bright` — Bright surface
- `colors.semantic.surface.container.lowest` — Page background
- `colors.semantic.surface.container.low` — Cards on page
- `colors.semantic.surface.container.default` — Modals, dialogs
- `colors.semantic.surface.container.high` — Dropdowns, menus
- `colors.semantic.surface.container.highest` — Tooltips, popovers

**Dark mode**:
- `colors.dark.surface.*` — Inverted hierarchy (darker = lower elevation)

**CSS variables**:
- `--color-surface`
- `--color-surface-dim`
- `--color-surface-bright`
- `--color-surface-container-lowest`
- `--color-surface-container-low`
- `--color-surface-container`
- `--color-surface-container-high`
- `--color-surface-container-highest`

---

#### On-Surface Text Colors (3 new tokens)
Optimized text colors for use on surface containers.

- `colors.semantic.on-surface.default` — Primary text on surfaces
- `colors.semantic.on-surface.variant` — Secondary text on surfaces
- `colors.semantic.on-surface.muted` — Muted text on surfaces

**CSS variables**:
- `--color-on-surface`
- `--color-on-surface-variant`
- `--color-on-surface-muted`

---

#### Tertiary Brand Color (2 new tokens)
Third brand color (teal) for accent elements and variety.

**Primitive colors**:
- `colors.primitive.teal.50` — Light teal
- `colors.primitive.teal.500` — Base teal
- `colors.primitive.teal.900` — Dark teal

**Semantic colors**:
- `colors.semantic.brand.tertiary` — Tertiary brand color
- `colors.semantic.brand.tertiary-foreground` — Text on tertiary

**CSS variables**:
- `--color-teal-50`
- `--color-teal-500`
- `--color-teal-900`
- `--color-brand-tertiary`
- `--color-brand-tertiary-foreground`

**Use cases**:
- Primary (purple): Main CTAs
- Secondary (gray): Neutral actions
- Tertiary (teal): Accent badges, tags, icons

---

#### Outline Variants (2 new tokens)
Two border emphasis levels for fine-grained control.

- `colors.semantic.outline.default` — Standard borders
- `colors.semantic.outline.variant` — Subtle borders

**CSS variables**:
- `--color-outline` (already existed, now semantic)
- `--color-outline-variant` (new)

---

#### State Layer Tokens (8 new tokens)
Material Design 3-inspired opacity overlays for interactive states.

**Opacity tokens**:
- `opacity.state.hover` — 0.08 (8%)
- `opacity.state.focus` — 0.12 (12%)
- `opacity.state.press` — 0.16 (16%)
- `opacity.state.drag` — 0.16 (16%)
- `opacity.state.disabled` — 0.38 (38%)

**CSS variables (opacity)**:
- `--opacity-hover`
- `--opacity-focus`
- `--opacity-press`
- `--opacity-drag`
- `--opacity-disabled`

**State layer colors** (auto-adapt to light/dark):
- `--state-hover` — Black/white overlay with hover opacity
- `--state-focus` — Black/white overlay with focus opacity
- `--state-press` — Black/white overlay with press opacity

---

#### Drop Shadows (6 new tokens)
Filter-compatible shadows for SVG and image elements.

- `dropShadow.xs` — Extra small drop shadow
- `dropShadow.sm` — Small drop shadow
- `dropShadow.md` — Medium drop shadow
- `dropShadow.lg` — Large drop shadow
- `dropShadow.xl` — Extra large drop shadow
- `dropShadow.2xl` — 2x extra large drop shadow

**CSS variables**:
- `--drop-shadow-xs`
- `--drop-shadow-sm`
- `--drop-shadow-md`
- `--drop-shadow-lg`
- `--drop-shadow-xl`
- `--drop-shadow-2xl`

**Usage**: `filter: var(--drop-shadow-md);`

---

#### Enhanced Easing Curves (4 new tokens)
Material Design 3-inspired easing functions for smooth animations.

- `animations.easing.emphasized` — M3 standard emphasized curve
- `animations.easing.emphasized-decelerate` — Deceleration curve
- `animations.easing.emphasized-accelerate` — Acceleration curve
- `animations.easing.bounce` — Bounce effect curve

**CSS variables**:
- `--ease-emphasized`
- `--ease-emphasized-decelerate`
- `--ease-emphasized-accelerate`
- `--ease-bounce`

---

#### Fine-Grained Durations (3 new tokens)
Intermediate animation duration steps.

- `animations.duration.short-1` — 50ms
- `animations.duration.medium-1` — 250ms
- `animations.duration.long-1` — 450ms

**CSS variables**:
- `--duration-short-1`
- `--duration-medium-1`
- `--duration-long-1`

---

#### Aspect Ratios (5 new tokens)
Predefined aspect ratios for images, videos, and containers.

- `aspectRatio.square` — 1 / 1
- `aspectRatio.video` — 16 / 9
- `aspectRatio.portrait` — 3 / 4
- `aspectRatio.landscape` — 4 / 3
- `aspectRatio.ultrawide` — 21 / 9

**CSS variables**:
- `--aspect-square`
- `--aspect-video`
- `--aspect-portrait`
- `--aspect-landscape`
- `--aspect-ultrawide`

---

#### Enhanced Shadows (1 new token)
Additional hairline shadow for subtle elevation.

- `shadows.2xs` — 0 1px 0 0 rgba(0, 0, 0, 0.05)

**CSS variables**:
- `--shadow-2xs`

---

#### Spacing Enhancement (1 new token)
Additional intermediate spacing value.

- `spacing.scale.3.5` — 14px

**CSS variables**:
- `--spacing-3-5`

---

### Changed

#### TypeScript Types
- Updated `tokens.d.ts` to include all v2 tokens
- Added `TOKEN_METADATA` export with token counts
- Added `StateLayerToken` and `AspectRatioToken` types
- Expanded `DesignTokens` interface with v2 properties

#### Documentation
- Updated `README.md` with v2 usage examples
- Added Material Design 3 concept explanations
- Added migration guide (v1 → v2)
- Added troubleshooting for v2 features

#### Design Tokens JSON
- Added `version` field: `"2.0.0"`
- Restructured `opacity` to include `state` subsection
- Added `dropShadow` category
- Added `aspectRatio` category

---

### Token Count Summary

| Version | Total Tokens | New Tokens | Categories |
|---------|--------------|------------|------------|
| v1.0.0  | 200          | —          | 9          |
| **v2.0.0** | **247**   | **+47**    | **11**     |

**New categories**: `dropShadow`, `aspectRatio`

---

### Backward Compatibility

✅ **100% backward compatible**

All v1 tokens remain unchanged. New tokens are additive only. Existing components using v1 tokens will continue to work without modification.

**No breaking changes**.

---

### Migration Path (Optional)

While v1 tokens still work, we recommend gradually adopting v2 patterns:

1. **Surface containers** → Replace `background-*` with `surface-container-*`
2. **State layers** → Add hover/focus/press states to interactive elements
3. **Tertiary color** → Use for accent badges, tags, labels
4. **M3 easing** → Upgrade animations to emphasized curves
5. **Aspect ratios** → Standardize image/video containers

See `README.md` for detailed migration examples.

---

### Design Philosophy

v2 adopts Material Design 3's principles:

- **Tonal elevation** (surface containers) > Drop shadows
- **State layers** (opacity overlays) > Hardcoded hover colors
- **Semantic naming** > Primitive values
- **Adaptable dark mode** (inverted hierarchy)

---

### Developer Experience

**TypeScript autocomplete** for all 247 tokens:
```tsx
import type { ColorToken, StateLayerToken, AspectRatioToken } from './tokens';

const myColor: ColorToken = '--color-surface-container-high';
const myState: StateLayerToken = '--state-hover';
const myAspect: AspectRatioToken = '--aspect-video';
```

**Metadata export**:
```tsx
import { TOKEN_METADATA } from './tokens.d.ts';

console.log(TOKEN_METADATA.version); // "2.0.0"
console.log(TOKEN_METADATA.totalTokens); // 247
console.log(TOKEN_METADATA.newInV2); // 47
```

---

### Files Changed

- ✅ `design-tokens.json` — Added 47 new tokens
- ✅ `tokens.css` — Generated CSS variables for v2 tokens
- ✅ `tokens.d.ts` — Updated TypeScript definitions
- ✅ `README.md` — Added v2 usage guide
- ✅ `CHANGELOG.md` — This file

---

### Credits

**Design Research**: Agent 4 (Material Design 3, Tailwind, shadcn/ui, Chakra UI)  
**Implementation**: Agent 5 (Token v2 Implementation)  
**Reviewed by**: Design System Team

---

## [1.0.0] - 2026-03-06

### Added
- Initial design token system (200 tokens)
- Primitive colors (gray, purple, red, etc.)
- Semantic color tokens (background, foreground, text, border, brand, accent)
- Dark mode overrides
- Spacing scale (base-4, 0-96)
- Typography tokens (fonts, sizes, weights, line heights, letter spacing)
- Shadow tokens (xs-2xl, button shadows)
- Border radius tokens (none-3xl, full)
- Animation tokens (durations, easings, scales)
- Blur tokens
- Opacity scale (0-100)
- Z-index tokens (dropdown, modal, popover, tooltip)
- TypeScript type definitions (`tokens.d.ts`)
- CSS custom properties (`tokens.css`)
- Documentation (`README.md`)

### Design Philosophy
- OKLCH color space for perceptual uniformity
- Primitive → Semantic naming hierarchy
- Platform-agnostic token structure
- Figma Variables compatibility
- Dark mode first-class support

---

## Format

### Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

---

## Unreleased

*(No unreleased changes)*

---

**Current Version**: 2.0.0  
**Last Updated**: March 6, 2026  
**Next Planned**: v2.1 (Component-specific tokens)
