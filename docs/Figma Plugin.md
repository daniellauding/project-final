# Figma Plugin

**Status:** Planned
**Priority:** High — this is the #1 distribution channel

## Why this is key

Designers live in Figma. If Pejla is one click away from their canvas, adoption becomes frictionless. No copy-paste, no export-upload-share dance. Select frames -> create poll -> share link. Done.

## MVP scope

### Core flow
1. Select 2+ frames/components in Figma
2. Click "Send to Pejla" in plugin panel
3. Plugin exports each frame as PNG (or uses Figma's `exportAsync`)
4. Uploads to Pejla API (via Cloudinary)
5. Creates a new poll (or adds to existing poll)
6. Returns shareable link: `pejla.io/poll/abc123`

### Plugin UI (minimal)
```
+----------------------------------+
|  Pejla                     [?]   |
|----------------------------------|
|  Selected: 3 frames              |
|                                  |
|  [thumbnails of selected frames] |
|                                  |
|  Title: [auto from page name]    |
|  [ ] Anonymous voting            |
|  [ ] Add to existing poll  [v]   |
|                                  |
|  [  Create poll & share  ]       |
|                                  |
|  --- or ---                      |
|                                  |
|  Your polls:                     |
|  - Logo v3 (4 votes)        [>]  |
|  - Header variants (12 votes)[>] |
|----------------------------------|
|  Comments on "Logo v3":          |
|  @mia: "Top left feels heavy"    |
|  @alex: "Love the contrast"      |
+----------------------------------+
```

### Features (MVP)
- Export selected frames as PNG (72dpi for speed, 2x for quality toggle)
- Auto-title from Figma page/frame name
- Create new poll or add options to existing poll
- Copy share link to clipboard
- View your polls list + vote counts
- View comments on each poll
- Deep-link back to Figma frame from poll option (store Figma node URL)

### Features (v2)
- Live preview — changes in Figma auto-update poll options
- Export as SVG or PDF
- Team workspace — see team polls
- Figma comments <-> Pejla comments sync
- Notification badge in plugin when new votes arrive
- "Compare versions" — select same frame from different pages/branches
- Vote counts visible inside Figma — see how each frame/option is performing without leaving the canvas
- [[Slack Integration]] — show which Slack channel a poll was posted to, and surface Slack channel notifications directly in the plugin panel
- "AI Brief" button — generate a structured feedback brief from selected frames via [[AI Integration]]

## Technical approach

### Figma Plugin API
```typescript
// Export selected nodes as PNG
const selection = figma.currentPage.selection;
for (const node of selection) {
  const bytes = await node.exportAsync({
    format: "PNG",
    constraint: { type: "SCALE", value: 2 }
  });
  // Send bytes to Pejla API
}
```

### Auth
- OAuth or access token stored in `figma.clientStorage`
- Login once, stay logged in
- `figma.clientStorage.setAsync("pejla-token", token)`

### API calls from plugin
- Figma plugins can make network requests via `figma.ui.postMessage` + iframe UI
- Plugin UI (iframe) calls Pejla API directly
- Upload flow: export PNG bytes -> base64 -> POST to `/upload` -> get URL -> create poll

### File structure
```
figma-plugin/
  manifest.json        # Figma plugin manifest
  code.ts              # Plugin sandbox (Figma API access)
  ui.html              # Plugin UI (iframe, can use React)
  ui.tsx               # React UI for the panel
```

### Figma manifest.json
```json
{
  "name": "Pejla",
  "id": "pejla-figma-plugin",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": {
    "allowedDomains": ["https://api.pejla.io", "https://res.cloudinary.com"]
  }
}
```

## New API endpoints needed

| Method | Path | Description |
|--------|------|-------------|
| POST | `/polls/:id/options` | Add options to existing poll |
| POST | `/upload/base64` | Upload from base64 (plugin can't do multipart easily) |
| GET | `/users/me/polls` | List current user's polls (for "add to existing") |

## Distribution
- Publish to Figma Community (free)
- "Made by a designer, for designers" angle
- Launch on Twitter/X + Figma community
- Show in Pejla landing page: "Works with Figma"
