# Pejla Component Library - Roadmap & Architecture

**Status:** Foundation Complete (20 stories) + Future Planning  
**Date:** 2026-03-06  
**Owner:** Agent 2

---

## Current State (Phase 1: Foundation) ✅

**20 Component Stories** covering:
- ✅ Core UI primitives (Button, Card, Input, Badge, Avatar, etc.)
- ✅ Form components (Label, Textarea)
- ✅ Feedback components (Dialog, Toast, Progress, Skeleton)
- ✅ Layout components (Tabs)
- ✅ App-specific components (Header, Footer, NotificationBell)
- ✅ Composition examples (LoginForm, PollCard, UploadProgress, LoadingState)

---

## Future Components (Phase 2-5)

### Phase 2: Organizations & Teams (20 components)

**Core Team Management**:
1. **OrganizationSwitcher** - Dropdown with org search, member count, role badge
2. **MemberList** - Table with avatar, name, email, role, actions (edit, remove)
3. **MemberCard** - Card view variant for mobile
4. **InviteForm** - Email input + role selector + invite button
5. **RoleSelect** - Dropdown with permission hints on hover
6. **TeamCard** - Shows team name, member avatars, poll count, activity
7. **TeamList** - Grid/list toggle view of all teams
8. **TeamMemberAvatar** - Avatar with role badge overlay
9. **PermissionMatrix** - Table showing role → permission mapping
10. **InvitationStatus** - Pending/accepted/declined badge with timestamp

**Settings & Billing**:
11. **BillingPlan** - Pricing tier card with feature list, CTA button
12. **PricingTable** - 3-column comparison (Free, Pro, Enterprise)
13. **UsageCard** - Stat card showing polls created, votes received, storage used
14. **BillingHistory** - Table of invoices with download links
15. **PaymentMethodCard** - Card number (masked), expiry, edit/remove actions

**Navigation & Layout**:
16. **SettingsLayout** - Sidebar navigation + content area with breadcrumbs
17. **SettingRow** - Label + control + description (consistent spacing)
18. **DangerZone** - Red-bordered section for destructive actions (delete org, leave team)
19. **SidebarNav** - Collapsible navigation with icons, badges, active state
20. **Breadcrumbs** - Org → Team → Poll navigation trail

---

### Phase 3: Advanced Forms & Content (15 components)

**Rich Input Components**:
21. **MultiStepForm** - Wizard with progress indicator, next/prev buttons, step validation
22. **FileUploadZone** - Drag-drop area with file previews, progress bars, error states
23. **RichTextEditor** - Toolbar with formatting (bold, italic, lists, links, images)
24. **TagInput** - Multi-select input with autocomplete, pill badges, remove X
25. **ColorPicker** - Visual color selector with hex input, recent colors
26. **DateRangePicker** - Start/end date selector with calendar popup
27. **TimeInput** - Clock picker with timezone selector
28. **SliderInput** - Range slider with min/max labels, current value tooltip
29. **RadioCardGroup** - Radio selection styled as clickable cards (vs default radio buttons)
30. **CheckboxCardGroup** - Multi-select card variant

**Content Display**:
31. **MarkdownPreview** - Rendered markdown with syntax highlighting
32. **ImageGallery** - Grid with lightbox, zoom, thumbnails, carousel
33. **VideoPlayer** - Embedded player with controls, thumbnail, duration
34. **AudioPlayer** - Waveform visualization, play/pause, scrubber
35. **CodeBlock** - Syntax-highlighted code with copy button, language label

---

### Phase 4: Data Visualization & Analytics (15 components)

**Metrics & Stats**:
36. **StatCard** - Large number + label + trend indicator (↑ 12% vs last month)
37. **MetricRow** - Label + value + sparkline chart
38. **ProgressRing** - Circular progress (e.g., 75% of plan quota used)
39. **ComparisonCard** - Side-by-side stat comparison (Poll A: 45%, Poll B: 55%)
40. **TrendChart** - Line chart showing metric over time

**Poll Results & Voting**:
41. **PollResults** - Horizontal bar chart with percentages, vote counts
42. **VoteDistribution** - Pie chart or donut chart variant
43. **WinnerBadge** - "🏆 Winner" badge overlay on top result
44. **VoteButton** - Large clickable voting option with radio/checkbox state
45. **ResultsTimeline** - Timeline showing vote activity over time

**Activity & Engagement**:
46. **ActivityFeed** - Chronological list of actions (user voted, commented, etc.)
47. **Leaderboard** - Ranked list with position number, avatar, name, score
48. **CommentThread** - Nested comments with replies, reactions, timestamps
49. **ReactionPicker** - Emoji selector (👍 ❤️ 😂 🎉) with counts
50. **NotificationCard** - Clickable notification with icon, message, timestamp

---

### Phase 5: Onboarding & Empty States (10 components)

**Empty States**:
51. **EmptyState** - Icon + heading + message + CTA button (centered layout)
52. **NoResults** - Search/filter returned nothing, suggest retry or reset
53. **NoPollsYet** - First-time user prompt to create their first poll
54. **NoTeamMembers** - Invite your first team member prompt
55. **NoNotifications** - "You're all caught up!" message

**Onboarding & Help**:
56. **WelcomeModal** - Multi-step intro tour with "Skip" and "Next" buttons
57. **Tooltip** - Hover hint with arrow pointing to target element
58. **HelpCard** - Contextual help with "Learn more" link
59. **FeatureAnnouncement** - New feature highlight with "Got it" dismiss
60. **QuickStartChecklist** - Progress checklist (Create poll ✅, Invite team ✅, Vote ⬜)

---

## Component Library Structure

### Folder Organization

```
src/components/
├── ui/                          # Shadcn/UI primitives (existing)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
│
├── forms/                       # Advanced form components (NEW)
│   ├── MultiStepForm/
│   │   ├── MultiStepForm.tsx
│   │   ├── MultiStepForm.stories.tsx
│   │   ├── MultiStepForm.test.tsx
│   │   └── index.ts
│   ├── FileUploadZone/
│   ├── RichTextEditor/
│   ├── TagInput/
│   └── ...
│
├── data-viz/                    # Charts & analytics (NEW)
│   ├── StatCard/
│   ├── PollResults/
│   ├── ActivityFeed/
│   ├── Leaderboard/
│   └── ...
│
├── teams/                       # Org/team management (NEW)
│   ├── OrganizationSwitcher/
│   ├── MemberList/
│   ├── TeamCard/
│   ├── RoleSelect/
│   └── ...
│
├── settings/                    # Settings & config (NEW)
│   ├── SettingsLayout/
│   ├── SettingRow/
│   ├── DangerZone/
│   ├── BillingPlan/
│   └── ...
│
├── feedback/                    # Feedback & states (existing + expand)
│   ├── EmptyState/
│   ├── NoResults/
│   ├── WelcomeModal/
│   └── ...
│
├── marketing/                   # Landing/marketing (NEW)
│   ├── FeatureGrid/
│   ├── Testimonial/
│   ├── PricingTable/
│   ├── CTASection/
│   └── ...
│
└── app/                         # App-specific (existing)
    ├── Header.tsx
    ├── Footer.tsx
    ├── NotificationBell.tsx
    └── ...
```

---

## Naming Conventions

### Component Files
- **PascalCase**: `OrganizationSwitcher.tsx`, `MultiStepForm.tsx`
- **Index exports**: Each folder has `index.ts` re-exporting component
- **Co-located files**: `.tsx`, `.stories.tsx`, `.test.tsx`, `.module.css` (if needed)

### CSS Classes
- **Design system prefix**: `ds-*` for component-specific classes
- **BEM-style**: `ds-button`, `ds-button--primary`, `ds-button__icon`
- **Tailwind utility-first**: Prefer Tailwind classes, custom CSS only when necessary

### Component Props
- **Variants**: Use `variant` prop for style variations (`variant="primary" | "secondary" | "outline"`)
- **Sizes**: Use `size` prop for sizing (`size="sm" | "md" | "lg"`)
- **States**: Use boolean props (`disabled`, `loading`, `error`)
- **Composition**: Use `children` and slot patterns (`asChild` from Radix)

### Stories
- **Title path**: `Folder/ComponentName` (e.g., `Forms/MultiStepForm`, `Teams/MemberList`)
- **Story names**: `Default`, `Primary`, `Disabled`, `Loading`, `WithIcon`, `DarkMode`
- **Always include**: Default, DarkMode, and at least 3 variants per component

---

## Development Workflow

### Creating a New Component

1. **Create folder structure**:
   ```bash
   mkdir -p src/components/teams/MemberList
   touch src/components/teams/MemberList/{MemberList.tsx,MemberList.stories.tsx,index.ts}
   ```

2. **Implement component** (use design tokens):
   ```tsx
   // MemberList.tsx
   import { cn } from "@/lib/utils";
   
   export function MemberList({ className, ...props }) {
     return (
       <div className={cn("space-y-2", className)} {...props}>
         {/* Implementation using semantic tokens */}
       </div>
     );
   }
   ```

3. **Create Storybook story**:
   ```tsx
   // MemberList.stories.tsx
   import type { Meta, StoryObj } from "@storybook/react-vite";
   import { MemberList } from "./MemberList";
   
   const meta: Meta<typeof MemberList> = {
     title: "Teams/MemberList",
     component: MemberList,
     tags: ["autodocs"],
   };
   
   export default meta;
   type Story = StoryObj<typeof MemberList>;
   
   export const Default: Story = { /* ... */ };
   export const DarkMode: Story = { /* ... */ };
   ```

4. **Add index export**:
   ```ts
   // index.ts
   export { MemberList } from "./MemberList";
   ```

5. **Add to main barrel export** (if needed):
   ```ts
   // src/components/teams/index.ts
   export * from "./MemberList";
   export * from "./TeamCard";
   // ...
   ```

---

## Component API Guidelines

### Composition over Configuration
```tsx
// ❌ Bad: Too many props
<MemberCard 
  showAvatar={true} 
  showRole={true} 
  showActions={true} 
  actionsPosition="right"
/>

// ✅ Good: Composable slots
<MemberCard>
  <MemberCard.Avatar src="..." />
  <MemberCard.Info>
    <MemberCard.Name>John Doe</MemberCard.Name>
    <MemberCard.Role>Admin</MemberCard.Role>
  </MemberCard.Info>
  <MemberCard.Actions>
    <Button>Edit</Button>
  </MemberCard.Actions>
</MemberCard>
```

### Semantic Props
```tsx
// ❌ Bad: Implementation details
<Button color="blue" hoverColor="darkBlue" />

// ✅ Good: Semantic intent
<Button variant="primary" />
```

### Accessible by Default
```tsx
// Every component should have:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader announcements
```

---

## Migration Path

### Phase 2 (Next Sprint): Organizations & Teams
**Priority**: High (Revenue feature)  
**Components**: 10 (OrganizationSwitcher, MemberList, TeamCard, InviteForm, RoleSelect, BillingPlan, PricingTable, UsageCard, SettingsLayout, DangerZone)  
**Estimated time**: 2 weeks

### Phase 3 (Q2 2026): Advanced Forms
**Priority**: Medium (UX improvement)  
**Components**: 8 (MultiStepForm, FileUploadZone, RichTextEditor, TagInput, DateRangePicker, RadioCardGroup, MarkdownPreview, ImageGallery)  
**Estimated time**: 3 weeks

### Phase 4 (Q3 2026): Data Visualization
**Priority**: High (Core feature enhancement)  
**Components**: 10 (StatCard, PollResults, VoteDistribution, WinnerBadge, ActivityFeed, Leaderboard, CommentThread, ReactionPicker, TrendChart, ProgressRing)  
**Estimated time**: 3 weeks

### Phase 5 (Q4 2026): Onboarding & Polish
**Priority**: Medium (Growth feature)  
**Components**: 10 (EmptyState, NoResults, WelcomeModal, Tooltip, HelpCard, FeatureAnnouncement, QuickStartChecklist, etc.)  
**Estimated time**: 2 weeks

---

## Success Metrics

**Coverage**:
- [ ] 60+ components in library (20 current + 40 future)
- [ ] 100% Storybook story coverage
- [ ] 100% dark mode support
- [ ] 100% semantic token usage (no hardcoded values)

**Quality**:
- [ ] 0 a11y violations in Storybook
- [ ] 90%+ TypeScript type coverage
- [ ] All components responsive (320px-1920px)

**Adoption**:
- [ ] 80%+ of features use design system components
- [ ] New features built with component library first
- [ ] 0 one-off UI implementations

---

## Resources

**Documentation**:
- Storybook: http://localhost:6006
- Token docs: `src/tokens/README.md`
- Governance: `src/tokens/GOVERNANCE.md`

**References**:
- Shadcn/UI: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/

---

**This roadmap ensures Pejla's UI scales with the product. Build once, use everywhere. 🚀**
