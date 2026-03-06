# Pejla Design Tokens v2.0

**Single source of truth for all design values in the Pejla design system.**

This token system follows Figma's variable structure with **primitive → semantic** naming, making it portable across platforms (web, iOS, Android, Figma).

**New in v2.0**: Material Design 3-inspired surface containers, state layers, tertiary brand color, and fine-grained spacing.

---

## 📁 Files

- **`design-tokens.json`** — JSON source of truth (247+ tokens, all platforms)
- **`tokens.css`** — CSS custom properties with dark mode support
- **`tokens.d.ts`** — TypeScript type definitions
- **`README.md`** — This usage guide

---

## 🎨 Token Categories

### Colors

**Primitive colors** (raw OKLCH values):
- `colors.primitive.gray.50` → `colors.primitive.gray.1000`
- `colors.primitive.purple.400/500/600` (primary brand)
- **v2**: `colors.primitive.teal.50/500/900` (tertiary brand)
- `colors.primitive.red.500/600`
- `colors.primitive.white/black`

**Semantic colors** (references to primitives):
- `colors.semantic.background.*` — page/card/input backgrounds
- **v2**: `colors.semantic.surface.*` — M3-inspired surface containers (elevation without shadows)
- **v2**: `colors.semantic.on-surface.*` — text colors optimized for surfaces
- `colors.semantic.foreground.*` — text on backgrounds
- `colors.semantic.text.*` — primary/secondary/muted text
- `colors.semantic.border.*` — default/input borders
- **v2**: `colors.semantic.outline.*` — border variants (default/variant)
- `colors.semantic.brand.*` — primary/secondary/**tertiary** brand colors
- `colors.semantic.accent.*` — accent backgrounds
- `colors.semantic.destructive.*` — error/delete actions
- `colors.semantic.ring.*` — focus rings

**Dark mode overrides**: `colors.dark.*` (automatically applied via `.dark` class)

---

### 🆕 v2: Surface Containers (Material Design 3)

Use tonal surfaces instead of shadows for elevation hierarchy:

**Light mode**:
- `surface-container-lowest` — Page background (flush with surface)
- `surface-container-low` — Cards on page (subtle elevation)
- `surface-container` — Default elevation (modals, dialogs)
- `surface-container-high` — Dropdowns, menus
- `surface-container-highest` — Tooltips, popovers

**Dark mode**: Inverted hierarchy (darker = lower elevation)

```tsx
// Card with elevated surface
<div className="bg-[var(--color-surface-container-high)]">
  <p className="text-[var(--color-on-surface)]">Content</p>
</div>

// Hierarchy example
<div className="bg-[var(--color-surface-container-lowest)]"> {/* Page */}
  <div className="bg-[var(--color-surface-container-low)]"> {/* Card */}
    <div className="bg-[var(--color-surface-container)]"> {/* Modal */}
      <div className="bg-[var(--color-surface-container-high)]"> {/* Dropdown */}
      </div>
    </div>
  </div>
</div>
```

---

### 🆕 v2: State Layers (Interactive States)

Material Design 3-inspired opacity overlays for interactive states:

**Opacity tokens**:
- `opacity.state.hover` — 0.08 (8%)
- `opacity.state.focus` — 0.12 (12%)
- `opacity.state.press` — 0.16 (16%)
- `opacity.state.drag` — 0.16 (16%)
- `opacity.state.disabled` — 0.38 (38%)

**State layer colors** (auto-adapts to light/dark):
- `--state-hover` — Black/white overlay with hover opacity
- `--state-focus` — Black/white overlay with focus opacity
- `--state-press` — Black/white overlay with press opacity

```tsx
// Interactive button with state layers
<button
  className="relative hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-[var(--state-hover)] focus:after:bg-[var(--state-focus)]"
  style={{
    backgroundColor: 'var(--color-brand-primary)',
    transition: 'all var(--duration-fast) var(--ease-out)',
  }}
>
  Click me
</button>

// Or use directly with opacity
<div
  style={{
    backgroundColor: 'var(--color-surface-container)',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, var(--opacity-hover))',
    },
  }}
>
  Hover me
</div>
```

---

### 🆕 v2: Tertiary Brand Color

Third accent color for variety and hierarchy:

- **Primary** (purple): Main CTAs (Vote, Create Poll)
- **Secondary** (gray): Neutral actions (Cancel, Back)
- **Tertiary** (teal): Accent elements (Tags, Badges, Icons)

```tsx
// Primary action
<button className="bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]">
  Create Poll
</button>

// Secondary action
<button className="bg-[var(--color-brand-secondary)] text-[var(--color-brand-secondary-foreground)]">
  Cancel
</button>

// Tertiary accent
<span className="bg-[var(--color-brand-tertiary)] text-[var(--color-brand-tertiary-foreground)] px-2 py-1 rounded">
  New
</span>
```

---

### 🆕 v2: Outline Variants

Two border emphasis levels:

- `outline.default` — Standard borders (gray-300 light, gray-700 dark)
- `outline.variant` — Subtle borders (gray-200 light, gray-800 dark)

```tsx
// Default border
<div style={{ border: '1px solid var(--color-outline)' }}>
  Primary border
</div>

// Subtle border
<div style={{ border: '1px solid var(--color-outline-variant)' }}>
  Subtle divider
</div>
```

---

### Spacing

Base-4 scale: `0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24...`

- `spacing.scale.0` → `spacing.scale.96`
- **v2**: Added `3.5` (14px) for fine-grained control
- Use for: padding, margin, gap, width, height

**Fine-grained spacing** (already in v1, now highlighted):
- `0.5` (2px) — Border widths, thin dividers
- `1.5` (6px) — Icon-to-text gaps
- `2.5` (10px) — Compact list item spacing
- `3.5` (14px) — Medium spacing

---

### Typography

**Font families**:
- `fontFamilies.sans` — Apercu (body text)
- `fontFamilies.display` — Exposure Trial (headings)
- `fontFamilies.mono` — SF Mono (code)

**Sizes**: `xs (12px)` → `9xl (128px)`  
**Weights**: `light (300)` → `bold (700)`  
**Line heights**: `tight (1.25)` → `loose (2)`  
**Letter spacing**: `tighter (-0.03em)` → `widest (0.1em)`

---

### Shadows

**Box shadows**:
- **v2**: `shadows.2xs` — Hairline shadow (0 1px 0)
- `shadows.xs/sm/base/md/lg/xl/2xl` — elevation levels
- `shadows.button.*` — specialized button shadows (inset + drop)
- `shadows.inner` — inset shadow

**🆕 v2: Drop shadows** (for SVG/filter effects):
- `dropShadow.xs/sm/md/lg/xl/2xl` — Compatible with CSS `filter: drop-shadow()`

```tsx
// SVG icon with drop shadow
<svg style={{ filter: 'var(--drop-shadow-md)' }}>
  <path d="..." />
</svg>

// Image with drop shadow
<img
  src="avatar.jpg"
  style={{ filter: 'var(--drop-shadow-lg)' }}
/>
```

---

### Border Radius

- `radii.none` → `radii.3xl` (0px → 24px)
- `radii.full` — perfect circles (9999px)

---

### Animations

**Durations**:
- `instant (0ms)` → `slower (700ms)`
- **v2**: `short-1 (50ms)`, `medium-1 (250ms)`, `long-1 (450ms)` — intermediate steps

**Easings**:
- `linear`, `ease`, `easeIn`, `easeOut`, `easeInOut`, `spring`
- **v2 (M3-inspired)**: `emphasized`, `emphasized-decelerate`, `emphasized-accelerate`, `bounce`

```tsx
// Standard easing
<button style={{
  transition: `all var(--duration-base) var(--ease-out)`,
}}>
  Standard
</button>

// v2: M3 emphasized easing (for hero animations)
<div style={{
  transition: `transform var(--duration-long-1) var(--ease-emphasized)`,
}}>
  Hero element
</div>

// v2: Bounce effect
<div style={{
  transition: `transform var(--duration-moderate) var(--ease-bounce)`,
}}>
  Bouncy!
</div>
```

**Scales**: `active (0.97)`, `hover (1.02)`

---

### 🆕 v2: Aspect Ratios

Predefined aspect ratios for images, videos, and containers:

- `aspectRatio.square` — 1 / 1
- `aspectRatio.video` — 16 / 9 (YouTube, Vimeo)
- `aspectRatio.portrait` — 3 / 4 (Instagram portrait)
- `aspectRatio.landscape` — 4 / 3 (Classic photography)
- `aspectRatio.ultrawide` — 21 / 9 (Cinematic)

```tsx
// Video container
<div style={{ aspectRatio: 'var(--aspect-video)' }}>
  <iframe src="youtube-embed" />
</div>

// Profile image
<img
  src="avatar.jpg"
  style={{
    aspectRatio: 'var(--aspect-square)',
    objectFit: 'cover',
  }}
/>
```

---

## 🚀 Usage Examples

### Example 1: Using CSS Custom Properties Directly

```tsx
// ❌ Before (hardcoded values)
<div className="bg-gray-100 text-gray-900 p-4 rounded-lg shadow-md">

// ✅ After (with CSS custom properties)
<div style={{
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-primary)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)'
}}>
```

---

### Example 2: v2 Surface Container Card

```tsx
<div style={{
  backgroundColor: 'var(--color-surface-container-high)',
  color: 'var(--color-on-surface)',
  padding: 'var(--spacing-6)',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--color-outline-variant)',
}}>
  <h3 style={{
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--color-on-surface)',
    marginBottom: 'var(--spacing-2)',
  }}>
    Elevated Card
  </h3>
  <p style={{
    fontSize: 'var(--text-sm)',
    color: 'var(--color-on-surface-variant)',
  }}>
    Uses M3 surface container tokens for tonal elevation.
  </p>
</div>
```

---

### Example 3: v2 Interactive Button with State Layers

```tsx
function InteractiveButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-brand-primary)',
        color: 'var(--color-brand-primary-foreground)',
        padding: 'var(--spacing-3) var(--spacing-6)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        cursor: 'pointer',
        transition: `all var(--duration-fast) var(--ease-emphasized)`,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 9999px var(--state-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 9999px var(--state-press)';
      }}
    >
      {children}
    </button>
  );
}
```

---

### Example 4: v2 Tertiary Brand Badge

```tsx
<span style={{
  backgroundColor: 'var(--color-brand-tertiary)',
  color: 'var(--color-brand-tertiary-foreground)',
  padding: 'var(--spacing-1) var(--spacing-2-5)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-medium)',
  display: 'inline-block',
}}>
  New Feature
</span>
```

---

### Example 5: Extending Tailwind Config

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'brand-tertiary': 'var(--color-brand-tertiary)', // v2
        'surface-container': 'var(--color-surface-container)', // v2
        'on-surface': 'var(--color-on-surface)', // v2
        'text-primary': 'var(--color-text-primary)',
        'bg-default': 'var(--color-background)',
      },
      spacing: {
        '0.5': 'var(--spacing-0-5)',
        '1.5': 'var(--spacing-1-5)',
        '2.5': 'var(--spacing-2-5)',
        '3.5': 'var(--spacing-3-5)', // v2
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
      aspectRatio: { // v2
        'video': 'var(--aspect-video)',
        'square': 'var(--aspect-square)',
      },
    }
  }
}
```

Then use in components:
```tsx
<button className="bg-brand-primary text-white px-6 py-4 rounded-lg">
  Click me
</button>

{/* v2: Surface container card */}
<div className="bg-surface-container text-on-surface p-6 rounded-xl">
  Card content
</div>

{/* v2: Video aspect ratio */}
<div className="aspect-video">
  <iframe src="youtube-embed" className="w-full h-full" />
</div>
```

---

### Example 6: Button Component with Token Shadows

```tsx
// ❌ Before
<button className="shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_3px_0_rgba(0,0,0,0.1)]">

// ✅ After
<button style={{ boxShadow: 'var(--shadow-button-default)' }}>
  Primary Button
</button>

// Hover state
<button 
  className="transition-shadow hover:shadow-[--shadow-button-hover]"
  style={{ boxShadow: 'var(--shadow-button-default)' }}
>
  Hover me
</button>
```

---

### Example 7: Typography System

```tsx
// Headings (Exposure Trial font)
<h1 style={{
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-5xl)',
  fontWeight: 'var(--font-bold)',
  letterSpacing: 'var(--tracking-tighter)',
  lineHeight: 'var(--leading-tight)'
}}>
  Welcome to Pejla
</h1>

// Body text (Apercu font)
<p style={{
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-base)',
  fontWeight: 'var(--font-normal)',
  letterSpacing: 'var(--tracking-normal)',
  lineHeight: 'var(--leading-normal)',
  color: 'var(--color-text-secondary)'
}}>
  Design feedback platform for modern teams.
</p>
```

---

### Example 8: Dark Mode Toggle

```tsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

// Colors automatically switch via CSS:
// .dark { --color-background: var(--color-gray-1000); }
// v2: Surface containers invert in dark mode automatically
```

---

### Example 9: Card Layout with Tokens

```tsx
<div style={{
  backgroundColor: 'var(--color-background-card)',
  color: 'var(--color-foreground-card)',
  padding: 'var(--spacing-6)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-base)',
  display: 'flex',
  gap: 'var(--spacing-4)',
}}>
  <div>
    <h3 style={{
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-semibold)',
      marginBottom: 'var(--spacing-2)'
    }}>
      Design Review
    </h3>
    <p style={{
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-muted)'
    }}>
      3 options • 10 votes
    </p>
  </div>
</div>
```

---

### Example 10: Animation with Tokens

```tsx
<button style={{
  transition: `all var(--duration-base) var(--ease-out)`,
  transform: 'scale(1)',
}}>
  Hover me
</button>

// With active state
<button 
  className="active:scale-[var(--scale-active)]"
  style={{
    transition: `transform var(--duration-fast) var(--ease-spring)`,
  }}
>
  Click me
</button>

// v2: M3 emphasized easing
<div style={{
  transition: `transform var(--duration-long-1) var(--ease-emphasized-decelerate)`,
}}>
  Smooth deceleration
</div>
```

---

### Example 11: Z-Index Layers

```tsx
// Modal backdrop
<div style={{ zIndex: 'var(--z-modal-backdrop)' }}>...</div>

// Modal content
<div style={{ zIndex: 'var(--z-modal)' }}>...</div>

// Tooltip (always on top)
<div style={{ zIndex: 'var(--z-tooltip)' }}>...</div>
```

---

## 🧪 Testing Dark Mode

1. **Browser DevTools**: Open console → `document.documentElement.classList.toggle('dark')`
2. **Keyboard shortcut**: Add `Cmd+K` handler to toggle theme
3. **System preference**: Detect via `window.matchMedia('(prefers-color-scheme: dark)')`

```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (mediaQuery.matches) {
    document.documentElement.classList.add('dark');
  }
}, []);
```

---

## 📐 Migration Guide (v1 → v2)

### New Tokens (Backward Compatible)

v2 is **100% backward compatible** — all v1 tokens still work!

**What's new**:
1. Surface containers (`--color-surface-container-*`)
2. On-surface text (`--color-on-surface-*`)
3. Tertiary brand (`--color-brand-tertiary`)
4. Outline variants (`--color-outline-variant`)
5. State layers (`--state-hover`, `--state-focus`, `--state-press`)
6. Drop shadows (`--drop-shadow-*`)
7. M3 easing (`--ease-emphasized-*`, `--ease-bounce`)
8. Aspect ratios (`--aspect-*`)

### Step 1: Import tokens.css

```tsx
// src/main.tsx or src/index.tsx
import './tokens/tokens.css';
```

### Step 2: Replace hardcoded values

**Before**:
```tsx
<div className="bg-gray-50 p-4 rounded-lg">
```

**After (v1 style)**:
```tsx
<div style={{
  backgroundColor: 'var(--color-background-subtle)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)'
}}>
```

**After (v2 style)**:
```tsx
<div style={{
  backgroundColor: 'var(--color-surface-container-low)',
  color: 'var(--color-on-surface)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)'
}}>
```

### Step 3: Adopt v2 patterns gradually

**Priority 1: Surface containers** — Replace background colors with surface containers  
**Priority 2: State layers** — Add hover/focus/press states  
**Priority 3: Tertiary color** — Use for accent elements  
**Priority 4: M3 easing** — Upgrade animations

---

## 🎯 Best Practices

1. **Always use semantic tokens** (not primitives) in components
   - ✅ `var(--color-text-primary)`
   - ❌ `var(--color-gray-950)`

2. **Use primitives only for new semantic tokens**
   - Define new semantic color → reference primitive

3. **v2: Prefer surface containers over background colors**
   - ✅ `var(--color-surface-container)`
   - ⚠️ `var(--color-background-card)` (still works, but less flexible)

4. **v2: Use state layers for interactive elements**
   - Buttons, cards, list items → add hover/focus states

5. **Keep tokens.css in sync with design-tokens.json**
   - JSON is source of truth
   - Regenerate CSS if JSON changes

6. **Document custom tokens**
   - Add new tokens to both files
   - Update this README with examples

7. **Test in both light and dark modes**
   - Toggle `.dark` class in browser
   - Verify contrast and readability

---

## 🔗 Platform Export

### Figma Variables
1. Open design-tokens.json
2. Copy primitive colors → Figma Variables (Primitives collection)
3. Copy semantic colors → Figma Variables (Semantic collection)
4. Set dark mode as separate mode in Figma
5. **v2**: Export surface containers and state layers

### iOS/Android
1. Use design-tokens.json as input
2. Generate platform-specific code:
   - iOS: `UIColor` extensions
   - Android: `colors.xml` resources
3. Maintain naming parity (e.g., `color.brand.primary` → `ColorBrandPrimary`)

---

## 🛠 Tooling

**Recommended VSCode extension**: [CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

**Lint CSS custom properties**: Use Stylelint with `stylelint-value-no-unknown-custom-properties`

**Token validation**: Run `npm run validate-tokens` (TBD: add script to package.json)

---

## 📝 Token Naming Convention

**Format**: `--{category}-{subcategory}-{variant}`

Examples:
- `--color-text-primary`
- `--spacing-4`
- `--shadow-button-hover`
- `--font-display`
- `--radius-lg`
- **v2**: `--color-surface-container-high`
- **v2**: `--state-hover`
- **v2**: `--aspect-video`

**Rules**:
- Kebab-case (all lowercase, hyphens)
- Semantic names (describe purpose, not value)
- Consistent hierarchy (category → subcategory → variant)

---

## 🎨 Color System Architecture

```
Primitive (raw OKLCH values)
    ↓
Semantic (references primitives, context-aware)
    ↓
Component (uses semantic tokens in code)
```

Example:
```json
oklch(0.72 0.11 270)         // Primitive: purple.500
    ↓
{colors.primitive.purple.500} // Semantic: brand.primary
    ↓
var(--color-brand-primary)    // Component: <Button />
```

---

## 📦 What's Next?

- [x] Design tokens v1 created (200 tokens)
- [x] **v2: Material Design 3 enhancements (+47 tokens)** ✨
- [ ] Tailwind config integration (Agent 2)
- [ ] Storybook stories with tokens (Agent 2)
- [ ] Component migration (Agent 3)
- [ ] Figma sync plugin (future)
- [ ] iOS/Android token export (future)

---

## 🐛 Troubleshooting

**Q: CSS variables not working in Tailwind?**  
A: Use arbitrary values: `bg-[var(--color-brand-primary)]` or extend Tailwind config.

**Q: Dark mode not switching?**  
A: Ensure `.dark` class is on `<html>` or `<body>` element, not nested.

**Q: OKLCH colors not rendering?**  
A: Use Safari 15+ or Chrome 111+. Fallback to `rgb()` for older browsers if needed.

**Q: Font weights not working?**  
A: Check that font files are loaded correctly. Verify `@font-face` in `index.css`.

**Q: v2: State layers not showing?**  
A: Use `position: relative` on parent and `inset 0 0 0 9999px` for overlay effect.

**Q: v2: Surface containers look wrong?**  
A: Verify dark mode class is applied. Surface containers invert in dark mode.

---

## 🎉 What's New in v2.0

**Material Design 3-inspired enhancements**:
- ✨ **Surface Containers**: 8 new tokens for tonal elevation
- ✨ **State Layers**: 5 opacity tokens + 3 color overlays
- ✨ **Tertiary Brand Color**: Teal accent (3rd brand color)
- ✨ **Outline Variants**: 2 border emphasis levels
- ✨ **Drop Shadows**: 6 filter-compatible shadow tokens
- ✨ **M3 Easing Curves**: 4 new emphasized/bounce easings
- ✨ **Aspect Ratios**: 5 predefined aspect ratios
- ✨ **Fine-Grained Duration**: 3 intermediate duration steps

**Total**: 247+ tokens (v1: 200 → v2: 247)

---

**Need help?** Contact the design system team or open an issue in the repo.

**Version**: 2.0.0 (Mar 2026)  
**Previous**: 1.0.0 (Mar 2026)  
**Maintainers**: Agent 1 (Token Extractor), Agent 5 (v2 Implementation)
