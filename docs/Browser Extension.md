# Browser Extension

**Status:** Planned
**Priority:** Medium — complements the Figma plugin

## Why

Not everything lives in Figma. Designers review:
- Deploy previews (Vercel, Netlify)
- Competitor websites
- Dribbble/Behance shots
- Prototypes in browser
- Storybook instances

The extension lets you capture any URL or screenshot and send it to Pejla with one click.

## MVP scope

### Core flow
1. Visit any webpage
2. Click Pejla extension icon
3. Choose: "Capture screenshot" or "Share URL"
4. Add to new poll or existing poll
5. Get shareable link

### Extension popup UI
```
+----------------------------------+
|  Pejla                           |
|----------------------------------|
|  Current page:                   |
|  [screenshot preview]            |
|  dribbble.com/shots/12345        |
|                                  |
|  [Screenshot]  [URL only]        |
|                                  |
|  Add to:                         |
|  ( ) New poll                    |
|  ( ) Existing: [dropdown]        |
|                                  |
|  Label: [auto from page title]   |
|                                  |
|  [  Send to Pejla  ]            |
|                                  |
|  ---                             |
|  Recent polls:                   |
|  - Logo v3 (4 votes)             |
|  - Header variants (12 votes)    |
+----------------------------------+
```

### Features (MVP)
- Capture visible tab as screenshot (Chrome `captureVisibleTab` API)
- Send current URL as embeddable option (if supported) or fallback card
- Auto-label from page `<title>`
- Create new poll or add to existing
- Copy share link
- Badge icon showing unread notification count (ties into [[Notifications]])

### Features (v2)
- Area selection (crop before sending)
- Full-page screenshot
- Right-click context menu: "Send image to Pejla"
- "Compare this page" — capture same URL at different times
- Annotate screenshot before sending

## Technical approach

### Manifest V3 (Chrome)
```json
{
  "manifest_version": 3,
  "name": "Pejla",
  "version": "1.0.0",
  "description": "Share designs, collect votes",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon-48.png"
  },
  "background": {
    "service_worker": "background.js"
  },
  "icons": {
    "16": "icon-16.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  }
}
```

### Screenshot capture
```typescript
// In popup or background script
chrome.tabs.captureVisibleTab(null, { format: "png", quality: 90 }, (dataUrl) => {
  // dataUrl is base64 PNG — upload to Pejla API
});
```

### Auth
- Store access token in `chrome.storage.local`
- Login flow: open pejla.io/login in new tab, redirect back with token
- Or: inline login form in popup

### File structure
```
browser-extension/
  manifest.json
  popup.html / popup.tsx    # Main UI
  background.js             # Service worker
  content.js                # (v2) for area selection overlay
  icons/
```

### Cross-browser
- Start with Chrome (largest market share among designers)
- Firefox: minimal changes (manifest v2 still supported)
- Safari: later (requires Xcode wrapper)

## New API endpoints needed

Same as [[Figma Plugin]]:
- `POST /polls/:id/options` — add options to existing poll
- `POST /upload/base64` — upload from base64 data URL
- `GET /users/me/polls` — list user's polls

## Distribution
- Chrome Web Store (free to publish, $5 one-time fee)
- Cross-promote from Figma plugin + pejla.io
- "Capture anything" messaging
