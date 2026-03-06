# Pejla Backend

Express + MongoDB REST API for the Pejla platform.

## Setup

```bash
npm install
cp .env.example .env  # fill in your values
npm run dev
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Models

- **User** — username, email, hashed password, role
- **Poll** — title, description, options (image/video/audio/embed), votes, visibility, password, deadline, remix tree
- **Comment** — text, user, poll reference
- **Team** — name, members, invite codes
- **Project** — name, team, polls collection
- **Report** — flagged content for admin review

## API routes

| Area | Example endpoints |
|------|-------------------|
| Auth | `POST /users`, `POST /sessions`, `GET /users/me` |
| Polls | `GET /polls`, `POST /polls`, `PATCH /polls/:id`, `DELETE /polls/:id` |
| Voting | `POST /polls/:id/vote`, `POST /polls/:id/vote-anonymous` |
| Comments | `GET /polls/:id/comments`, `POST /polls/:id/comments` |
| Teams | `POST /teams`, `POST /teams/join`, `POST /teams/:id/invite` |
| Upload | `POST /upload` (image, video, audio via Cloudinary) |

## Tech

- **Express** — routing and middleware
- **Mongoose** — MongoDB ODM
- **bcrypt** — password hashing
- **Cloudinary + Multer** — media upload and storage
- **Babel** — ES module support
