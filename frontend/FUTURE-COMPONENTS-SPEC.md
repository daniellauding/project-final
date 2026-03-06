# Future Components - Detailed Specifications

**Purpose:** Define 20+ standard components needed for Pejla's roadmap (Phases 2-5)  
**Status:** Planning / Wireframes created  
**Date:** 2026-03-06

---

## Overview

This document specifies future components needed for:
- **Phase 2**: Organizations & Teams (Monetization foundation)
- **Phase 3**: Advanced Forms & Content (UX improvements)
- **Phase 4**: Data Visualization & Analytics (Core features)
- **Phase 5**: Onboarding & Growth (User acquisition)

---

## Phase 2: Organizations & Teams (20 Components)

### 1. OrganizationSwitcher
**Category:** Navigation  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Allow users to switch between multiple organizations they belong to.

**Features:**
- Dropdown menu with organization list
- Search/filter organizations
- Show member count and role badge per org
- "Create new organization" option
- Keyboard navigation support

**Design Tokens:**
- `colors.accent` for hover state
- `spacing.2` for padding
- `shadows.base` for dropdown elevation

**API Props:**
```tsx
interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentOrgId: string;
  onSwitch: (orgId: string) => void;
  onCreateNew?: () => void;
  showMemberCount?: boolean;
}
```

**Accessibility:**
- `role="menu"` for dropdown
- `aria-expanded` for trigger button
- Keyboard: `↑↓` to navigate, `Enter` to select

---

### 2. MemberList
**Category:** Data Display  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Display and manage organization/team members with roles and actions.

**Features:**
- Table view with avatar, name, email, role
- Inline role editing (dropdown)
- Member removal action
- Bulk selection and actions
- Search and filter by role
- Mobile-responsive card layout

**Design Tokens:**
- `colors.border` for table borders
- `spacing.3` for row padding
- `colors.destructive` for remove action

**API Props:**
```tsx
interface MemberListProps {
  members: Member[];
  onEditRole?: (memberId: string, newRole: Role) => void;
  onRemove?: (memberId: string) => void;
  onBulkAction?: (memberIds: string[], action: string) => void;
  showActions?: boolean;
  variant?: 'table' | 'card';
}
```

**States:**
- Loading (skeleton rows)
- Empty (no members yet)
- Error (failed to load)

---

### 3. InviteForm
**Category:** Forms  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Invite new members to organization/team with role selection.

**Features:**
- Email input with validation
- Role selector with permission hints
- Optional custom message
- Bulk invite (multiple emails, comma-separated)
- Copy invite link option

**Design Tokens:**
- `colors.primary` for submit button
- `colors.muted` for help text
- `spacing.4` for form spacing

**API Props:**
```tsx
interface InviteFormProps {
  onSubmit: (data: InviteData) => Promise<void>;
  availableRoles: Role[];
  defaultRole?: Role;
  allowBulkInvite?: boolean;
  showMessageField?: boolean;
}
```

**Validation:**
- Email format check
- Duplicate email detection
- Maximum invites per batch

---

### 4. RoleSelect
**Category:** Forms  
**Priority:** Medium (P1)  
**Wireframe:** Pending

**Purpose:**  
Dropdown selector for user roles with permission previews.

**Features:**
- Dropdown with role list
- Hover to show permissions tooltip
- Icon/badge for each role level
- Disabled state for locked roles
- Search/filter roles (for large lists)

**Design Tokens:**
- `colors.accent` for selected role
- `shadows.sm` for dropdown
- `colors.muted-foreground` for help text

**API Props:**
```tsx
interface RoleSelectProps {
  roles: Role[];
  selectedRole: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
  showPermissions?: boolean;
}

interface Role {
  id: string;
  name: string;
  icon?: React.ReactNode;
  permissions: Permission[];
  color?: string;
}
```

---

### 5. TeamCard
**Category:** Data Display  
**Priority:** Medium (P1)  
**Wireframe:** Pending

**Purpose:**  
Display team information with member previews and quick actions.

**Features:**
- Team name and description
- Member avatar stack (show first 5, "+N more")
- Poll count and activity indicator
- Quick actions (view, edit, leave)
- Hover effects and animations

**Design Tokens:**
- `colors.card` for background
- `spacing.4` for padding
- `shadows.base` for elevation

**API Props:**
```tsx
interface TeamCardProps {
  team: Team;
  members: Member[];
  pollCount: number;
  onView?: () => void;
  onEdit?: () => void;
  onLeave?: () => void;
  showActions?: boolean;
}
```

---

### 6-10. Additional Team Components

**6. BillingPlan** (Pricing tier card)  
**7. PricingTable** (3-column comparison)  
**8. UsageCard** (Quota consumption)  
**9. SettingsLayout** (Sidebar + content)  
**10. DangerZone** (Destructive actions)

[Detailed specs in COMPONENT-LIBRARY-ROADMAP.md]

---

## Phase 3: Advanced Forms (15 Components)

### 11. MultiStepForm
**Category:** Forms  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Create multi-step wizards with progress tracking and validation.

**Features:**
- Step indicator (visual progress)
- Step validation before advancing
- Back/Next navigation
- Step skipping (optional steps)
- Save draft between steps
- Mobile-friendly layout

**Design Tokens:**
- `colors.primary` for completed steps
- `colors.muted` for pending steps
- `spacing.6` for step spacing

**API Props:**
```tsx
interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onNext: (data: StepData) => void;
  onBack: () => void;
  onSubmit: (allData: FormData) => void;
  allowSkip?: boolean;
  saveDraft?: boolean;
}

interface Step {
  id: string;
  title: string;
  component: React.ComponentType;
  validate?: (data: any) => boolean;
  optional?: boolean;
}
```

**Accessibility:**
- `aria-current="step"` for active step
- `aria-label` for step number
- Keyboard: `Tab` to navigate fields, `Ctrl+Enter` to submit

---

### 12. FileUploadZone
**Category:** Forms  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Drag-and-drop file upload with previews and progress tracking.

**Features:**
- Drag-and-drop area
- Click to browse files
- Multiple file upload
- File type validation
- File size validation
- Image thumbnail previews
- Upload progress per file
- Remove file action
- Retry failed uploads

**Design Tokens:**
- `colors.border-dashed` for dropzone
- `colors.accent` for drag-over state
- `spacing.8` for dropzone padding

**API Props:**
```tsx
interface FileUploadZoneProps {
  onUpload: (files: File[]) => Promise<UploadResult[]>;
  accept?: string; // 'image/*', '.pdf', etc.
  maxSize?: number; // bytes
  maxFiles?: number;
  multiple?: boolean;
  showPreviews?: boolean;
}
```

**States:**
- Idle (ready for upload)
- Drag over (highlight dropzone)
- Uploading (show progress)
- Error (validation failed)
- Success (upload complete)

---

### 13. RichTextEditor
**Category:** Forms  
**Priority:** Medium (P1)  
**Wireframe:** ✅ Created

**Purpose:**  
Rich text editing for poll descriptions, comments, and content.

**Features:**
- Formatting toolbar (bold, italic, underline, strikethrough)
- Lists (ordered, unordered)
- Links (insert, edit, remove)
- Images (upload, resize, alt text)
- Code blocks (with language selector)
- Markdown support (optional)
- Preview mode
- Auto-save drafts
- Character/word count

**Design Tokens:**
- `colors.muted` for toolbar background
- `colors.border` for editor border
- `fonts.mono` for code blocks

**API Props:**
```tsx
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  features?: EditorFeature[];
  autoSave?: boolean;
  markdownMode?: boolean;
}

type EditorFeature =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'link'
  | 'image'
  | 'code'
  | 'list';
```

---

### 14-25. Additional Form Components

**14. TagInput** (Multi-select with autocomplete)  
**15. ColorPicker** (Visual color selector)  
**16. DateRangePicker** (Start/end date)  
**17. TimeInput** (Clock picker)  
**18. SliderInput** (Range slider)  
**19. RadioCardGroup** (Radio as cards)  
**20. CheckboxCardGroup** (Multi-select cards)  
**21. MarkdownPreview** (Rendered markdown)  
**22. ImageGallery** (Grid with lightbox)  
**23. VideoPlayer** (Embedded video)  
**24. AudioPlayer** (Audio controls)  
**25. CodeBlock** (Syntax highlighting)

[Detailed specs available upon request]

---

## Phase 4: Data Visualization (15 Components)

### 26. StatCard
**Category:** Data Display  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Display key metrics with trend indicators.

**Features:**
- Large number display
- Label/description
- Trend indicator (↑↓ with percentage)
- Comparison period (vs last month/week)
- Optional sparkline chart
- Color coding (green=up, red=down)
- Loading skeleton state

**Design Tokens:**
- `colors.success` for positive trends
- `colors.destructive` for negative trends
- `spacing.4` for card padding

**API Props:**
```tsx
interface StatCardProps {
  label: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  sparkline?: number[];
  loading?: boolean;
}
```

---

### 27. PollResults
**Category:** Data Display  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Visualize poll voting results with bar charts.

**Features:**
- Horizontal bar chart
- Vote counts and percentages
- Winner badge (🏆 for top result)
- Animated progress bars
- Color gradients
- Export to image/CSV
- Filter by date range
- Sort by votes/alphabetical

**Design Tokens:**
- `colors.primary` for winning option
- `colors.accent` for other options
- `spacing.3` for bar spacing

**API Props:**
```tsx
interface PollResultsProps {
  options: PollOption[];
  totalVotes: number;
  showPercentages?: boolean;
  showWinner?: boolean;
  animated?: boolean;
  onExport?: (format: 'png' | 'csv') => void;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  imageUrl?: string;
}
```

---

### 28. ActivityFeed
**Category:** Data Display  
**Priority:** Medium (P1)  
**Wireframe:** ✅ Created

**Purpose:**  
Display chronological list of user actions and events.

**Features:**
- Timeline layout with timestamps
- User avatars
- Action types (voted, commented, created, etc.)
- Clickable items (navigate to poll/comment)
- Infinite scroll / pagination
- Filter by action type
- Group by date (Today, Yesterday, etc.)
- Real-time updates

**Design Tokens:**
- `colors.muted-foreground` for timestamps
- `spacing.4` for item spacing
- `colors.border` for timeline line

**API Props:**
```tsx
interface ActivityFeedProps {
  activities: Activity[];
  onLoadMore?: () => void;
  filters?: ActivityFilter[];
  realtime?: boolean;
  groupByDate?: boolean;
}

interface Activity {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: Date;
  icon?: React.ReactNode;
}
```

---

### 29. Leaderboard
**Category:** Data Display  
**Priority:** Medium (P1)  
**Wireframe:** ✅ Created

**Purpose:**  
Show ranked list of top contributors or performers.

**Features:**
- Ranked list (1, 2, 3 with medals)
- User avatars and names
- Score/points display
- Pagination
- Time period selector (week, month, all-time)
- Highlight current user
- Podium view (top 3)

**Design Tokens:**
- `colors.primary` for top rank
- `colors.secondary` for 2nd/3rd
- `spacing.2` for row spacing

**API Props:**
```tsx
interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  period?: 'week' | 'month' | 'all';
  onPeriodChange?: (period: string) => void;
  showPodium?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  badge?: string; // emoji or icon
}
```

---

### 30-40. Additional Data Viz Components

**30. MetricRow** (Label + value + sparkline)  
**31. ProgressRing** (Circular progress)  
**32. ComparisonCard** (Side-by-side stats)  
**33. TrendChart** (Line chart over time)  
**34. VoteDistribution** (Pie/donut chart)  
**35. WinnerBadge** (Trophy overlay)  
**36. VoteButton** (Large voting option)  
**37. ResultsTimeline** (Vote activity timeline)  
**38. CommentThread** (Nested comments)  
**39. ReactionPicker** (Emoji reactions)  
**40. NotificationCard** (Notification item)

[Detailed specs available upon request]

---

## Phase 5: Onboarding & Empty States (10 Components)

### 41. EmptyState
**Category:** Feedback  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Display helpful message when no content exists.

**Features:**
- Icon or illustration
- Heading and description
- Primary action button
- Secondary action (optional)
- Contextual messaging
- Multiple variants (no polls, no results, no notifications)

**Design Tokens:**
- `colors.muted-foreground` for icon
- `spacing.12` for padding
- `colors.primary` for CTA button

**API Props:**
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  illustration?: string;
  title: string;
  description: string;
  primaryAction?: Action;
  secondaryAction?: Action;
}

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

---

### 42. WelcomeModal
**Category:** Onboarding  
**Priority:** Medium (P1)  
**Wireframe:** ✅ Created

**Purpose:**  
Multi-step onboarding tour for new users.

**Features:**
- Step indicator (dots or numbers)
- Content slides with illustrations
- Skip/dismiss option
- Progress persistence
- Keyboard navigation
- Responsive layout
- Optional video embed

**Design Tokens:**
- `colors.primary` for active step
- `spacing.6` for modal padding
- `shadows.lg` for modal elevation

**API Props:**
```tsx
interface WelcomeModalProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
  dismissible?: boolean;
}

interface OnboardingStep {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  video?: string;
}
```

---

### 43-50. Additional Onboarding Components

**43. NoResults** (Search/filter no matches)  
**44. NoPollsYet** (First poll prompt)  
**45. NoTeamMembers** (Invite first member)  
**46. NoNotifications** (All caught up)  
**47. Tooltip** (Contextual help)  
**48. HelpCard** (Info card with link)  
**49. FeatureAnnouncement** (New feature highlight)  
**50. QuickStartChecklist** (Onboarding progress)

---

## Phase 6: Settings & Configuration (10 Components)

### 51. SettingsLayout
**Category:** Layout  
**Priority:** High (P0)  
**Wireframe:** ✅ Created

**Purpose:**  
Standard layout for settings pages with sidebar navigation.

**Features:**
- Left sidebar navigation
- Content area
- Breadcrumbs
- Mobile responsive (sidebar collapses)
- Active section indicator
- Keyboard shortcuts
- Unsaved changes warning

**Design Tokens:**
- `colors.border` for sidebar border
- `spacing.6` for content padding
- `colors.accent` for active nav item

**API Props:**
```tsx
interface SettingsLayoutProps {
  sections: SettingsSection[];
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}
```

---

### 52. SettingRow
**Category:** Layout  
**Priority:** Medium (P1)  
**Wireframe:** Pending

**Purpose:**  
Consistent layout for individual settings items.

**Features:**
- Label + description + control
- Horizontal layout (label left, control right)
- Help text below
- Error state
- Disabled state

**Design Tokens:**
- `spacing.4` for padding
- `colors.muted-foreground` for descriptions

---

### 53. DangerZone
**Category:** Feedback  
**Priority:** Medium (P1)  
**Wireframe:** ✅ Created

**Purpose:**  
Section for destructive actions with visual warning.

**Features:**
- Red border and background tint
- Warning icon
- Confirmation dialogs
- Re-authentication for critical actions
- Countdown timer (optional)

**Design Tokens:**
- `colors.destructive` for border
- `colors.destructive/10` for background

---

### 54-60. Additional Settings Components

**54. FeatureToggle** (Switch with description)  
**55. BillingHistory** (Invoice table)  
**56. PaymentMethodCard** (Card details)  
**57. PermissionMatrix** (Role permissions table)  
**58. InvitationStatus** (Pending/accepted badge)  
**59. SidebarNav** (Collapsible navigation)  
**60. Breadcrumbs** (Navigation trail)

---

## Summary

**Total Future Components:** 60 (across 5 phases)

**Prioritization:**
- **P0 (High):** 20 components (Phases 2-4 critical path)
- **P1 (Medium):** 25 components (UX enhancements)
- **P2 (Low):** 15 components (Nice-to-have)

**Wireframe Status:**
- ✅ Created: 15 wireframes (in FutureComponents.stories.tsx)
- ⏳ Pending: 45 wireframes (to be created in follow-up phases)

**Next Steps:**
1. Review and approve component specifications
2. Create remaining wireframes (Phase-by-phase)
3. Implement high-priority components (P0)
4. Add Storybook stories for each completed component
5. Integrate with design token system

---

**This specification ensures Pejla has a comprehensive component library ready for all roadmap features. Build once, use everywhere. 🚀**
