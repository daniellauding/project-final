# Storybook + Tailwind v4 Integration Issue

## Problem
Tailwind CSS v4 styles **do not apply** in Storybook preview iframe.

## Evidence
- Button variants story shows no spacing (`gap-4` not applied)
- All buttons clustered together without margins
- DevTools shows NO external stylesheets loaded in iframe
- Only inline Storybook styles present

## Root Cause
Tailwind v4's `@import "tailwindcss";` directive in `src/index.css` is **not processed** by Storybook's Vite build.

### Why this happens:
1. Tailwind v4 requires `@tailwindcss/vite` plugin to process `@import "tailwindcss"`
2. Plugin is added to `.storybook/main.ts` viteFinal config ✅
3. BUT: Tailwind v4 + Storybook integration may be incomplete/broken

## Attempted Fixes
1. ✅ Added `tailwindcss()` to viteFinal plugins
2. ✅ Cleared Vite cache (`rm -rf node_modules/.vite`)
3. ✅ Pre-optimized dependencies
4. ✅ Hard browser reload
5. ❌ None worked

## Workarounds

### Option 1: Downgrade to Tailwind v3
```bash
npm uninstall @tailwindcss/vite
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Then update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Option 2: Build Tailwind separately for Storybook
Create `.storybook/tailwind-output.css`:
```bash
npx @tailwindcss/cli@next -i src/index.css -o .storybook/tailwind-output.css --watch
```

Import in `preview.tsx`:
```tsx
import './tailwind-output.css'
```

### Option 3: Wait for official Tailwind v4 + Storybook support
Tailwind v4 is still in beta. Storybook may not fully support it yet.

## Recommendation
**Use Option 1 (downgrade to v3)** for now. Tailwind v4 is beta and not production-ready.

## Files Modified
- `.storybook/main.ts` - added tailwindcss plugin
- `.storybook/preview.tsx` - imports index.css

## Links
- [Tailwind v4 docs](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [Storybook Vite builder](https://storybook.js.org/docs/builders/vite)
- [GitHub issue: Tailwind v4 + Storybook](https://github.com/storybookjs/storybook/issues/...)
