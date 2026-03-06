# Tech Stack

## Frontend
| Tech | Why |
|------|-----|
| **Vite** | Fast dev server, HMR, optimized builds |
| **React 18** | Component model, hooks, ecosystem |
| **TypeScript** | Type safety, better DX |
| **Tailwind v4** | Utility-first CSS, zero runtime |
| **shadcn/ui** | Accessible, customizable components (Button, Card, Input, Badge, Skeleton, etc.) |
| **Zustand** | Lightweight state management (pollStore) |
| **React Router** | Client-side routing |
| **react-markdown** | Render .md/.txt files inline |
| **Storybook** | Component development + documentation |
| **Lucide React** | Icon library |

## Backend
| Tech | Why |
|------|-----|
| **Express.js** | Simple, well-known Node framework |
| **Mongoose** | MongoDB ODM with schema validation |
| **bcrypt** | Password hashing |
| **crypto** | UUID generation for tokens + shareIds |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |

## Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database (free tier) |
| **Cloudinary** | File CDN — images, video, audio, raw files |
| **Render** | Backend hosting |
| **Vercel** (planned) | Frontend hosting |

## Dev tools
- **Vitest** — unit tests (embedUrl tests)
- **Postman** — API testing
- **Lighthouse** — performance/accessibility audits (target: 100)

## Key technical decisions
- **XHR over fetch for uploads** — fetch doesn't support upload progress events
- **Access token auth** — simple UUID tokens instead of JWT (good enough for MVP, swap to JWT later)
- **Cloudinary middleware** — auto-routes by mimetype, SVG/GIF skip resize
- **localStorage fingerprint** — anonymous voting without accounts
- **No SSR** — SPA is fine for MVP, can add later if SEO matters
