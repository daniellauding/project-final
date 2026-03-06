# Pejla Design Tokens

**Single source of truth for all design values in the Pejla design system.**

This token system follows Figma's variable structure with **primitive → semantic** naming, making it portable across platforms (web, iOS, Android, Figma).

---

## 📁 Files

- **`design-tokens.json`** — JSON source of truth (all tokens, all platforms)
- **`tokens.css`** — CSS custom properties with dark mode support
- **`README.md`** — This usage guide

---

## 🎨 Token Categories

### Colors

**Primitive colors** (raw OKLCH values):
- `colors.primitive.gray.50` → `colors.primitive.gray.1000`
- `colors.primitive.purple.400/500/600`
- `colors.primitive.red.500/600`
- `colors.primitive.white/black`

**Semantic colors** (references to primitives):
- `colors.semantic.background.*` — page/card/input backgrounds
- `colors.semantic.foreground.*` — text on backgrounds
- `colors.semantic.text.*` — primary/secondary/muted text
- `colors.semantic.border.*` — default/input borders
- `colors.semantic.brand.*` — primary/secondary brand colors
- `colors.semantic.accent.*` — accent backgrounds
- `colors.semantic.destructive.*` — error/delete actions
- `colors.semantic.ring.*` — focus rings

**Dark mode overrides**: `colors.dark.*` (automatically applied via `.dark` class)

---

### Spacing

Base-4 scale: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96...`

- `spacing.scale.0` → `spacing.scale.96`
- Use for: padding, margin, gap, width, height

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

- `shadows.xs/sm/base/md/lg/xl/2xl` — elevation levels
- `shadows.button.*` — specialized button shadows (inset + drop)
- `shadows.inner` — inset shadow

---

### Border Radius

- `radii.none` → `radii.3xl` (0px → 24px)
- `radii.full` — perfect circles (9999px)

---

### Animations

**Durations**: `instant (0ms)` → `slower (700ms)`  
**Easings**: `linear`, `ease`, `easeIn`, `easeOut`, `easeInOut`, `spring`  
**Scales**: `active (0.97)`, `hover (1.02)`

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

### Example 2: Extending Tailwind Config

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'text-primary': 'var(--color-text-primary)',
        'bg-default': 'var(--color-background)',
      },
      spacing: {
        '4': 'var(--spacing-4)',
        '6': 'var(--spacing-6)',
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      }
    }
  }
}
```

Then use in components:
```tsx
<button className="bg-brand-primary text-white px-6 py-4 rounded-lg">
  Click me
</button>
```

---

### Example 3: Button Component with Token Shadows

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

### Example 4: Typography System

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

### Example 5: Dark Mode Toggle

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
```

---

### Example 6: Card Layout with Tokens

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

### Example 7: Animation with Tokens

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
```

---

### Example 8: Z-Index Layers

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

## 📐 Migration Guide

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

**After**:
```tsx
<div style={{
  backgroundColor: 'var(--color-background-subtle)',
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)'
}}>
```

### Step 3: Update Tailwind classes (if using Tailwind utilities)

**Before**:
```tsx
<button className="bg-purple-500 text-white px-6 py-2 rounded-full">
```

**After**:
```tsx
<button className="bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)] px-[var(--spacing-6)] py-[var(--spacing-2)] rounded-[var(--radius-full)]">
```

Or extend Tailwind config (recommended):
```tsx
<button className="bg-brand-primary text-white px-6 py-2 rounded-full">
```

---

## 🎯 Best Practices

1. **Always use semantic tokens** (not primitives) in components
   - ✅ `var(--color-text-primary)`
   - ❌ `var(--color-gray-950)`

2. **Use primitives only for new semantic tokens**
   - Define new semantic color → reference primitive

3. **Keep tokens.css in sync with design-tokens.json**
   - JSON is source of truth
   - Regenerate CSS if JSON changes

4. **Document custom tokens**
   - Add new tokens to both files
   - Update this README with examples

5. **Test in both light and dark modes**
   - Toggle `.dark` class in browser
   - Verify contrast and readability

---

## 🔗 Platform Export

### Figma Variables
1. Open design-tokens.json
2. Copy primitive colors → Figma Variables (Primitives collection)
3. Copy semantic colors → Figma Variables (Semantic collection)
4. Set dark mode as separate mode in Figma

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

- [x] Design tokens created
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

---

**Need help?** Contact the design system team or open an issue in the repo.

**Version**: 1.0.0 (Mar 2026)  
**Maintainer**: Agent 1 (Design Token Extractor)
