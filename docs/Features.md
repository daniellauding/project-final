# Features

## Core (shipped)

### Poll creation
- 3-step flow: Options -> Question -> Publish
- Upload images, video, audio, or any file via Cloudinary
- Paste URLs (Figma, YouTube, Vimeo, Loom, CodePen, Spotify, etc.)
- Paste-anywhere with `findTarget()` — pastes into selected option, empty slot, or creates new card
- Auto-generated title from first option label
- Min 2 options required
- "Write text" button — create inline markdown content without file upload
- Cover/thumbnail upload for audio, video, text, and PDF options

### Media support
- **Images** — PNG, JPG, WebP, SVG, GIF (Cloudinary CDN)
- **Video** — MP4, WebM (Cloudinary video player)
- **Audio** — MP3, WAV (native audio element)
- **Embeds** — YouTube, Vimeo, Loom, CodePen, CodeSandbox, Spotify, Figma Sites
- **Text files** — .md, .txt, .csv rendered inline with react-markdown
- **Inline text** — write markdown directly in `textContent` field (no upload)
- **External URLs** — Non-embeddable links show fallback card with favicon
- **Deploy previews** — Vercel, Netlify, GitHub Pages, Render, Railway, etc. embedded as iframe

### Voting
- One-tap voting (authenticated)
- Anonymous voting via localStorage fingerprint (toggle per poll)
- Change vote (unvote + revote)
- Deep-link to specific option via `/poll/:shareId/option/N`
- Media auto-stops on slide change (audio/video pause)

### Privacy & access
- **Public** — visible in feed + searchable
- **Unlisted** — accessible via link, hidden from public feed
- **Private** — password-protected (owner bypasses password)

### Results
- Live vote counts + percentages
- Winner highlight (toggleable)
- Comments on polls (with optional image)
- Remix — fork any poll to create variations (all formats supported)

### Notifications
- In-app notification bell with unread count badge
- Auto-created on vote, comment, and remix
- Polls every 30s for new notifications
- Mark all as read / individual read
- Links directly to the poll

### Landing page
- Logo intro animation (plays once per session)
- Sequential word animation: "Design feedback" -> "Client reviews" -> "Project briefs" -> etc.
- Floating Figma-style cursors (Mia/Alex/Sam) with path animation + click ripple
- Hero poll preview card (scroll parallax fade-out)
- Focus carousel for recent polls with card stack effect
- Quote carousel with designer pain points
- "How it works" 3-step section with animated illustrations
- Copy: "Share designs, videos, briefs, or tracks — collect votes and see which idea wins."

### UI/UX polish
- Custom Figma-style cursor (light/dark mode, matches hero cursors)
- Apple-style subtle scrollbar (thin, rounded, works on macOS + Windows)
- Paper-style markdown rendering (white card, shadow, prose typography)
- See-through edit panel (narrow, transparent backdrop)
- Smart thumbnails on Dashboard/Home (text preview, audio icon, cover images)
- Upload progress with cancel for both files and covers
- PWA ready (manifest, icons)
- Storybook component library
- Share button copies poll URL with current option
- Reduced motion support

## Planned

- [[Stripe Integration]] — paid tiers
- [[Figma Plugin]] — export frames directly to Pejla
- [[Browser Extension]] — capture current page/URL to Pejla
- [[Slack Integration]] — post results to team channels
- [[AI Integration]] — vote summaries, smart tagging, sentiment
- Teams & Projects — already have models, need UI
- Real-time notifications (WebSocket/SSE)
- Analytics dashboard (PostHog/Plausible)
