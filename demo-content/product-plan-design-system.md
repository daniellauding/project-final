# Product Plan: Design System v2

## Why now
- 3 squads shipping UI independently — visual inconsistency growing
- Designers spend ~5h/week rebuilding components that already exist
- Brand refresh coming Q3 — need a scalable foundation

## Vision
One source of truth for UI across web, iOS, and Android. Designers grab from Figma library, devs grab from npm package. Same tokens, same components, same language.

## What exists today
- Figma library: 42 components, outdated, no documentation
- React component library: 28 components, no tests, no Storybook
- No shared tokens — colors hardcoded everywhere

## Phase 1: Foundation (4 weeks)
- [ ] Audit existing components across all 3 products
- [ ] Define design tokens: color, spacing, typography, radius, shadows
- [ ] Set up token pipeline: Figma variables → Style Dictionary → CSS/iOS/Android
- [ ] Migrate 10 core components (Button, Input, Card, Modal, Avatar, Badge, Tabs, Toggle, Tooltip, Select)

## Phase 2: Adoption (4 weeks)
- [ ] Storybook with docs + usage examples
- [ ] npm package with tree-shaking
- [ ] Figma library rebuild with variants + auto-layout
- [ ] Migration guide for each squad
- [ ] Weekly "component clinic" office hours

## Phase 3: Scale (ongoing)
- [ ] Contribution model — squads can propose new components
- [ ] Visual regression testing (Chromatic)
- [ ] Figma plugin for token inspection
- [ ] Accessibility audit per component

## Open questions (good for a Pejla poll)
1. Naming convention: `Button` vs `DSButton` vs `@company/button`?
2. Dark mode: ship in v2.0 or v2.1?
3. Icon library: Lucide, Phosphor, or custom?

## Team
- 1 design systems designer (full-time)
- 1 frontend engineer (full-time)
- 1 PM (20%)
- Squad designers contribute 10% each
