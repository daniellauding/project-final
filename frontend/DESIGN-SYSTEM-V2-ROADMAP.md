# Design System v2 Roadmap

**Date**: March 6, 2026  
**Author**: Agent 4 (Design System Research)  
**Version**: 1.0  
**Status**: Proposed Implementation Plan

---

## Executive Summary

This 4-week roadmap outlines the implementation of Pejla Design System v2, incorporating research findings from Material Design 3, Tailwind CSS, shadcn/ui, Radix UI, and Chakra UI.

**Timeline**: 4 weeks (March 10 – April 4, 2026)  
**Team**: 2-3 developers + 1 designer  
**Scope**: Token enhancements, component patterns, block library, documentation

**Goals**:
- ✅ Enhanced token system (surface containers, state layers, tertiary color)
- ✅ Component pattern improvements (slots, polymorphic `as`, loading states)
- ✅ Block library (15 reusable page blocks)
- ✅ Documentation (Storybook + MDX guides)

---

## Overview

### Phase Distribution

```
Week 1: Token Enhancements (Foundation)
├── Color tokens (tertiary, surface containers, state layers)
├── Spacing tokens (fine-grained)
├── Animation tokens (easing curves, durations)
└── Documentation update

Week 2: Component Enhancements (Patterns)
├── Button (slots, loading, polymorphic as)
├── Card (elevation, interactive, media slot)
├── Input (prefix/suffix, error states)
└── Component documentation

Week 3: Block Library (Composition)
├── 6 Priority blocks (Hero, Feature Grid, CTA, Empty State, Stats, Multi-Step Form)
├── Block stories in Storybook
└── Block documentation

Week 4: Documentation & Polish
├── Component anatomy guides
├── Accessibility checklist
├── Design-to-code workflow
└── Final review & launch
```

---

## Week 1: Token Enhancements

**Goal**: Establish a robust token foundation based on Material Design 3 and Tailwind patterns.

### Day 1-2: Color Token Expansion

**Tasks**:

1. **Add Tertiary Brand Color**
   - [ ] Define tertiary color in design-tokens.json
     ```json
     {
       "color": {
         "brand": {
           "tertiary": {
             "value": "oklch(0.76 0.19 55)",
             "type": "color"
           },
           "tertiary-foreground": {
             "value": "{color.gray.950}",
             "type": "color"
           }
         }
       }
     }
     ```
   - [ ] Add dark mode variant
   - [ ] Regenerate tokens.css
   - [ ] Update TypeScript types

2. **Add Surface Container Tokens**
   - [ ] Add 5 elevation levels (lowest, low, default, high, highest)
   - [ ] Map to existing background tokens where appropriate
   - [ ] Document use cases (card backgrounds, modal layers)

3. **Add State Layer Tokens**
   - [ ] Add state opacity tokens (hover: 8%, focus: 12%, pressed: 12%)
   - [ ] Add state-layer color variable
   - [ ] Create example usage in CSS

4. **Add Outline Variant Token**
   - [ ] Add outline-variant for subtle borders
   - [ ] Add on-surface-variant for muted text

**Deliverables**:
- [ ] Updated design-tokens.json (47 new tokens)
- [ ] Regenerated tokens.css
- [ ] TypeScript type definitions
- [ ] Token usage documentation (Storybook page)

**Testing**:
- [ ] Light mode: All tokens render correctly
- [ ] Dark mode: All tokens have appropriate dark variants
- [ ] Contrast ratios: WCAG AA compliance (4.5:1 text, 3:1 UI)

---

### Day 3-4: Spacing & Typography

**Tasks**:

1. **Fine-Grained Spacing**
   - [ ] Add spacing-3-5 (14px)
   - [ ] Add spacing-11, 14, 28, 36, 44, 52, 56, 72
   - [ ] Document spacing scale with visual examples

2. **Typography Review**
   - [ ] Confirm text-lg exists (18px) ✅
   - [ ] Add display font weight token (optional)
   - [ ] Document typography scale

**Deliverables**:
- [ ] Updated spacing tokens
- [ ] Typography documentation
- [ ] Visual spacing guide (Storybook)

---

### Day 5: Shadows & Animation

**Tasks**:

1. **Shadow Enhancements**
   - [ ] Add shadow-2xs (ultra-subtle)
   - [ ] Add drop-shadow tokens (xs, sm, md, lg, xl, 2xl)
   - [ ] Document shadow scale with examples

2. **Animation Tokens**
   - [ ] Add emphasized easing curves (M3-inspired)
   - [ ] Add duration variants (50ms, 100ms, 250ms, etc.)
   - [ ] Add bounce easing curve
   - [ ] Document easing curves with visual demos

**Deliverables**:
- [ ] Shadow & animation tokens
- [ ] Interactive easing curve visualizer (Storybook)
- [ ] Motion documentation

---

### Week 1 Deliverables Summary

- [ ] **47 new design tokens** added to design-tokens.json
- [ ] **tokens.css** regenerated with all new tokens
- [ ] **TypeScript types** updated
- [ ] **Storybook documentation** for all token categories
- [ ] **Visual examples** for spacing, shadows, animations

---

## Week 2: Component Enhancements

**Goal**: Apply new tokens and patterns to existing components. Add slot-based architecture, polymorphic `as` prop, and loading states.

### Day 1-2: Button Component

**Tasks**:

1. **Add Tertiary Variant**
   - [ ] Add `tertiary` to buttonVariants CVA
   - [ ] Style with tertiary brand color
   - [ ] Test in light/dark mode

2. **Add Explicit Icon Slots**
   - [ ] Create Button.Icon sub-component
   - [ ] Support leading/trailing/only slots
   - [ ] Extract slotted children in Button component
   - [ ] Update existing button stories

3. **Add Loading State**
   - [ ] Add `loading` and `loadingText` props
   - [ ] Render Spinner component when loading
   - [ ] Disable button during loading
   - [ ] Add data-loading attribute for styling

4. **Add Polymorphic `as` Prop**
   - [ ] Implement polymorphic type definitions
   - [ ] Support rendering as `a`, `Link`, or custom component
   - [ ] Test with Next.js Link, Remix Link

**Deliverables**:
- [ ] Enhanced Button component (button.tsx)
- [ ] Button.Icon sub-component
- [ ] Updated button.stories.tsx (10+ stories)
- [ ] Component documentation (anatomy, props, examples)

**Testing**:
- [ ] All existing button stories still work
- [ ] New variants render correctly
- [ ] Loading state works (disabled, spinner visible)
- [ ] Polymorphic `as` works with links
- [ ] Accessibility: Focus states, keyboard nav, ARIA

---

### Day 3: Card Component

**Tasks**:

1. **Add Elevation Variants**
   - [ ] Add cardVariants CVA with elevation (flat, raised, floating)
   - [ ] Map to surface container tokens
   - [ ] Add shadow variants per elevation

2. **Add Interactive State**
   - [ ] Add `interactive` prop
   - [ ] Add `onPress` handler
   - [ ] Add cursor, hover, active states
   - [ ] Add role="button" when interactive

3. **Add Media Slot**
   - [ ] Create Card.Media sub-component
   - [ ] Position above header (negative margin)
   - [ ] Support images, video, custom content

4. **Add asChild Support**
   - [ ] Support asChild prop for composition
   - [ ] Test with Radix primitives (Dialog.Trigger)

**Deliverables**:
- [ ] Enhanced Card component (card.tsx)
- [ ] Card.Media sub-component
- [ ] Updated card.stories.tsx (elevation variants, interactive, media)
- [ ] Component documentation

**Testing**:
- [ ] Elevation variants visually distinct
- [ ] Interactive cards respond to click/keyboard
- [ ] Media slot renders correctly
- [ ] asChild works with Radix primitives

---

### Day 4: Input Component

**Tasks**:

1. **Add Label Integration**
   - [ ] Accept `label` prop
   - [ ] Render Label component with htmlFor
   - [ ] Link label to input via ID

2. **Add Description & Error**
   - [ ] Add `description` prop (helper text)
   - [ ] Add `error` prop (error message)
   - [ ] Add aria-describedby linking
   - [ ] Add aria-invalid when error present

3. **Add Prefix & Suffix Slots**
   - [ ] Support `prefix` and `suffix` props
   - [ ] Position icons/buttons inside input
   - [ ] Adjust padding when prefix/suffix present

4. **Add Required Indicator**
   - [ ] Render asterisk (*) when `required` prop

**Deliverables**:
- [ ] Enhanced Input component (input.tsx)
- [ ] Updated input.stories.tsx (label, error, prefix, suffix)
- [ ] Component documentation

**Testing**:
- [ ] Label correctly associated (click label focuses input)
- [ ] Error state visible (red border, error message)
- [ ] Prefix/suffix render correctly
- [ ] Accessibility: ARIA attributes, keyboard nav

---

### Day 5: Dialog & Other Components

**Tasks**:

1. **Dialog Size Variants**
   - [ ] Add size prop to Dialog.Content (sm, md, lg, xl, full)
   - [ ] Update dialog.stories.tsx

2. **Badge Enhancements**
   - [ ] Review badge variants
   - [ ] Add tertiary variant (if needed)
   - [ ] Add asChild support

3. **Component Cleanup**
   - [ ] Review all components for consistency
   - [ ] Add data-slot attributes where missing
   - [ ] Update CVA variants to match new tokens

**Deliverables**:
- [ ] Enhanced Dialog component
- [ ] Enhanced Badge component
- [ ] All components use new tokens
- [ ] Consistent data-slot attributes

---

### Week 2 Deliverables Summary

- [ ] **3 enhanced components** (Button, Card, Input) with new patterns
- [ ] **Polymorphic `as` prop** implemented
- [ ] **Loading states** added to Button
- [ ] **Slot-based architecture** for icons, media
- [ ] **Updated Storybook stories** (30+ new stories)
- [ ] **Component documentation** (anatomy, props, accessibility)

---

## Week 3: Block Library

**Goal**: Create 6 priority blocks for marketing pages and app UI. Document in Storybook with live editor.

### Day 1: Marketing Blocks (3)

**Tasks**:

1. **Hero-1 (Centered)**
   - [ ] Implement HeroBlock component
   - [ ] Support badge, headline, subtitle, CTAs, media
   - [ ] Add variants (with/without media, dark background)
   - [ ] Create Storybook story

2. **Feature Grid (3-Column)**
   - [ ] Implement FeatureGridBlock component
   - [ ] Support title, description, features array
   - [ ] Add variants (plain, cards, hover effects)
   - [ ] Create Storybook story

3. **CTA Section (Full-Width)**
   - [ ] Implement CTABlock component
   - [ ] Support headline, subtitle, email input, CTA button
   - [ ] Add variant with background image/gradient
   - [ ] Create Storybook story

**Deliverables**:
- [ ] 3 marketing blocks (hero-1.tsx, feature-grid.tsx, cta-section.tsx)
- [ ] 3 Storybook stories with variants
- [ ] Block usage documentation

---

### Day 2: App Blocks (2)

**Tasks**:

1. **Empty State**
   - [ ] Implement EmptyStateBlock component
   - [ ] Support icon, title, description, action button
   - [ ] Add variants (large, compact, with illustration)
   - [ ] Create Storybook story

2. **Stat Dashboard (4-Column KPIs)**
   - [ ] Implement StatDashboardBlock component
   - [ ] Support stats array (name, value, change, trend)
   - [ ] Add trend indicators (up/down arrow, color)
   - [ ] Create Storybook story

**Deliverables**:
- [ ] 2 app blocks (empty-state.tsx, stat-dashboard.tsx)
- [ ] 2 Storybook stories with variants
- [ ] Block usage documentation

---

### Day 3: Form Block (1)

**Tasks**:

1. **Multi-Step Form**
   - [ ] Implement MultiStepFormBlock component
   - [ ] Support steps array, currentStep, navigation callbacks
   - [ ] Add progress indicator
   - [ ] Support validation per step
   - [ ] Create Storybook story

**Deliverables**:
- [ ] 1 form block (multi-step-form.tsx)
- [ ] 1 Storybook story with 3-step example
- [ ] Block usage documentation

---

### Day 4: Block Documentation

**Tasks**:

1. **Create Block Documentation Site**
   - [ ] Add "Blocks" section to Storybook
   - [ ] Organize by category (Marketing, App, Forms)
   - [ ] Add usage guidelines

2. **Code Export Functionality**
   - [ ] Add "Copy Code" button to each block story
   - [ ] Format code with Prettier
   - [ ] Include imports and props

3. **Visual Examples**
   - [ ] Screenshot each block variant
   - [ ] Add to documentation
   - [ ] Create block gallery page

**Deliverables**:
- [ ] Storybook Blocks section
- [ ] Code export functionality
- [ ] Block gallery with screenshots

---

### Day 5: Additional Blocks (Stretch Goal)

**Tasks** (if time permits):

1. **Pricing Table**
   - [ ] Implement PricingTableBlock component
   - [ ] Support 3-tier layout, billing toggle
   - [ ] Create Storybook story

2. **Settings Panel**
   - [ ] Implement SettingsPanelBlock component
   - [ ] Sidebar + content layout
   - [ ] Create Storybook story

**Deliverables**:
- [ ] 2 additional blocks (optional)
- [ ] Storybook stories

---

### Week 3 Deliverables Summary

- [ ] **6 priority blocks** (Hero, Feature Grid, CTA, Empty State, Stats, Multi-Step Form)
- [ ] **Storybook stories** for all blocks with variants
- [ ] **Block documentation** (usage guidelines, code export)
- [ ] **Visual gallery** with screenshots
- [ ] **(Stretch)** 2 additional blocks

---

## Week 4: Documentation & Polish

**Goal**: Comprehensive documentation, accessibility audit, final polish, and launch.

### Day 1: Component Anatomy Guides

**Tasks**:

1. **Button Anatomy**
   - [ ] Document button structure (container, state layer, label, icons)
   - [ ] Document slots (leading, trailing, only)
   - [ ] Document variants (default, tertiary, outline, secondary, ghost, link)
   - [ ] Document states (hover, focus, pressed, disabled, loading)

2. **Card Anatomy**
   - [ ] Document card structure (container, header, content, footer, media)
   - [ ] Document elevation system (flat, raised, floating)
   - [ ] Document interactive states
   - [ ] Document composition with other components

3. **Input Anatomy**
   - [ ] Document input structure (label, input, prefix, suffix, description, error)
   - [ ] Document states (default, focus, error, disabled)
   - [ ] Document accessibility (ARIA attributes)

**Deliverables**:
- [ ] Component anatomy MDX files (Storybook)
- [ ] Visual diagrams (component structure)
- [ ] Interactive anatomy explorer (Storybook)

---

### Day 2: Accessibility Documentation

**Tasks**:

1. **Accessibility Checklist**
   - [ ] Create WCAG 2.1 AA checklist
   - [ ] Document keyboard shortcuts (Tab, Enter, Space, Escape, Arrows)
   - [ ] Document focus management (focus trap, roving tabindex)
   - [ ] Document screen reader support (ARIA, live regions)

2. **Component Accessibility Audit**
   - [ ] Run axe on all components
   - [ ] Run Lighthouse accessibility audit
   - [ ] Fix any violations
   - [ ] Document accessibility features per component

3. **Testing Guide**
   - [ ] Document how to test with keyboard only
   - [ ] Document how to test with screen reader (VoiceOver, NVDA)
   - [ ] Document how to test color contrast
   - [ ] Document automated testing (axe, jest-axe)

**Deliverables**:
- [ ] Accessibility checklist
- [ ] Component accessibility documentation
- [ ] Testing guide
- [ ] Audit report (Lighthouse, axe)

---

### Day 3: Design-to-Code Workflow

**Tasks**:

1. **Figma Integration**
   - [ ] Sync design tokens to Figma (Tokens Studio plugin)
   - [ ] Create Figma component library matching Pejla components
   - [ ] Document Figma → Code workflow

2. **Component Export Guide**
   - [ ] Document how to extract components from Figma
   - [ ] Document how to map Figma styles to Pejla tokens
   - [ ] Document how to convert Figma variants to CVA variants

3. **Developer Onboarding**
   - [ ] Create onboarding guide (setup, first component)
   - [ ] Create video walkthrough (Loom)
   - [ ] Create FAQ

**Deliverables**:
- [ ] Figma component library
- [ ] Design-to-code workflow guide
- [ ] Developer onboarding guide
- [ ] Video walkthrough

---

### Day 4: Final Polish

**Tasks**:

1. **Performance Audit**
   - [ ] Run Lighthouse performance audit
   - [ ] Optimize bundle size (tree-shaking)
   - [ ] Lazy-load Storybook stories
   - [ ] Optimize images

2. **Code Quality**
   - [ ] Run ESLint, fix all warnings
   - [ ] Run Prettier, format all code
   - [ ] Run TypeScript strict mode, fix all errors
   - [ ] Add JSDoc comments to all components

3. **Testing**
   - [ ] Run unit tests (Jest)
   - [ ] Run accessibility tests (jest-axe)
   - [ ] Run visual regression tests (Chromatic)
   - [ ] Manual QA (all components, all variants)

**Deliverables**:
- [ ] Performance report (Lighthouse 95+)
- [ ] Code quality report (ESLint, TypeScript)
- [ ] Test coverage report (80%+)
- [ ] QA checklist completed

---

### Day 5: Launch

**Tasks**:

1. **Release Notes**
   - [ ] Write Design System v2 release notes
   - [ ] Highlight new features (tokens, components, blocks)
   - [ ] Document breaking changes (if any)
   - [ ] Create migration guide (v1 → v2)

2. **Announcement**
   - [ ] Share in #design-system Slack channel
   - [ ] Present to team (demo, Q&A)
   - [ ] Update README

3. **Monitoring**
   - [ ] Set up usage analytics (which components/blocks used most)
   - [ ] Monitor performance metrics
   - [ ] Collect feedback from team

**Deliverables**:
- [ ] Release notes
- [ ] Team announcement
- [ ] Updated README
- [ ] Analytics dashboard

---

### Week 4 Deliverables Summary

- [ ] **Component anatomy guides** (Button, Card, Input + others)
- [ ] **Accessibility documentation** (WCAG checklist, testing guide)
- [ ] **Design-to-code workflow** (Figma integration)
- [ ] **Developer onboarding guide** (setup, tutorials, FAQ)
- [ ] **Performance & quality audit** (Lighthouse, ESLint, tests)
- [ ] **Design System v2 launch** (release notes, announcement)

---

## Success Metrics

### Token System
- [ ] **47 new tokens** added
- [ ] **100% dark mode coverage** (all tokens have dark variants)
- [ ] **WCAG AA compliance** (4.5:1 text, 3:1 UI)

### Component System
- [ ] **Slot-based architecture** in 3+ components
- [ ] **Polymorphic `as` prop** in 2+ components
- [ ] **Loading states** in Button (extendable to other components)
- [ ] **100% CVA variant coverage** (all variants use tokens)

### Block Library
- [ ] **6+ blocks** (Hero, Feature Grid, CTA, Empty State, Stats, Multi-Step Form)
- [ ] **Storybook stories** for all blocks (3+ variants each)
- [ ] **Code export** functionality (1-click copy)

### Documentation
- [ ] **Component anatomy guides** (3+ components)
- [ ] **Accessibility checklist** (WCAG 2.1 AA)
- [ ] **Design-to-code workflow** (Figma integration)
- [ ] **Developer onboarding** (<30 min setup time)

### Quality
- [ ] **Lighthouse score**: 95+ (performance, accessibility, SEO)
- [ ] **Test coverage**: 80%+ (unit + accessibility tests)
- [ ] **Accessibility**: 100% (axe, WCAG AA)
- [ ] **TypeScript**: 100% type coverage (strict mode)

---

## Risk Mitigation

### Risk 1: Breaking Changes

**Risk**: Token changes break existing components.

**Mitigation**:
- Add new tokens without removing old ones
- Use aliases for deprecated tokens
- Document migration path (old → new)
- Test all existing components after token changes

### Risk 2: Scope Creep

**Risk**: Team adds more features, delays launch.

**Mitigation**:
- Strict scope definition (47 tokens, 6 blocks, 3 components)
- "Stretch goals" clearly marked (optional)
- Time-box each phase (1 week max)
- Ship MVP, iterate later

### Risk 3: Team Bandwidth

**Risk**: Team pulled into other work (bugs, features).

**Mitigation**:
- Assign dedicated team (2 devs + 1 designer)
- Block calendars for design system work
- Daily standup (15 min progress check)
- Clear communication with stakeholders

### Risk 4: Accessibility Issues

**Risk**: Components fail accessibility audit.

**Mitigation**:
- Run axe early and often (daily checks)
- Test with keyboard + screen reader (weekly)
- Use Radix primitives (built-in accessibility)
- Document accessibility per component

---

## Team Structure

### Roles

**Design System Lead** (1 developer):
- Overall architecture
- Token system design
- Component patterns
- Code reviews

**Component Developer** (1 developer):
- Component enhancements (Button, Card, Input)
- CVA variant implementation
- Accessibility testing
- Storybook stories

**Block Developer** (1 developer):
- Block library implementation
- Storybook block documentation
- Code export functionality
- Visual gallery

**Designer** (1 designer):
- Token definitions (colors, spacing, typography)
- Figma component library
- Visual design QA
- Design-to-code workflow

**QA/Accessibility** (shared role):
- Accessibility audits (axe, Lighthouse)
- Manual testing (keyboard, screen reader)
- Visual regression testing
- Final QA before launch

---

## Checkpoints

### Week 1 Checkpoint (Day 5)
**Review**:
- [ ] All tokens added to design-tokens.json
- [ ] tokens.css regenerated
- [ ] TypeScript types updated
- [ ] Storybook token documentation complete

**Decision Point**: Continue to Week 2 or revisit token system?

---

### Week 2 Checkpoint (Day 5)
**Review**:
- [ ] Button, Card, Input enhanced with new patterns
- [ ] Polymorphic `as` prop working
- [ ] Loading states implemented
- [ ] All components use new tokens

**Decision Point**: Continue to Week 3 or polish components?

---

### Week 3 Checkpoint (Day 5)
**Review**:
- [ ] 6 priority blocks implemented
- [ ] Storybook block stories complete
- [ ] Code export functionality working
- [ ] Block documentation written

**Decision Point**: Continue to Week 4 or add more blocks?

---

### Week 4 Checkpoint (Day 5)
**Review**:
- [ ] Component anatomy guides complete
- [ ] Accessibility audit passed (Lighthouse 100)
- [ ] Design-to-code workflow documented
- [ ] Ready for launch

**Decision Point**: Launch or address final issues?

---

## Post-Launch (Week 5+)

### Immediate Next Steps (Week 5)

**Feedback Collection**:
- [ ] Gather team feedback (what works, what doesn't)
- [ ] Monitor usage analytics (which components/blocks used most)
- [ ] Document pain points

**Iteration**:
- [ ] Fix reported bugs
- [ ] Add missing variants (based on feedback)
- [ ] Improve documentation (FAQs, examples)

### Future Enhancements (Month 2-3)

**Block Library Expansion**:
- [ ] Add 10+ additional blocks (Pricing, Testimonials, Data Table, Activity Feed, etc.)
- [ ] Create block composition guide (combining blocks)
- [ ] Build block playground (drag-drop editor)

**Advanced Component Patterns**:
- [ ] Extract unstyled primitives (separate from styled components)
- [ ] Add compound variants (CVA compoundVariants)
- [ ] Create layout components (Group, Stack, Grid)

**Automation**:
- [ ] Figma → Code automation (design tokens sync)
- [ ] Visual regression testing (Chromatic)
- [ ] Automated changelog generation (release notes)

---

## Conclusion

This 4-week roadmap provides a structured path to enhancing Pejla's design system with industry best practices from Material Design 3, Tailwind CSS, shadcn/ui, and Chakra UI.

**Key Outcomes**:
- **Robust token system** (47 new tokens, dark mode coverage)
- **Modern component patterns** (slots, polymorphic `as`, loading states)
- **Comprehensive block library** (6+ reusable page blocks)
- **Excellent documentation** (anatomy guides, accessibility, Figma integration)

**Timeline**: March 10 – April 4, 2026 (4 weeks)

**Success**: Pejla designers and developers can build consistent, accessible UI faster with less code.

---

**End of Design System v2 Roadmap**

Ready to start Week 1: Token Enhancements! 🚀
