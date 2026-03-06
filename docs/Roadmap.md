# Roadmap

## Done

### Phase 1 — Core platform (complete)
- [x] Poll CRUD (create, read, update, delete)
- [x] 14 REST API endpoints
- [x] Multi-media support (image, video, audio, embeds, text, files, URLs)
- [x] Inline text content (`textContent` field) + "Write text" button
- [x] Cover/thumbnail upload for non-visual options
- [x] Authenticated + anonymous voting
- [x] Password-protected polls with owner bypass
- [x] Visibility: public / unlisted / private
- [x] Comments with optional images
- [x] Remix (fork polls with all content types)
- [x] Deep-link per option: `/poll/:shareId/option/N`
- [x] Media stop on slide change
- [x] Upload progress + cancel (XHR with abort)
- [x] Notifications MVP (model, API, bell component, polling)
- [x] Cloudinary middleware (auto-routes image/video/audio/raw, SVG+GIF skip resize)
- [x] PWA (favicon.svg, apple-touch-icon, web manifest)
- [x] Storybook (Button, Card, Input, AuthModal)

### Phase 1.5 — Polish (complete)
- [x] Custom Figma-style cursor (light/dark)
- [x] Apple-style subtle scrollbar
- [x] Paper-style markdown rendering on vote page
- [x] See-through edit panel
- [x] Smart thumbnails (text preview, audio icon, covers)
- [x] Landing copy updated for broader audience (videos, briefs, tracks)
- [x] "Project briefs" added to rotating words
- [x] Reduced motion support

## Next up

### Phase 2 — Pre-launch prep
- [ ] Lighthouse audit: aim for 90+ on all metrics
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Custom 404 page
- [ ] Error boundary with friendly message
- [ ] Loading skeletons on all pages
- [ ] Mobile responsive audit
- [ ] Meta tags + OG image for social sharing
- [ ] Remove bootcamp references from README/footer
- [ ] Rate limiting on API
- [ ] Input sanitization audit
- [ ] Demo content (5-8 high-quality example polls)

### Phase 3 — Monetization
- [ ] [[Stripe Integration]] — Free / Pro / Team tiers
- [ ] Usage limits on free tier
- [ ] Upgrade prompts in UI

### Phase 4 — Integrations
- [ ] [[Figma Plugin]] — export frames to Pejla polls
- [ ] [[Browser Extension]] — capture current page/URL
- [ ] [[Slack Integration]] — incoming webhook for results
- [ ] [[AI Integration]] — vote summaries, smart tagging

### Phase 5 — Scale
- [ ] Real-time notifications (WebSocket or SSE)
- [ ] Teams & Projects UI
- [ ] Analytics dashboard (PostHog/Plausible)
- [ ] Admin panel improvements
- [ ] Custom branding per team
- [ ] API for external integrations

## Timeline

See [[Beta Launch Plan]] for detailed week-by-week plan.

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Core platform | Done |
| 1.5 | Polish | Done |
| 2 | Pre-launch prep | Next |
| 3 | Monetization (Stripe) | Planned |
| 4 | Integrations | Planned |
| 5 | Scale | Future |
