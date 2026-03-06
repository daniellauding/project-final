# Pejla Frontend

React + TypeScript SPA for the Pejla platform.

## Setup

```bash
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run storybook` | Start Storybook |

## Project structure

```
src/
  api/          — API client (polls, auth)
  assets/       — static assets
  components/   — reusable components (Header, Comments, AuthModal)
  components/ui — shadcn/ui primitives (Button, Card, Input, etc.)
  context/      — AuthContext (login state)
  hooks/        — custom hooks (useDebounce, useMediaQuery)
  pages/        — route pages (Home, Dashboard, CreatePoll, VotePoll, etc.)
  stores/       — Zustand store (pollStore)
  utils/        — utilities (embedUrl parser)
```

## Key pages

- **Home** — public poll feed with search
- **Dashboard** — logged-in user's poll management
- **CreatePoll** — form with media upload, embed URLs
- **VotePoll** — fullscreen swipe carousel for voting
- **Results** — vote breakdown with progress bars
- **Profile** — user stats, polls list, account settings

## Tech

- **React 18** + TypeScript
- **React Router 7** — client-side routing
- **Zustand** — global poll state
- **Tailwind CSS 4** + **shadcn/ui** — styling and UI components
- **Framer Motion** — animations
- **Vitest** — unit testing
- **Storybook** — component development
