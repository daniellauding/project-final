# Architecture

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind v4 + shadcn/ui |
| State | Zustand |
| Backend | Express.js + Node |
| Database | MongoDB Atlas + Mongoose |
| Auth | bcrypt + access token (UUID) |
| File storage | Cloudinary (image/video/audio/raw) |
| Hosting | Render |
| Domain | pejla.io |

## Monorepo structure

```
project-final/
  frontend/          # Vite React app
    src/
      api/           # polls.ts, auth.ts (API client + XHR upload)
      components/    # ui/ (shadcn), AuthModal, TextFilePreview
      pages/         # Home, CreatePoll, EditPoll, VotePoll, Profile
      stores/        # pollStore.ts (Zustand)
      utils/         # embedUrl.ts (URL-to-embed converter)
  backend/
    server.js        # All endpoints, auth middleware
    middleware/       # upload.js (Cloudinary)
    models/          # User, Poll, Comment, Team, Project, Report
  docs/              # This Obsidian vault
```

## Data models

### User
- `username` (unique, 3-20 chars)
- `email` (unique, lowercase)
- `password` (bcrypt hashed)
- `role` (user | admin)
- `avatarUrl`
- `accessToken` (UUID, generated on create)

### Poll
- `title` (3-100 chars)
- `description` (max 500)
- `creator` (ref User)
- `creatorName`
- `options[]` — each option has:
  - `label`, `imageUrl`, `externalUrl`, `embedUrl`
  - `videoUrl`, `audioUrl`, `fileUrl`, `fileName`
  - `embedType` (none | figma | lovable | codepen | generic)
  - `votes[]` (ref User)
- `status` (draft | published | closed)
- `visibility` (public | unlisted | private)
- `shareId` (8-char UUID slug)
- `password` (optional, plain text gate)
- `allowAnonymousVotes`, `allowRemix`, `showWinner`
- `deadline`, `remixedFrom`

### Team
- `name`, `description`, `owner` (ref User)
- `members[]` — each: `user`, `role` (admin | editor | viewer), `joinedAt`
- `inviteCode` (8-char UUID)

### Project
- `name`, `description`
- `team` (ref Team), `creator` (ref User)
- `polls[]` (ref Poll)

### Comment
- Linked to poll + option, supports threaded replies

### Report
- Content moderation for polls/comments

## API endpoints

See [[API Reference]]

## Key patterns

- **XHR for uploads** — `fetch()` doesn't support upload progress events. We use XHR with `onprogress` for the progress bar + cancel button.
- **Anonymous fingerprint** — `Math.random().toString(36) + Date.now().toString(36)` stored in localStorage. Sent as `fingerprint` on anonymous vote.
- **Owner bypass** — Poll owner skips password gate by checking `req.user._id === poll.creator`.
- **Unlisted filtering** — Server returns all polls. Client filters: `polls.filter(p => !p.visibility || p.visibility === "public")`.
- **Embed fallback** — Non-embeddable URLs show a card with Google favicon API + "Open in new tab" link.
- **Cloudinary routing** — Middleware auto-detects mimetype and routes to image/video/raw. SVG + GIF skip resize transforms.
