# DesignVote

A full-stack design feedback platform where users create polls with design alternatives, vote, comment, remix, and collaborate in teams.

**Live:** [Frontend](https://designvote.netlify.app) | [Backend API](https://designvote-api.onrender.com)

## The Problem

Designers need quick, structured feedback on their work. Existing tools are either too heavyweight (Figma comments) or too generic (Google Forms). DesignVote makes it simple: upload designs, share a link, get votes.

I built this as my final project for the Technigo Fullstack JavaScript programme. It started with basic poll CRUD and grew into a platform with embeds, media upload, remix trees, teams, and anonymous voting.

## Features

- **Create polls** with images, video, audio, or embedded content (Figma, YouTube, CodePen, etc.)
- **Vote** on design alternatives with fullscreen swipe UI
- **Comment** on polls with inline discussion
- **Remix** existing polls to create variations (shown as a tree, not duplicates)
- **Teams & Projects** backend infrastructure (Figma-inspired collaboration)
- **Anonymous voting** — poll creators can allow votes without login
- **Password protection** — restrict access to specific polls
- **Poll lifecycle** — open/close polls, set deadlines, show/hide winner
- **Report system** — flag inappropriate content for admin review
- **Responsive** — works on mobile (320px) to desktop (1600px+)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router 7** — client-side navigation
- **Zustand** — global state management for polls (store)
- **Context API** — authentication state (AuthContext)
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI primitives)
- **Framer Motion** — animations
- **Sonner** — toast notifications
- **Lucide React** — icon library
- **React Dropzone** — drag-and-drop file upload
- **Storybook** — component development and testing

### Backend
- **Node.js** with **Express**
- **MongoDB** via **Mongoose**
- **bcrypt** — password hashing
- **Cloudinary** + **Multer** — image/video/audio upload
- **RESTful API** with token-based authentication

## React Hooks Used

### Standard hooks
- `useState` — local component state
- `useEffect` — side effects (data fetching, event listeners)
- `useContext` — consuming AuthContext

### React Router hooks
- `useParams` — reading URL parameters (shareId, pollId)
- `useNavigate` — programmatic navigation
- `useLocation` — reading current path (deep link login)
- `useSearchParams` — reading query params (remix flow)

### Custom hooks (outside curriculum)
- **`useDebounce(value, delay)`** — delays updates until user stops typing. Used for embed URL preview so the iframe doesn't reload on every keystroke.
- **`useMediaQuery(query)`** — tracks CSS media query state. Enables responsive logic in JavaScript (e.g. mobile vs desktop layout decisions).
- **`useAuth()`** — wraps `useContext(AuthContext)` with error boundary.

### Zustand store
- **`usePollStore()`** — global poll state with `fetchPolls`, `deletePoll`, `reset`. Used in Home and Dashboard to share poll data without prop drilling.

## External Libraries (beyond React/Express/MongoDB)

| Library | Purpose |
|---------|---------|
| **zustand** | Global state management (poll store) |
| **framer-motion** | Animations and transitions |
| **sonner** | Toast notifications |
| **lucide-react** | SVG icon components |
| **react-dropzone** | Drag-and-drop file uploads |
| **cloudinary** + **multer-storage-cloudinary** | Cloud media storage |
| **bcrypt** | Secure password hashing |
| **shadcn/ui** (radix-ui, class-variance-authority, tailwind-merge) | Accessible UI components |

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/users` | Register |
| POST | `/sessions` | Login |
| GET | `/users/me` | Get profile (auth) |
| PATCH | `/users/me` | Update profile (auth) |
| DELETE | `/users/me` | Delete account (auth) |

### Polls
| Method | Path | Description |
|--------|------|-------------|
| GET | `/polls` | List public polls |
| GET | `/polls/:shareId` | Get specific poll (password check) |
| POST | `/polls` | Create poll (auth) |
| PATCH | `/polls/:id` | Update poll (auth, owner) |
| DELETE | `/polls/:id` | Delete poll (auth, owner) |
| POST | `/polls/:id/vote` | Vote (auth) |
| POST | `/polls/:id/vote-anonymous` | Anonymous vote |
| POST | `/polls/:id/unvote` | Remove vote (auth) |
| POST | `/polls/:id/remix` | Remix poll (auth) |

### Comments
| Method | Path | Description |
|--------|------|-------------|
| GET | `/polls/:id/comments` | Get comments |
| POST | `/polls/:id/comments` | Add comment (auth) |
| DELETE | `/comments/:id` | Delete comment (auth, owner) |

### Teams & Projects
| Method | Path | Description |
|--------|------|-------------|
| POST | `/teams` | Create team (auth) |
| GET | `/teams` | Get my teams (auth) |
| POST | `/teams/join` | Join via invite code (auth) |
| POST | `/teams/:id/invite` | Invite by username (admin) |
| POST | `/teams/:teamId/projects` | Create project (auth) |
| POST | `/projects/:id/polls` | Add poll to project (auth) |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/reports` | View reports (admin) |
| PATCH | `/admin/reports/:id` | Update report status (admin) |

## Getting Started

### Backend
```bash
cd backend
npm install
# Create .env with MONGO_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:8080
npm run dev
```

### Storybook
```bash
cd frontend
npm run storybook
```

## Architecture Decisions

- **Zustand + Context API**: Zustand handles poll data (global, shared between pages), Context handles auth (needs to wrap the entire app with Provider pattern).
- **Embed URL utility**: Many sites block iframes (X-Frame-Options). The `toEmbedUrl()` utility converts known services to embed format, and shows a "open in new tab" fallback for unsupported sites.
- **Remix tree**: Remixes are hidden from the main feed (`remixedFrom: null` filter) and shown as a tree on the original poll. This prevents feed pollution.
- **Anonymous voting**: Uses a browser fingerprint stored in localStorage for duplicate prevention.
- **Media upload**: Cloudinary with dynamic `resource_type` (image/video/audio). File type detected from mimetype.

## View it live

- **Frontend:** https://designvote.netlify.app
- **Backend API:** https://designvote-api.onrender.com
