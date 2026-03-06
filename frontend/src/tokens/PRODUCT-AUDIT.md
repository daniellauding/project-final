# Pejla Product Audit — UI Patterns & Token Usage

**Date**: 2026-03-06  
**Scope**: Entire Pejla app (pages + components)  
**Purpose**: Identify repeated patterns to inform design token system

---

## Pages Analyzed

1. **Home** (`src/pages/Home.tsx`) — Landing page with hero, features, recent polls
2. **CreatePoll** (`src/pages/CreatePoll.tsx`) — Multi-step poll creation wizard
3. **VotePoll** (`src/pages/VotePoll.tsx`) — Poll voting interface with media preview
4. **Profile** (`src/pages/Profile.tsx`) — User profile and poll management
5. **Dashboard** (`src/pages/Dashboard.tsx`) — User dashboard with stats
6. **Explore** (`src/pages/Explore.tsx`) — Browse public polls
7. **About** (`src/pages/About.tsx`) — About page
8. **Results** (`src/pages/Results.tsx`) — Poll results view

**Components Analyzed**: Header, Footer, AuthModal, NotificationBell, Cards, Buttons, Inputs

---

## 🎨 Identified UI Patterns

### 1. Card Elevation System

**Usage**: Poll cards, modal dialogs, dropdown menus, feature cards

**Pattern**:
- **Level 1**: `shadow-sm` — Subtle elevation (secondary cards, inactive state)
- **Level 2**: `shadow-lg` — Standard elevation (active cards, poll cards)
- **Level 3**: `shadow-xl` — High elevation (modals, popovers, hover state)

**Hover States**:
- Cards: `hover:shadow-xl` (from shadow-lg)
- Buttons: `hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_0_rgba(0,0,0,0.15)]`

**Examples**:
```tsx
// Poll card
className="rounded-2xl border border-border/40 bg-card shadow-lg hover:shadow-xl transition-all"

// Modal
className="bg-popover border rounded-md shadow-lg"

// Dropdown
className="bg-popover border rounded-md shadow-lg p-1"
```

---

### 2. CTA Button Styles

**Usage**: Primary actions (Create Poll, Vote, Share, Login)

**Pattern**:
- Background: `bg-primary` (purple-500)
- Text: `text-primary-foreground` (white)
- Padding: `px-6 py-3` or `h-10 px-6`
- Border radius: `rounded-full`
- Shadow: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_3px_0_rgba(0,0,0,0.1)]`
- Hover: `hover:brightness-110` + enhanced shadow
- Active: `active:scale-[0.97]`

**Variants**:
- **Primary**: Purple background
- **Secondary**: Gray background (`bg-secondary`)
- **Destructive**: Red background (`bg-destructive`)
- **Outline**: Border only (`border bg-background`)
- **Ghost**: No background, hover accent

**Examples**:
```tsx
<Button className="h-14 px-10 text-lg">
  Share something <ArrowRight className="ml-2 h-5 w-5" />
</Button>

<button className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:brightness-110">
```

---

### 3. Badge & Status Indicators

**Usage**: Vote counts, file type labels, remix badges, status labels

**Pattern**:
- **Overlay badges** (on cards): `bg-black/60 backdrop-blur-sm text-white text-xs`
- **Inline badges**: `bg-foreground/10 text-xs rounded px-2 py-0.5`
- **Status badges**: `bg-primary/70 text-background rounded-full px-2.5 py-1`

**Sizes**:
- Small: `text-[10px] px-1.5 py-0.5`
- Base: `text-xs px-2 py-0.5`
- Large: `text-sm px-2.5 py-1`

**Examples**:
```tsx
// Vote count badge (overlay)
<span className="px-2.5 py-1 rounded-full bg-foreground/70 backdrop-blur-sm text-background text-xs">
  {poll.totalVotes} votes
</span>

// File type badge
<span className="px-2 py-0.5 rounded bg-foreground/10 text-[10px] font-mono uppercase">
  {ext}
</span>

// Remix badge
<span className="px-2.5 py-1 rounded-full bg-primary/70 text-background text-xs">
  Remix
</span>
```

---

### 4. Form Input Patterns

**Usage**: Text inputs, textareas, file uploads, selects

**Pattern**:
- Height: `h-9` (inputs), `h-auto` (textarea)
- Padding: `px-3 py-1`
- Border: `border border-input`
- Border radius: `rounded-md`
- Background: `bg-transparent` (light), `dark:bg-input/30` (dark)
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Error: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

**Examples**:
```tsx
<Input className="h-9 border-input rounded-md" />
<Textarea className="border-input rounded-md" />
```

---

### 5. Section Spacing Rhythm

**Usage**: All page sections, card grids

**Pattern**:
- **Vertical padding** (sections): `py-16 md:py-24`
- **Horizontal padding**: `px-4` (mobile), `px-8` (desktop)
- **Gap** (grids): `gap-3` (tight), `gap-4` (standard), `gap-6` (loose)
- **Gap** (flex): `gap-2` (icons), `gap-3` (buttons), `gap-8` (sections)

**Examples**:
```tsx
// Section
<section className="py-16 md:py-24 px-4">

// Grid
<div className="grid grid-cols-2 gap-4">

// Flex
<div className="flex gap-3">
```

---

### 6. Typography Hierarchy

**Usage**: Headings, body text, captions

**Pattern**:
- **Hero**: `text-5xl md:text-7xl tracking-tight leading-[1.15]`
- **H1**: `text-3xl md:text-5xl tracking-tight`
- **H2**: `text-2xl md:text-3xl tracking-tight`
- **H3**: `text-xl md:text-2xl tracking-tight`
- **Body**: `text-base leading-relaxed`
- **Caption**: `text-sm text-muted-foreground`
- **Small**: `text-xs text-muted-foreground`
- **Tiny**: `text-[10px]` (badges, labels)

**Font Families**:
- Headings (h1-h3): `font-family: "Exposure Trial"`
- Body/UI: `font-family: "Apercu"`
- Code/badges: `font-family: monospace`

**Examples**:
```tsx
<h1 className="text-5xl md:text-7xl tracking-tight">Welcome</h1>
<h2 className="text-2xl md:text-3xl tracking-tight">Features</h2>
<p className="text-base text-muted-foreground leading-relaxed">Description</p>
<span className="text-xs text-muted-foreground">Caption</span>
```

---

### 7. Modal & Popover Patterns

**Usage**: Auth modal, dropdown menus, share dialogs

**Pattern**:
- **Backdrop**: `fixed inset-0 bg-background/80 backdrop-blur-sm`
- **Content**: `bg-popover border rounded-md shadow-lg`
- **Padding**: `p-4` (small), `p-6` (standard)
- **Animation**: `animate-in fade-in-0 zoom-in-95`
- **Max width**: `max-w-md` (small), `max-w-2xl` (large)

**Examples**:
```tsx
// Backdrop
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />

// Modal content
<div className="bg-popover border rounded-lg shadow-lg p-6 max-w-md">
  {/* content */}
</div>

// Dropdown menu
<div className="bg-popover border rounded-md shadow-lg p-1 min-w-[180px] animate-in fade-in-0 zoom-in-95">
```

---

### 8. Navigation Patterns

**Usage**: Header, sticky toolbars, breadcrumbs

**Pattern**:
- **Header**: `fixed top-0 z-40 bg-background border-b border-border/60`
- **Sticky header** (poll page): `bg-gradient-to-b from-background/70 to-transparent` (on hover)
- **Backdrop blur**: `backdrop-blur-sm bg-card/95`
- **Height**: `py-3` (header), `h-14` (standard)

**Examples**:
```tsx
// Fixed header
<header className="fixed top-0 z-40 bg-background border-b border-border/60">

// Sticky with backdrop
<div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b">
```

---

### 9. Empty State Patterns

**Usage**: No polls yet, no results, error states

**Pattern**:
- **Container**: Centered flex column
- **Icon**: Large icon (48-64px) with muted color
- **Message**: Bold heading + muted description
- **CTA**: Primary button below
- **Spacing**: `gap-4` between elements

**Examples**:
```tsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
    <Icon className="w-8 h-8 text-muted-foreground" />
  </div>
  <div>
    <h3 className="text-lg font-semibold">No polls yet</h3>
    <p className="text-sm text-muted-foreground">Create your first poll to get started</p>
  </div>
  <Button>Create Poll</Button>
</div>
```

---

### 10. Loading State Patterns

**Usage**: Skeleton loaders, progress bars, spinners

**Pattern**:
- **Skeleton**: `bg-muted animate-pulse` with shape (h-4, h-8, etc.)
- **Progress bar**: `bg-muted` container + `bg-primary` fill
- **Spinner**: Lucide icon with `animate-spin`

**Examples**:
```tsx
// Skeleton
<div className="space-y-2">
  <div className="h-4 bg-muted animate-pulse rounded" />
  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
</div>

// Progress
<div className="h-2 bg-muted rounded-full overflow-hidden">
  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
</div>
```

---

## 📊 Pattern Usage Statistics

| Pattern | Occurrences | Pages/Components |
|---------|-------------|------------------|
| Card elevation (shadow-lg) | 50+ | Home, Explore, VotePoll, Dashboard |
| CTA buttons (rounded-full) | 30+ | All pages |
| Status badges (bg-black/60) | 25+ | Home, VotePoll, Explore |
| Form inputs (h-9) | 20+ | CreatePoll, Profile, AuthModal |
| Section spacing (py-16) | 15+ | All pages |
| Typography (text-2xl) | 40+ | All pages |
| Modal backdrop (backdrop-blur) | 10+ | AuthModal, Dialogs |
| Empty states | 8+ | Home, Dashboard, Profile |
| Loading skeletons | 5+ | Home, Explore |

---

## 🎯 Recommendations: New Semantic Tokens

Based on identified patterns and roadmap features (Org/Teams, Monetization, Integrations), we recommend adding these semantic tokens:

### 1. Organization/Teams Colors

```json
"organization": {
  "switcher-bg": "{colors.semantic.background.card}",
  "switcher-border": "{colors.semantic.border.default}",
  "switcher-hover": "{colors.semantic.accent.default}",
  "member-role-admin": "{colors.primitive.purple.500}",
  "member-role-member": "{colors.primitive.gray.600}",
  "member-role-guest": "{colors.primitive.gray.400}"
}
```

### 2. Billing/Monetization Colors

```json
"billing": {
  "plan-free-bg": "{colors.semantic.background.default}",
  "plan-pro-bg": "{colors.semantic.brand.primary}",
  "plan-enterprise-bg": "{colors.primitive.gray.900}",
  "plan-recommended-border": "{colors.primitive.orange.500}",
  "upgrade-cta-bg": "{colors.primitive.purple.500}",
  "usage-warning": "{colors.primitive.yellow.500}",
  "usage-exceeded": "{colors.semantic.destructive.default}"
}
```

### 3. Settings UI Colors

```json
"settings": {
  "sidebar-bg": "{colors.semantic.background.sidebar}",
  "sidebar-active": "{colors.semantic.accent.sidebar}",
  "section-divider": "{colors.semantic.border.sidebar}",
  "danger-zone-bg": "{colors.semantic.destructive.default}/10",
  "danger-zone-border": "{colors.semantic.destructive.default}",
  "feature-toggle-active": "{colors.primitive.green.500}",
  "feature-toggle-inactive": "{colors.primitive.gray.400}"
}
```

### 4. Advanced Forms

```json
"forms": {
  "multi-step-active": "{colors.semantic.brand.primary}",
  "multi-step-complete": "{colors.primitive.green.500}",
  "multi-step-incomplete": "{colors.primitive.gray.300}",
  "file-upload-border": "{colors.semantic.border.input}",
  "file-upload-hover": "{colors.semantic.brand.primary}/20",
  "tag-bg": "{colors.semantic.accent.default}",
  "tag-remove-hover": "{colors.semantic.destructive.default}"
}
```

### 5. Data Visualization

```json
"dataviz": {
  "stat-increase": "{colors.primitive.green.500}",
  "stat-decrease": "{colors.primitive.red.500}",
  "stat-neutral": "{colors.primitive.gray.600}",
  "chart-1": "{colors.primitive.orange.500}",
  "chart-2": "{colors.primitive.green.600}",
  "chart-3": "{colors.primitive.blue.500}",
  "chart-4": "{colors.primitive.yellow.500}",
  "chart-5": "{colors.primitive.pink.500}",
  "progress-bar-bg": "{colors.semantic.muted.default}",
  "progress-bar-fill": "{colors.semantic.brand.primary}"
}
```

### 6. Activity Feed & Timeline

```json
"activity": {
  "feed-item-bg": "{colors.semantic.background.card}",
  "feed-item-hover": "{colors.semantic.accent.default}",
  "timeline-line": "{colors.semantic.border.default}",
  "timeline-dot-active": "{colors.semantic.brand.primary}",
  "timeline-dot-inactive": "{colors.primitive.gray.400}",
  "notification-unread": "{colors.semantic.brand.primary}/10",
  "notification-read": "transparent"
}
```

### 7. Marketing/Landing

```json
"marketing": {
  "hero-gradient-start": "{colors.semantic.background.default}",
  "hero-gradient-end": "{colors.semantic.brand.primary}/5",
  "feature-icon-bg": "{colors.semantic.accent.default}",
  "testimonial-quote": "{colors.semantic.text.muted}",
  "pricing-highlight": "{colors.semantic.brand.primary}",
  "cta-section-bg": "{colors.semantic.brand.primary}",
  "cta-section-text": "{colors.semantic.brand.primary-foreground}"
}
```

### 8. File Type Badges

```json
"filetypes": {
  "image-bg": "{colors.primitive.blue.500}/10",
  "video-bg": "{colors.primitive.purple.500}/10",
  "audio-bg": "{colors.primitive.pink.500}/10",
  "document-bg": "{colors.primitive.gray.400}/10",
  "code-bg": "{colors.primitive.orange.500}/10",
  "badge-text": "{colors.semantic.text.primary}"
}
```

### 9. Status & Feedback

```json
"status": {
  "success-bg": "{colors.primitive.green.500}/10",
  "success-text": "{colors.primitive.green.600}",
  "warning-bg": "{colors.primitive.yellow.500}/10",
  "warning-text": "{colors.primitive.orange.500}",
  "error-bg": "{colors.semantic.destructive.default}/10",
  "error-text": "{colors.semantic.destructive.default}",
  "info-bg": "{colors.primitive.blue.500}/10",
  "info-text": "{colors.primitive.blue.500}"
}
```

### 10. Remix & Collaboration

```json
"collaboration": {
  "remix-badge-bg": "{colors.semantic.brand.primary}/70",
  "remix-badge-text": "{colors.semantic.background.default}",
  "collaborator-cursor-1": "#f9a8d4",
  "collaborator-cursor-2": "#93c5fd",
  "collaborator-cursor-3": "#86efac",
  "vote-indicator-active": "{colors.semantic.brand.primary}",
  "vote-indicator-inactive": "{colors.primitive.gray.400}"
}
```

---

## 🚀 Next Steps

1. ✅ **Add patterns section** to `design-tokens.json`
2. ✅ **Add recommended tokens** for future features
3. ⏭️ **Agent 2**: Create Storybook stories for patterns
4. ⏭️ **Agent 3**: Migrate components to use pattern tokens
5. ⏭️ **Future**: Implement organization/billing features using recommended tokens

---

## 📝 Notes

- **All patterns follow mobile-first responsive design** (`text-sm md:text-base`)
- **Dark mode support** is critical for all patterns
- **OKLCH color space** used throughout for perceptual uniformity
- **Semantic naming** prioritized over primitive references
- **Token references** (`{...}`) allow single source of truth

---

**Generated**: 2026-03-06  
**Agent**: Agent 1 (Design Token Extractor — Expanded Scope)  
**Status**: Product audit complete ✅
