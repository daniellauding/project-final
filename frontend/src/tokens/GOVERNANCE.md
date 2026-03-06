# Design System Governance

**Last Updated**: 2026-03-06  
**Version**: 1.0.0  
**Maintainer**: Design System Team

---

## Purpose

This document defines rules, processes, and best practices for maintaining the Pejla design system. Following these guidelines ensures:
- **Consistency** across all platforms (web, mobile, marketing)
- **Scalability** as the team and product grow
- **Quality** through systematic reviews and automation
- **Accessibility** for all users (WCAG 2.1 AA minimum)

---

## 1. Adding New Tokens

### Decision Tree

Before adding a new token, ask:

1. **Does this pattern repeat 3+ times?**  
   - ❌ No → Use inline value or arbitrary Tailwind class  
   - ✅ Yes → Continue to next question

2. **Can it be composed from existing tokens?**  
   - ✅ Yes → Use composition instead (e.g., `border-border` + `shadow-sm`)  
   - ❌ No → Continue to next question

3. **Is it semantic (describes purpose) or primitive (describes value)?**  
   - **Semantic**: Describes *what* it's used for (`color-brand-primary`, `spacing-section`)
   - **Primitive**: Describes *what* it is (`color-purple-500`, `spacing-4`)  
   - Prefer **semantic tokens** for component APIs

4. **Is this a platform-specific token?**  
   - ✅ Yes → Add to platform-specific tokens (e.g., `mobile.spacing.insets`)  
   - ❌ No → Add to shared tokens

### Proposal Process

#### Step 1: Document the Need
Create a proposal in the design system Slack channel (`#pejla-design-system`):

```markdown
**Token Proposal**

**Name**: `color-animation-cursor-pink`  
**Type**: Primitive color  
**Value**: `oklch(0.769 0.188 70.08)` (pink-500)  
**Use Case**: Animated cursor trails on Home page  
**Occurrences**: 3 (Home.tsx lines 406, 432, 561)  
**Alternatives Considered**: Used `color-brand-pink`, but animation needs non-brand color  

**Semantic Token?** No - this is animation-specific, not part of brand identity.  
**Approval Needed**: Design Lead  
```

#### Step 2: Get Approval
- **For primitive tokens** (colors, spacing): Design Lead approval required
- **For semantic tokens** (brand, UI states): Product Owner + Design Lead approval
- **For breaking changes** (removal, rename): Full team vote

#### Step 3: Add to design-tokens.json
```json
{
  "colors": {
    "animation": {
      "cursor": {
        "pink": "oklch(0.769 0.188 70.08)",
        "blue": "oklch(0.6 0.118 184.704)",
        "green": "oklch(0.696 0.17 162.48)"
      }
    }
  }
}
```

#### Step 4: Generate CSS Variables
```bash
# Regenerate tokens.css from design-tokens.json
npm run tokens:generate
```

#### Step 5: Document Usage
Add example to `src/tokens/README.md`:

```markdown
### Animation Colors

Used for cursor trails and interactive animations.

\`\`\`tsx
// Animated cursor trail
<div style={{ backgroundColor: 'var(--color-animation-cursor-pink)' }} />
\`\`\`
```

#### Step 6: Create Storybook Story
Show new token in context:

```tsx
// AnimationColors.stories.tsx
export const CursorTrails: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'var(--color-animation-cursor-pink)' }} />
      <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'var(--color-animation-cursor-blue)' }} />
      <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'var(--color-animation-cursor-green)' }} />
    </div>
  ),
};
```

#### Step 7: Update Migration Manifest
Mark affected files and update coverage metrics in `MIGRATION-MANIFEST.md`.

---

## 2. Changing Existing Tokens

### Semantic Versioning

Token changes follow **semantic versioning** (semver):

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| **Breaking** | Major (1.0.0 → 2.0.0) | Remove token, rename token |
| **Minor** | Minor (1.0.0 → 1.1.0) | Add new token, add dark mode variant |
| **Patch** | Patch (1.0.0 → 1.0.1) | Change token value (color, spacing) |

### Breaking Changes (Require Team Vote)

**Removing a token**:
1. Deprecate first (add `deprecated: true` to token metadata)
2. Document migration path in MIGRATION.md
3. Wait 1 major release cycle (1 month)
4. Remove in next major version

**Renaming a token**:
1. Add new token with new name
2. Mark old token as deprecated
3. Create codemod script to auto-migrate
4. Remove old token in next major version

**Example**:
```json
{
  "colors": {
    "brand": {
      "primary": "oklch(0.72 0.11 270)",
      "accent": {
        "value": "oklch(0.72 0.11 270)",
        "deprecated": true,
        "replaceWith": "brand.primary"
      }
    }
  }
}
```

### Non-Breaking Changes (No Approval Needed)

**Adding new tokens**: Always safe (doesn't affect existing code)  
**Changing token values**: Safe if it improves consistency (e.g., fixing color contrast)

**Example**: Adjusting `color-brand-primary` lightness from `0.72` to `0.70` for better accessibility.

---

## 3. Component Creation Guidelines

### Component Checklist

Every new component MUST meet these criteria before merge:

#### ✅ Design System Compliance
- [ ] Uses semantic tokens (not primitive or hardcoded values)
- [ ] No hex colors (`#f9a8d4`)
- [ ] No arbitrary Tailwind values unless absolutely necessary (`w-[427px]`)
- [ ] Supports dark mode (test with theme toggle)

#### ✅ Accessibility (WCAG 2.1 AA)
- [ ] Color contrast ≥4.5:1 for text
- [ ] Keyboard navigable (all interactive elements)
- [ ] Screen reader friendly (ARIA labels, semantic HTML)
- [ ] Focus indicators visible
- [ ] No reliance on color alone to convey information

#### ✅ Responsive Design
- [ ] Mobile-first approach (320px → 1600px)
- [ ] Tested on: iPhone SE, iPad, Desktop (1920px)
- [ ] Touch targets ≥44px for mobile
- [ ] Text remains readable at all sizes

#### ✅ Documentation
- [ ] Storybook story with 3+ variants
- [ ] JSDoc comments on component props
- [ ] Usage example in story
- [ ] Dark mode variant in story

#### ✅ Code Quality
- [ ] TypeScript types defined
- [ ] No ESLint warnings
- [ ] Component exported from index.ts
- [ ] File naming: PascalCase (`MyComponent.tsx`)

---

### Component Naming Conventions

#### File Names
```
PascalCase.tsx
✅ Button.tsx
✅ NotificationBell.tsx
❌ button.tsx
❌ notification-bell.tsx
```

#### CSS Class Names
```
kebab-case with optional prefix
✅ ds-button
✅ notification-badge
❌ Button
❌ notification_badge
```

#### Component Variants
```
Use descriptive names, avoid abbreviations
✅ variant="destructive"
✅ size="large"
❌ variant="dest"
❌ size="lg"
```

---

### Component Structure Template

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * MyComponent - Brief description
 * 
 * @example
 * \```tsx
 * <MyComponent variant="primary" size="medium">
 *   Content
 * </MyComponent>
 * \```
 */

const myComponentVariants = cva(
  "base-classes", // Use semantic tokens here
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  /**
   * Additional prop documentation
   */
  customProp?: string;
}

export function MyComponent({
  className,
  variant,
  size,
  customProp,
  ...props
}: MyComponentProps) {
  return (
    <div
      data-slot="my-component"
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

---

## 4. Code Review Process

### Pull Request Checklist

Before requesting review, ensure:

#### ✅ Design Token Usage
- [ ] No hex colors in code (`#f9a8d4`)
- [ ] No hardcoded Tailwind colors (`bg-red-500`)
- [ ] Arbitrary values justified with comment
- [ ] All colors work in dark mode

#### ✅ Storybook
- [ ] Story file exists (`.stories.tsx`)
- [ ] 3+ variants shown
- [ ] Dark mode variant included
- [ ] Mobile variant included (if relevant)

#### ✅ Accessibility
- [ ] Lighthouse accessibility score ≥95
- [ ] No color contrast violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested (VoiceOver/NVDA)

#### ✅ Tests (Future)
- [ ] Unit tests for logic
- [ ] Visual regression tests (Percy/Chromatic)
- [ ] Interaction tests (Playwright)

---

### Reviewer Responsibilities

**Design System Review** (required for all component PRs):
- Verify semantic token usage
- Check dark mode support
- Ensure accessibility compliance
- Approve Storybook stories

**Code Review** (standard engineering review):
- Check TypeScript types
- Verify no ESLint warnings
- Ensure tests pass
- Review code quality

---

### Approval Requirements

| Change Type | Approvals Required |
|-------------|-------------------|
| New token | Design Lead (1) |
| New component | Design System + Code Review (2) |
| Breaking change | Full team vote (5+) |
| Bug fix | Code Review (1) |
| Documentation | Any team member (1) |

---

## 5. Automation & Enforcement

### ESLint Rules (Planned for v1.1)

```json
{
  "rules": {
    "@pejla/no-hardcoded-colors": "error",
    "@pejla/prefer-semantic-tokens": "error",
    "@pejla/no-arbitrary-spacing": "warn"
  }
}
```

### Pre-commit Hooks (Planned for v1.1)

```bash
#!/bin/bash
# .husky/pre-commit

# Block hardcoded hex colors
if git diff --cached --name-only | grep -E "\.(tsx?|jsx?)$" | xargs grep -l "#[0-9a-fA-F]{6}"; then
  echo "❌ Hardcoded hex colors found. Use design tokens instead."
  echo "See: src/tokens/README.md"
  exit 1
fi

# Warn about arbitrary values
if git diff --cached --name-only | grep -E "\.(tsx?|jsx?)$" | xargs grep -l "\[.*px\]"; then
  echo "⚠️  Arbitrary spacing values found. Consider using standard scale."
fi

# Run Storybook build
npm run storybook:build || {
  echo "❌ Storybook build failed. Fix stories before committing."
  exit 1
}
```

### CI/CD Checks

**On every PR**:
- ✅ ESLint passes (no errors)
- ✅ TypeScript compiles
- ✅ Storybook builds successfully
- ✅ Lighthouse accessibility score ≥95
- ✅ Visual regression tests pass (future)

**On main merge**:
- ✅ Deploy Storybook to production
- ✅ Update design token documentation
- ✅ Notify #pejla-design-system Slack channel

---

## 6. Design Token Versioning

### Token Package Structure (Future)

```
@pejla/design-tokens/
├── package.json        # version: "1.2.0"
├── tokens.json         # Source of truth
├── dist/
│   ├── css/            # CSS custom properties
│   ├── scss/           # Sass variables
│   ├── js/             # JavaScript objects
│   ├── ios/            # Swift tokens
│   └── android/        # Kotlin tokens
└── CHANGELOG.md        # Semver changelog
```

### Version Strategy

**Major (1.0.0 → 2.0.0)**:
- Token removed
- Token renamed
- Token structure changed

**Minor (1.0.0 → 1.1.0)**:
- Token added
- Dark mode variant added
- New token category added

**Patch (1.0.0 → 1.0.1)**:
- Token value adjusted (color, spacing, etc.)
- Documentation updated
- Bug fix (incorrect value)

---

## 7. Platform-Specific Guidelines

### Web (React)

**Preferred**:
```tsx
<Button variant="primary" size="medium">
  Click me
</Button>
```

**Acceptable**:
```tsx
<div className="bg-brand-primary text-white">
  Custom component
</div>
```

**❌ Avoid**:
```tsx
<div className="bg-purple-500">  {/* Use semantic token */}
<div style={{ color: '#ff0000' }}>  {/* Use CSS variable */}
```

---

### Mobile (React Native - Future)

**Preferred**:
```tsx
import { tokens } from '@pejla/design-tokens/react-native';

<View style={{ backgroundColor: tokens.color.brand.primary }}>
```

**Acceptable**:
```tsx
<View style={styles.container}>
  {/* Custom styles */}
</View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.color.brand.primary,
  },
});
```

---

### Marketing Site (Future)

**Preferred**:
```css
/* Use CSS custom properties */
.hero-section {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}
```

---

## 8. Exceptions & Special Cases

### When Hardcoded Values Are OK

#### Storybook Stories
**Reason**: Container widths for demonstration purposes  
**Example**: `<Card className="w-[400px]">` in `.stories.tsx` files  
**Rule**: Must include comment explaining it's for demo only

#### Third-Party Components
**Reason**: External libraries may require specific formats  
**Example**: `react-markdown` inline styles  
**Rule**: Wrap in custom component with semantic props

#### Animation-Specific Values
**Reason**: One-off animation timings or easing curves  
**Example**: `transition: transform 427ms cubic-bezier(0.34, 1.56, 0.64, 1)`  
**Rule**: Add comment explaining animation purpose

#### Data Visualizations
**Reason**: Dynamic colors based on data (charts, graphs)  
**Example**: Color scales interpolated from data  
**Rule**: Use design tokens as base colors, interpolate dynamically

---

### Temporary Exceptions (Tech Debt)

**Current exceptions** (to be migrated):
1. `pages/Home.tsx` - Animation cursor colors (awaiting token approval)
2. `components/NotificationBell.tsx` - Red badge (use `destructive` token)

**How to request exception**:
1. Create GitHub issue with `design-system` label
2. Document why standard approach doesn't work
3. Propose migration plan with timeline
4. Get Design Lead approval

---

## 9. Onboarding & Training

### For New Developers

**Required Reading** (30 min):
1. `src/tokens/README.md` - Token overview
2. `src/tokens/MIGRATION.md` - How to use tokens
3. This governance doc - Rules and processes

**Hands-On Exercise** (1 hour):
1. Create a simple component (e.g., `StatusBadge`)
2. Use semantic tokens for colors
3. Add Storybook story with light/dark variants
4. Submit PR and get design system review

**Mentorship**:
- Pair with design system maintainer on first PR
- Join #pejla-design-system Slack channel
- Attend design system office hours (Fridays 3pm)

---

### For Designers

**Figma Setup** (future):
1. Install Pejla Design Tokens plugin
2. Sync tokens from GitHub
3. Use token variables in designs
4. Export tokens back to code

**Handoff Process**:
1. Designer creates mockup using token variables
2. Annotate with token names (`color-brand-primary`, not hex codes)
3. Export to Figma Dev Mode
4. Developer implements using same tokens

---

## 10. Support & Resources

### Getting Help

**Quick Questions**:
- Slack: #pejla-design-system
- DM: @design-system-bot

**Token Proposals**:
- GitHub Discussions: `Design System` category
- Template: `.github/DISCUSSION_TEMPLATE/token-proposal.md`

**Bug Reports**:
- GitHub Issues: `design-system` label
- Template: `.github/ISSUE_TEMPLATE/design-system-bug.md`

---

### Useful Links

- **Documentation**: `src/tokens/README.md`
- **Migration Guide**: `src/tokens/MIGRATION.md`
- **Migration Manifest**: `src/tokens/MIGRATION-MANIFEST.md`
- **Storybook**: https://pejla-storybook.netlify.app (future)
- **Figma Tokens**: https://figma.com/@pejla/design-tokens (future)

---

## 11. Changelog

### v1.0.0 (2026-03-06)
- 🎉 Initial governance document
- ✅ Token proposal process defined
- ✅ Component checklist created
- ✅ Review process documented

---

**Questions or feedback?** Discuss in #pejla-design-system or open a GitHub discussion.

---

**Maintained by**: Design System Team  
**Last Updated**: 2026-03-06  
**Version**: 1.0.0
