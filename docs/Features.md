# Features

## Core (shipped)

### Poll creation
- 3-step flow: Options -> Question -> Publish
- Upload images, video, audio, or any file via Cloudinary
- Paste URLs (Figma, YouTube, Vimeo, Loom, CodePen, Spotify, etc.)
- Paste-anywhere with `findTarget()` — pastes into selected option, empty slot, or creates new card
- Auto-generated title from first option label
- Min 2 options required

### Media support
- **Images** — PNG, JPG, WebP, SVG, GIF (Cloudinary CDN)
- **Video** — MP4, WebM (Cloudinary video player)
- **Audio** — MP3, WAV (native audio element)
- **Embeds** — YouTube, Vimeo, Loom, CodePen, CodeSandbox, Spotify, Figma Sites
- **Text files** — .md, .txt, .csv rendered inline with react-markdown
- **External URLs** — Non-embeddable links show fallback card with favicon
- **Deploy previews** — Vercel, Netlify, GitHub Pages, Render, Railway, etc. embedded as iframe

### Voting
- One-tap voting (authenticated)
- Anonymous voting via localStorage fingerprint (toggle per poll)
- Change vote (unvote + revote)
- Deep-link to specific option via `?option=N`

### Privacy & access
- **Public** — visible in feed + searchable
- **Unlisted** — accessible via link, hidden from public feed
- **Private** — password-protected (owner bypasses password)

### Results
- Live vote counts + percentages
- Winner highlight (toggleable)
- Comments on polls
- Remix — fork any poll to create variations

### Landing page
- Logo intro animation (plays once per session)
- Sequential word animation: "Design feedback" -> "Client reviews" -> etc.
- Floating Figma-style cursors (Mia/Alex/Sam)
- Click ripple effect (pink/blue/green)
- Hero poll preview card (scroll parallax fade-out)
- Focus carousel for recent polls with card stack effect
- Quote carousel with designer pain points
- "How it works" 3-step section with animated illustrations

### Other
- PWA ready (manifest, icons)
- Storybook component library
- Share button copies poll URL with current option

## Planned

- [[Figma Plugin]] — export frames directly to Pejla
- [[Browser Extension]] — capture current page/URL to Pejla
- [[Notifications]] — in-app activity bell
- [[Stripe Integration]] — paid tiers
- Teams & Projects — already have models, need UI
