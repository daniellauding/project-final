# Design Token Migration Guide

## ✅ Status: Components Already Migrated!

Good news: All Pejla components already use **semantic tokens** (via shadcn/ui). The token integration work connected these semantic tokens to our new design token system.

## What Changed

### Before Token Integration
- Components used semantic classes (`bg-background`, `text-foreground`)
- Token values were hardcoded in `index.css`
- No centralized design token source

### After Token Integration
- Components **still use** semantic classes (no changes needed!)
- Token values now come from `src/tokens/design-tokens.json`
- Design tokens are generated as CSS custom properties in `tokens.css`
- Easy to theme and customize for Teams/Organizations

---

## Token System Architecture

```
design-tokens.json (source of truth)
    ↓
tokens.css (generated CSS variables)
    ↓
@theme inline (maps to Tailwind classes)
    ↓
Components (use semantic Tailwind classes)
```

---

## Available Semantic Tokens

### Colors

| Token Class | CSS Variable | Usage |
|------------|--------------|-------|
| `bg-background` | `--color-background` | Page background |
| `bg-card` | `--color-background-card` | Card backgrounds |
| `text-foreground` | `--color-foreground` | Primary text |
| `text-muted-foreground` | `--color-muted-foreground` | Secondary text |
| `border-border` | `--color-border` | Default borders |
| `bg-primary` | `--color-brand-primary` | Primary CTA buttons |
| `bg-destructive` | `--color-destructive` | Destructive actions |
| `bg-accent` | `--color-accent` | Hover states |

### Spacing

All Tailwind spacing classes (`p-4`, `m-6`, `gap-2`) now use design tokens:

```tsx
// These all use design token spacing scale
<div className="p-4">       {/* --spacing-4 = 16px */}
<div className="m-6">       {/* --spacing-6 = 24px */}
<div className="gap-2">     {/* --spacing-2 = 8px */}
```

### Border Radius

```tsx
<div className="rounded-lg">   {/* --radius-lg */}
<div className="rounded-full"> {/* --radius-full */}
```

### Shadows

Button shadows now use design tokens:
- `--shadow-button-default`
- `--shadow-button-hover`
- `--shadow-button-secondary`
- `--shadow-button-outline`

---

## Using Design Tokens in New Components

### Option 1: Use Semantic Tailwind Classes (Recommended)

```tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div className="bg-background text-foreground border-border">
      <h1 className="text-foreground">Hello</h1>
      <p className="text-muted-foreground">Description</p>
      <Button variant="default">Click me</Button>
    </div>
  );
}
```

### Option 2: Use CSS Variables Directly

For custom styles not covered by Tailwind:

```tsx
export function CustomComponent() {
  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-foreground)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
    }}>
      Custom styled content
    </div>
  );
}
```

### Option 3: Use Token Utility Functions

For programmatic access to tokens:

```tsx
import { getColor, getSpacing, getRadius } from "@/tokens/utils";

export function DynamicComponent() {
  const primaryColor = getColor('brand', 'primary'); // 'var(--color-brand-primary)'
  const padding = getSpacing(4); // 'var(--spacing-4)'
  
  return (
    <div style={{ 
      color: primaryColor,
      padding 
    }}>
      Dynamic styling
    </div>
  );
}
```

---

## Theming Support

### Light/Dark Mode

Pejla already supports light/dark mode via `next-themes`. Design tokens automatically update when theme changes.

```tsx
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

### Custom Brand Themes (Future: Teams/Organizations)

Apply custom brand colors using theme utilities:

```tsx
import { applyTheme } from "@/tokens/themes";

// Apply a preset theme
applyTheme('purple'); // Purple branding
applyTheme('green');  // Green branding
applyTheme('blue');   // Blue branding

// Apply custom theme
import { applyCustomTheme } from "@/tokens/themes";

applyCustomTheme({
  '--color-brand-primary': 'oklch(0.7 0.15 350)',
  '--color-brand-secondary': 'oklch(0.6 0.12 340)',
});
```

---

## Token Utility Functions Reference

Import from `@/tokens/utils`:

### `getToken(path: string)`
Get raw token value from design-tokens.json.

```tsx
import { getToken } from "@/tokens/utils";

const primaryColor = getToken('colors.primitive.purple.500');
// => 'oklch(0.72 0.11 270)'
```

### `getVar(...parts: string[])`
Get CSS variable reference.

```tsx
import { getVar } from "@/tokens/utils";

const colorVar = getVar('color', 'brand', 'primary');
// => 'var(--color-brand-primary)'
```

### `getSpacing(scale: number)`
Get spacing variable.

```tsx
import { getSpacing } from "@/tokens/utils";

const spacing = getSpacing(4);
// => 'var(--spacing-4)' (16px)
```

### `getColor(...path: string[])`
Get color variable.

```tsx
import { getColor } from "@/tokens/utils";

const color = getColor('brand', 'primary');
// => 'var(--color-brand-primary)'
```

### `getRadius(size: string)`
Get border radius variable.

```tsx
import { getRadius } from "@/tokens/utils";

const radius = getRadius('lg');
// => 'var(--radius-lg)' (10px)
```

### `getShadow(size: string)`
Get shadow variable.

```tsx
import { getShadow } from "@/tokens/utils";

const shadow = getShadow('md');
// => 'var(--shadow-md)'
```

### `applyTheme(overrides: Record<string, string>)`
Apply custom theme overrides.

```tsx
import { applyTheme } from "@/tokens/utils";

applyTheme({
  '--color-brand-primary': '#ff0000',
  '--color-brand-secondary': '#00ff00',
});
```

---

## Common Patterns

### Buttons

```tsx
// Primary button
<Button variant="default">
  Primary action
</Button>

// Secondary button
<Button variant="secondary">
  Secondary action
</Button>

// Destructive button
<Button variant="destructive">
  Delete
</Button>

// Ghost button
<Button variant="ghost">
  Cancel
</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Forms

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com"
  />
</div>
```

### Text Hierarchy

```tsx
<div>
  <h1 className="text-foreground">Primary heading</h1>
  <p className="text-muted-foreground">Secondary text</p>
  <span className="text-muted-foreground">Tertiary text</span>
</div>
```

---

## Testing Token Integration

### Visual Testing

1. **Run Storybook**:
   ```bash
   npm run storybook
   ```

2. **Toggle dark mode** in Storybook toolbar
3. **Verify all components** render correctly in both modes

### Automated Testing

Check that no hardcoded colors remain:

```bash
# Should return 0 results
grep -r "bg-gray-500" src/components/
grep -r "text-blue-600" src/components/
grep -r "#[0-9a-fA-F]{6}" src/components/ --include="*.tsx"
```

### Browser DevTools

1. Open browser DevTools (F12)
2. Select `:root` in Elements tab
3. Verify all `--color-*`, `--spacing-*`, `--radius-*` variables are present
4. Toggle `.dark` class to see token values update

---

## Future Improvements

### Phase 2: Remaining Components
- Badge variants
- Avatar colors
- Dialog overlays
- Toast notifications

### Phase 3: Advanced Theming
- Per-team custom branding
- Brand color picker UI
- Theme preview in settings
- Export theme JSON for API

### Phase 4: Design Tool Integration
- Figma plugin for token sync
- Export tokens to React Native
- Generate Swift/Kotlin tokens for mobile apps

---

## Troubleshooting

### Issue: Colors not updating in dark mode

**Solution**: Ensure `.dark` class is applied to `<html>` or root element:

```tsx
import { useTheme } from "next-themes";

const { theme } = useTheme();
// This should add/remove .dark class automatically
```

### Issue: Custom shadows not working

**Solution**: Use `shadow-[var(--shadow-name)]` syntax:

```tsx
// ❌ Wrong
<div className="shadow-button-default">

// ✅ Correct
<div className="shadow-[var(--shadow-button-default)]">
```

### Issue: Spacing values different than expected

**Solution**: Check design-tokens.json for actual pixel values. Tailwind's spacing scale is 4px-based (1 = 4px, 2 = 8px, etc.).

---

## Need Help?

- Check `src/tokens/README.md` for design token documentation
- Review `src/tokens/design-tokens.json` for all available tokens
- Browse `src/tokens/tokens.css` to see generated CSS variables
- Ask in #pejla-development Discord channel

---

**Last updated**: 2026-03-06  
**Token system version**: 1.0.0  
**Maintainer**: Agent 3 (Token Integration Engineer)
