# Beta Launch Plan

## Overview

Launch in phases. Don't go Product Hunt on day 1. Build confidence, get real feedback, fix the rough edges, then go public.

## Pre-launch checklist

### Clean up for production
- [ ] Remove Technigo bootcamp references (footer, README, any school-specific copy)
- [ ] Remove test/dummy polls from database
- [ ] Audit all copy — no "lorem ipsum", no placeholder text
- [ ] Custom 404 page
- [ ] Error boundary with friendly message
- [ ] Loading states everywhere (skeleton screens)
- [ ] Mobile responsive audit (every page)
- [ ] Lighthouse audit: aim for 90+ on all metrics
- [ ] Meta tags (title, description, OG image for social sharing)
- [ ] Favicon + apple-touch-icon (already done via PWA)
- [ ] HTTPS everywhere
- [ ] Rate limiting on API (prevent abuse)
- [ ] Input sanitization audit (XSS, injection)
- [ ] Environment variables: no secrets in code

### Demo content
- [ ] Create 5-8 high-quality example polls that showcase the platform:
  - Logo comparison (3 variants)
  - UI component vote (buttons, cards)
  - Color palette decision
  - Landing page A/B test
  - Mobile vs desktop layout
  - Icon style vote (outline vs filled)
- [ ] Use real design assets (your own work or with permission)
- [ ] Show variety: images, embeds (Figma site), video
- [ ] Have friends vote on them so they show real vote counts

### Analytics
- [ ] Set up Plausible or PostHog (privacy-friendly, no cookie banner needed)
- [ ] Track key events:
  - Page views (landing, create, vote, results)
  - Poll created
  - Vote cast
  - Share link copied
  - Sign up
  - Login
  - Upgrade click (for later)
- [ ] Set up conversion funnel: Visit -> Sign up -> Create poll -> Get votes
- [ ] Error tracking: Sentry (free tier)

### Legal
- [ ] Privacy policy page (GDPR compliant — you're in Sweden)
- [ ] Terms of service
- [ ] Cookie policy (if using analytics cookies)
- [ ] Data deletion capability (GDPR right to be forgotten)

---

## Phase 1: Friends & Family (Week 1-2)

**Goal:** Find obvious bugs, validate core flow works

- Share with 10-15 people you trust (classmates, designer friends, Qasa friend)
- Ask them to: create a poll, vote on yours, share with 1 person
- Collect feedback via a Pejla poll (meta!)
- Fix critical bugs

**Success metric:** 10 polls created, 50 votes cast, no critical bugs

## Phase 2: Design Community Beta (Week 3-4)

**Goal:** Test with real designers, get organic feedback

### Distribution channels
- Post in design Slack/Discord communities
- Share on LinkedIn (your network + design groups)
- Tweet/X with demo GIF showing the flow
- Post on Designers Sverige / Swedish design communities
- Ask Qasa friend to try it with their team (real internal use case!)

### Messaging
> "I built a tool to fix broken design feedback. Instead of 'I like the first one' in Slack — share a link, vote, decide. Free, no sign-up needed to vote. Would love your feedback."

- Include a link to a real poll they can vote on (experience it before signing up)
- Show, don't tell — GIF/video of the 30-second flow

**Success metric:** 50 users, 30 polls, NPS > 7

## Phase 3: Product Hunt Launch (Week 5-6)

### Product Hunt prep
- [ ] Create maker profile on Product Hunt
- [ ] Get 5+ hunter friends to upvote early
- [ ] Prepare launch assets:
  - [ ] Tagline: "Design feedback, without the noise"
  - [ ] Description (250 chars): "Share design options, collect votes, decide in minutes. Supports Figma, images, video. Free forever."
  - [ ] Gallery images (5-6):
    1. Hero shot (landing page)
    2. Create poll flow
    3. Vote experience (mobile)
    4. Results view
    5. Figma embed in action
    6. Before/after: Slack thread vs Pejla poll
  - [ ] Demo video (60-90 seconds): problem -> solution -> CTA
  - [ ] First comment (maker comment explaining why you built it)
- [ ] Schedule launch for Tuesday/Wednesday (best days)
- [ ] Launch at 00:01 PST (Product Hunt resets at midnight PST)
- [ ] Be available all day to respond to comments

### Product Hunt description template
```
Problem: Design feedback is broken. "I prefer the first one" is not actionable. Slack threads spiral. Meetings waste time.

Pejla fixes this:
1. Share — upload designs, paste Figma/YouTube links
2. Vote — one tap, no sign-up needed
3. Decide — see results instantly

Built by a designer who was tired of "can you just make it pop more?"

Free forever. Pro + Team plans coming soon.
```

**Success metric:** Top 10 of the day, 200+ upvotes, 100 sign-ups

## Phase 4: Growth (Week 7+)

### Before sharing with design teams / clients
- [ ] Stripe integration live (so people can actually upgrade)
- [ ] Notifications working (users come back)
- [ ] Team features in UI (not just models)
- [ ] Figma plugin MVP (huge differentiator)
- [ ] [[Slack Integration]] MVP — incoming webhook to post results to team channels (launch differentiator for design teams already living in Slack)
- [ ] Custom domain + professional email (hello@pejla.io)
- [ ] Support channel (email or Discord)

### LinkedIn strategy
- Write 3-4 posts about the journey:
  1. "I built a tool to fix design feedback" (launch post)
  2. "What I learned building Pejla" (builder story)
  3. "How [Qasa/company] uses Pejla for design decisions" (case study)
  4. "Pejla now has a Figma plugin" (feature launch)
- Tag relevant people, use #design #productdesign #ux hashtags
- Post poll results as social proof ("142 designers voted, Option B won")

### Client outreach
- Identify 5-10 agencies/teams who might use it
- Offer free Pro for 3 months in exchange for feedback
- Build case studies from their usage

---

## Timeline summary

| Week | Phase | Focus |
|------|-------|-------|
| 1-2 | Friends & Family | Bug fixes, core flow |
| 3-4 | Design Community | Real users, messaging |
| 5-6 | Product Hunt | Public launch |
| 7-8 | Stripe + Notifications | Monetization |
| 9-10 | Figma Plugin MVP | Distribution |
| 11-12 | [[Slack Integration]] MVP | Team adoption |
| 13-14 | LinkedIn + Outreach | Growth |
| 15+ | [[AI Integration]] (vote summaries, smart tagging) | Differentiation |

## Key metrics to track

| Metric | Target (3 months) |
|--------|-------------------|
| Registered users | 500 |
| Polls created | 200 |
| Votes cast | 2,000 |
| DAU | 50 |
| Pro conversions | 10 |
| Team conversions | 3 |
| Figma plugin installs | 100 |
| Slack workspaces connected | 20 |
| AI summaries generated | 50 |
