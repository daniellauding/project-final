# Pricing Model

## Philosophy

Free to start, pay when you need team features. The core voting experience should always be free — that's how you get adoption. Money comes from teams who use it daily.

Your friend at Qasa said it: "hade kunnat anvant internt." That's the signal — **teams paying monthly** is the model.

## Tiers

### Free (always free)
- Unlimited public polls
- Up to 5 active polls at a time
- Image/video/audio uploads (50MB limit)
- Embed support (Figma, YouTube, etc.)
- Anonymous voting
- Share links
- Comments
- Basic results (votes + percentages)

### Pro — ~79 SEK/mo (~$8/mo)
- Unlimited active polls
- Unlisted + private polls
- Password-protected polls
- Poll deadlines
- Upload limit: 500MB
- Remove "Made with Pejla" watermark
- Custom share slug (`pejla.io/your-name/poll-title`)
- Export results as CSV/PDF
- Priority support

### Team — ~249 SEK/mo (~$25/mo, up to 10 seats)
- Everything in Pro
- Team workspace
- Projects (group polls)
- Team member roles (admin/editor/viewer)
- Invite via link
- Team activity feed
- Shared asset library
- +29 SEK/mo per extra seat

### Enterprise (contact sales)
- SSO / SAML
- Custom domain
- API access
- SLA
- Dedicated support
- Audit log
- On-prem option (maybe)

## Why this works

| Tier | Target | Revenue driver |
|------|--------|---------------|
| Free | Individual designers, students | Adoption + word of mouth |
| Pro | Freelancers, consultants | Privacy + branding |
| Team | Agencies, in-house teams (like Qasa) | Collaboration |
| Enterprise | Large orgs | High ACV |

## Freemium conversion triggers
- Hit 5 poll limit -> "Upgrade to Pro for unlimited"
- Try to set password on free -> "Pro feature"
- Invite team member -> "Start a Team plan"
- Results page: "Export as PDF" grayed out -> "Pro feature"

## Revenue math (conservative)
- 1,000 free users (costs ~$0)
- 5% convert to Pro = 50 x $8 = $400/mo
- 2% convert to Team = 20 x $25 = $500/mo
- Total: ~$900/mo at 1,000 users
- At 10,000 users: ~$9,000/mo

## Implementation
See [[Stripe Integration]]
