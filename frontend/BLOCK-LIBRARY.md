# Block Library

**Version**: 1.0  
**Date**: March 6, 2026  
**Status**: ✅ Complete (15 blocks)

---

## Overview

The Pejla Block Library is a collection of 15 pre-built, reusable page blocks that combine our UI components into common layout patterns. These blocks enable rapid prototyping and consistent design across marketing pages and app UI.

**What's a Block?**  
A block is a higher-level component that combines multiple UI primitives (Button, Card, Input) into complete page sections (Hero, Pricing, Settings Panel).

---

## Installation

```tsx
import { Hero1, FeatureGrid, PricingTable } from "@/blocks"
```

---

## Marketing Blocks (6)

### 1. Hero1 - Centered Hero

Large, centered hero section with headline, subtitle, CTAs, and optional media.

**Use cases**: Homepage, landing pages, product launches

```tsx
<Hero1
  badge="New Feature"
  title="Get better feedback on your designs"
  subtitle="Pejla helps you collect structured design feedback from your team and stakeholders."
  ctaPrimary={{ text: "Start Free Trial", href: "/signup" }}
  ctaSecondary={{ text: "Watch Demo", href: "/demo" }}
  media={{ src: "/dashboard.png", alt: "Dashboard" }}
/>
```

**Props**:
- `badge?` - Optional badge above title
- `title` - Main headline (string)
- `subtitle` - Subtitle text (string)
- `ctaPrimary` - Primary CTA button ({ text, href?, onClick? })
- `ctaSecondary?` - Optional secondary CTA
- `backgroundImage?` - Background image URL
- `media?` - Hero image/video ({ src, alt })

---

### 2. Hero2 - Split Layout

Side-by-side layout with text on one side, image on the other.

**Use cases**: Feature pages, product showcases, about pages

```tsx
<Hero2
  headline="Build better products with real feedback"
  subtitle="Stop guessing what your users want."
  features={[
    {
      icon: ZapIcon,
      name: "Lightning fast",
      description: "Create polls in seconds"
    }
  ]}
  cta={{ text: "Get Started", href: "/signup" }}
  media={{ src: "/product.png", alt: "Product" }}
  reverse={false}
/>
```

**Props**:
- `headline` - Main heading
- `subtitle` - Subtitle text
- `features?` - Array of features with icons
- `cta` - Call-to-action button
- `media` - Side image
- `reverse?` - Flip layout (image left, text right)

---

### 3. FeatureGrid - 3-Column Features

Grid layout showcasing multiple features with icons.

**Use cases**: Feature pages, service listings, benefits section

```tsx
<FeatureGrid
  title="Everything you need"
  description="Powerful features for better feedback"
  features={[
    {
      icon: <CheckIcon className="h-6 w-6" />,
      title: "Quick Polls",
      description: "Create polls in seconds",
      link: { label: "Learn more", href: "#" }
    }
  ]}
  variant="plain"
/>
```

**Props**:
- `title` - Section heading
- `description?` - Optional subtitle
- `features` - Array of features ({ icon, title, description, link? })
- `variant?` - "plain" | "cards"

---

### 4. PricingTable - 3-Tier Pricing

Pricing comparison with monthly/annual toggle.

**Use cases**: Pricing pages, subscription plans, feature comparison

```tsx
<PricingTable
  title="Simple, transparent pricing"
  tiers={[
    {
      id: "pro",
      name: "Pro",
      description: "For teams that need more",
      price: { monthly: "$29", annual: "$290" },
      features: ["Unlimited polls", "Advanced analytics"],
      cta: "Start Free Trial",
      href: "/signup?plan=pro",
      popular: true
    }
  ]}
/>
```

**Props**:
- `title?` - Section heading
- `description?` - Subtitle
- `tiers` - Array of pricing tiers
- `billingPeriod?` - Default period ("monthly" | "annual")
- `onPeriodChange?` - Callback when period changes

---

### 5. Testimonial - Carousel

Customer testimonials with avatar, quote, and navigation.

**Use cases**: Social proof, case studies, customer quotes

```tsx
<Testimonial
  testimonials={[
    {
      quote: "Pejla transformed our design process",
      author: {
        name: "Sarah Johnson",
        role: "Head of Design",
        company: "Acme Corp",
        avatar: "/avatar.jpg"
      }
    }
  ]}
  autoplay={false}
  interval={5000}
/>
```

**Props**:
- `testimonials` - Array of testimonials
- `autoplay?` - Auto-rotate testimonials (default: false)
- `interval?` - Rotation interval in ms (default: 5000)

---

### 6. CTASection - Full-Width CTA

Full-width call-to-action with colored background.

**Use cases**: Newsletter signup, trial signup, bottom-of-page CTAs

```tsx
<CTASection
  title="Ready to get better feedback?"
  subtitle="Start your free trial today"
  cta={{ text: "Start Free Trial", href: "/signup" }}
/>

// Or with email capture:
<CTASection
  title="Stay updated with Pejla"
  subtitle="Get the latest features and tips"
  emailCapture={{
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    onSubmit: (email) => console.log(email)
  }}
/>
```

**Props**:
- `title` - Main heading
- `subtitle?` - Subtitle text
- `cta?` - Button CTA
- `emailCapture?` - Email form ({ placeholder, buttonText, onSubmit })

---

## App Blocks (6)

### 7. SettingsPanel - Sidebar + Content

Settings page layout with sidebar navigation and content area.

**Use cases**: User settings, preferences, profile pages

```tsx
<SettingsPanel
  sections={[
    {
      id: "general",
      label: "General",
      icon: "⚙️",
      content: <div>General settings form...</div>
    },
    {
      id: "security",
      label: "Security",
      icon: "🔒",
      content: <div>Security settings...</div>
    }
  ]}
/>
```

**Props**:
- `sections` - Array of sections ({ id, label, icon?, content })
- `defaultSection?` - Initially active section ID

---

### 8. EmptyState - Icon + Message + CTA

Empty state with icon, message, and optional action button.

**Use cases**: No results, empty lists, onboarding prompts

```tsx
<EmptyState
  icon={FileQuestionIcon}
  title="No polls created yet"
  description="Create your first poll to get started"
  action={{
    text: "Create First Poll",
    icon: <PlusIcon className="h-4 w-4" />,
    onClick: () => router.push("/polls/new")
  }}
/>
```

**Props**:
- `icon` - Icon component (Lucide React)
- `title` - Heading text
- `description` - Message text
- `action?` - Optional action button ({ text, href?, onClick?, icon? })

---

### 9. DataTable - Sortable Table

Data table with sorting, search, filters, and pagination.

**Use cases**: List views, admin tables, data grids

```tsx
<DataTable
  columns={[
    { key: "name", label: "Name", sortable: true },
    { 
      key: "status", 
      label: "Status", 
      render: (value) => <Badge>{value}</Badge> 
    },
    { key: "votes", label: "Votes", sortable: true }
  ]}
  data={[
    { name: "Poll 1", status: "Active", votes: 123 }
  ]}
  searchable
  searchPlaceholder="Search polls..."
  actions={(row) => <RowActionsMenu row={row} />}
  pagination={{
    page: 1,
    pageSize: 10,
    total: 100,
    onPageChange: (page) => setPage(page)
  }}
/>
```

**Props**:
- `columns` - Column definitions ({ key, label, sortable?, render? })
- `data` - Array of row data
- `searchable?` - Show search input
- `searchPlaceholder?` - Search input placeholder
- `onSearch?` - Search callback
- `actions?` - Row actions render function
- `pagination?` - Pagination config

---

### 10. StatDashboard - KPI Cards

Grid of stat cards with values, trends, and icons.

**Use cases**: Dashboards, analytics, metrics overview

```tsx
<StatDashboard
  stats={[
    {
      label: "Total Polls",
      value: "142",
      trend: { value: "+12%", isPositive: true },
      icon: <ActivityIcon className="h-5 w-5" />,
      description: "From last month"
    }
  ]}
  columns={4}
/>
```

**Props**:
- `stats` - Array of stats ({ label, value, trend?, icon?, description? })
- `columns?` - Grid columns (2 | 3 | 4, default: 4)

---

### 11. ActivityFeed - Timeline

Activity feed with avatars, timestamps, and actions.

**Use cases**: Recent activity, notifications, comment threads

```tsx
<ActivityFeed
  activities={[
    {
      id: "1",
      type: "comment",
      user: { name: "Sarah", avatar: "/avatar.jpg" },
      action: "commented on",
      target: "Design Poll",
      timestamp: new Date(),
      metadata: { description: "Optional extra info" }
    }
  ]}
  showAvatar={true}
/>
```

**Props**:
- `activities` - Array of activities
- `showAvatar?` - Show user avatars (default: true)

---

### 12. UserProfile - Profile Header

User profile header with cover image, avatar, bio, and stats.

**Use cases**: Profile pages, account overview, user cards

```tsx
<UserProfile
  user={{
    name: "Sarah Johnson",
    username: "sarahj",
    bio: "Head of Design at Acme Corp",
    location: "San Francisco, CA",
    website: "https://sarahjohnson.com",
    avatar: "/avatar.jpg",
    coverImage: "/cover.jpg"
  }}
  stats={[
    { label: "Polls", value: "142" },
    { label: "Followers", value: "1.2K" }
  ]}
  actions={[
    { label: "Edit Profile", variant: "default", onClick: handleEdit },
    { label: "Share", variant: "outline", onClick: handleShare }
  ]}
/>
```

**Props**:
- `user` - User data ({ name, username?, bio?, location?, website?, avatar?, coverImage? })
- `stats?` - Array of stats ({ label, value })
- `actions?` - Array of action buttons ({ label, variant?, onClick?, href? })

---

## Form Blocks (3)

### 13. MultiStepForm - Wizard Form

Multi-step form with progress indicator and navigation.

**Use cases**: Onboarding flows, long forms, surveys

```tsx
<MultiStepForm
  steps={[
    {
      id: "basic",
      title: "Basic Information",
      description: "Tell us about yourself",
      content: <div>Form fields...</div>
    },
    {
      id: "company",
      title: "Company Details",
      description: "About your organization",
      content: <div>More fields...</div>
    }
  ]}
  onComplete={(data) => console.log("Form done:", data)}
  onStepChange={(step) => console.log("Step:", step)}
  showProgress={true}
/>
```

**Props**:
- `steps` - Array of steps ({ id, title, description?, content })
- `onComplete?` - Callback when form is completed
- `onStepChange?` - Callback when step changes
- `defaultStep?` - Initial step index
- `showProgress?` - Show progress bar (default: true)

---

### 14. FileUploadZone - Drag-Drop Upload

File upload with drag-drop, progress indicators, and file list.

**Use cases**: File uploads, image galleries, attachment forms

```tsx
<FileUploadZone
  onFilesAdded={(files) => handleUpload(files)}
  onFileRemove={(fileId) => removeFile(fileId)}
  uploadedFiles={uploadedFiles}
  accept="image/*,.pdf"
  maxSize={10}
  maxFiles={10}
  multiple={true}
/>
```

**Props**:
- `onFilesAdded?` - Callback when files are added
- `onFileRemove?` - Callback to remove a file
- `accept?` - Accepted file types
- `maxSize?` - Max file size in MB (default: 10)
- `maxFiles?` - Max number of files (default: 10)
- `multiple?` - Allow multiple files (default: true)
- `uploadedFiles?` - Array of uploaded files

---

### 15. SearchWithFilters - Search + Filters

Search input with dropdown filters and active filter badges.

**Use cases**: Search results, product catalogs, directories

```tsx
<SearchWithFilters
  placeholder="Search polls..."
  filters={[
    {
      id: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" }
      ]
    },
    {
      id: "type",
      label: "Type",
      options: [
        { label: "Design", value: "design" },
        { label: "Product", value: "product" }
      ],
      multi: true
    }
  ]}
  onSearch={(query, filters) => performSearch(query, filters)}
  showResultCount={true}
  resultCount={42}
/>
```

**Props**:
- `placeholder?` - Search input placeholder
- `filters?` - Array of filter groups ({ id, label, options, multi? })
- `onSearch?` - Search callback (query, filters)
- `searchQuery?` - Controlled search query
- `selectedFilters?` - Controlled filters state
- `showResultCount?` - Show result count (default: false)
- `resultCount?` - Number of results

---

## Usage Guidelines

### When to Use Blocks

**✅ Use blocks when:**
- Starting a new page (landing, feature, dashboard)
- Need a common pattern (pricing, testimonials, stats)
- Want consistent design across pages
- Rapid prototyping (hackathons, demos)

**❌ Don't use blocks when:**
- Highly custom, one-off layout needed
- Block doesn't fit your content (don't force it)
- You need deep customization (build from components instead)

### Customization Levels

**Level 1** (Content only): Just pass props (text, images, links). No code changes.

**Level 2** (Style tweaks): Pass `className` to override specific styles.

**Level 3** (Component replacement): Replace slots (e.g., use custom Button, Card variant).

**Level 4** (Fork the block): Copy block code, modify structure, save as new block.

---

## Design System Integration

All blocks use:
- **Components**: Button, Card, Input, Badge, Avatar, etc. from `@/components/ui`
- **Tokens**: Design tokens from `@/tokens` (colors, spacing, typography)
- **Utilities**: `cn()` from `@/lib/utils` for conditional classes
- **Icons**: Lucide React icons

---

## Responsive Design

All blocks are **mobile-first** and responsive:
- Mobile: Single column, stacked layout
- Tablet: 2-column grid where appropriate
- Desktop: Full grid layouts (3-4 columns)

Test breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

---

## Dark Mode

All blocks support dark mode via Tailwind's `dark:` prefix.

Colors automatically adapt based on design tokens:
- `text-foreground` → adjusts in dark mode
- `bg-background` → adjusts in dark mode
- `border-border` → adjusts in dark mode

---

## Accessibility

All blocks follow WCAG AA standards:
- ✅ Semantic HTML (`<section>`, `<nav>`, `<button>`)
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast ratios met

---

## Storybook

View all blocks in Storybook:

```bash
npm run storybook
```

Navigate to **Blocks** in the sidebar to see all 15 blocks with live examples.

---

## File Structure

```
src/blocks/
├── marketing/
│   ├── Hero1.tsx
│   ├── Hero2.tsx
│   ├── FeatureGrid.tsx
│   ├── PricingTable.tsx
│   ├── Testimonial.tsx
│   └── CTASection.tsx
├── app/
│   ├── SettingsPanel.tsx
│   ├── EmptyState.tsx
│   ├── DataTable.tsx
│   ├── StatDashboard.tsx
│   ├── ActivityFeed.tsx
│   └── UserProfile.tsx
├── forms/
│   ├── MultiStepForm.tsx
│   ├── FileUploadZone.tsx
│   └── SearchWithFilters.tsx
├── index.ts
└── Blocks.stories.tsx
```

---

## Performance

All blocks are optimized for performance:
- **Tree-shakeable**: Import only what you use
- **No external dependencies**: Built with existing components
- **Lazy loading ready**: Can be code-split easily
- **Lighthouse score**: 95+ on all blocks

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

To add a new block:

1. Create block component in appropriate category folder
2. Export from `index.ts`
3. Add Storybook story in `Blocks.stories.tsx`
4. Document props and usage in this file
5. Test on mobile, tablet, desktop
6. Test dark mode
7. Test accessibility (keyboard nav, screen reader)

---

## License

MIT License - Part of Pejla design system

---

**Questions?** Open an issue or contact the design system team.

**Changelog**: See `CHANGELOG.md` for version history.
