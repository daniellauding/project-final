# API Reference

Base URL: `https://api.pejla.io` (production) / `http://localhost:8080` (dev)

Auth: Send `Authorization: <accessToken>` header for authenticated endpoints.

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users` | No | Register (username, email, password) |
| POST | `/sessions` | No | Login (email, password) -> returns token |
| GET | `/users/me` | Yes | Get current user profile |

## Polls

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/polls` | No | List all polls (returns public + unlisted) |
| GET | `/polls/:shareId` | No* | Get single poll by shareId (*password required if set) |
| POST | `/polls` | Yes | Create poll |
| PATCH | `/polls/:id` | Yes | Update poll (owner only) |
| DELETE | `/polls/:id` | Yes | Delete poll (owner only) |
| POST | `/polls/:id/vote` | Yes | Vote on an option |
| POST | `/polls/:id/vote-anonymous` | No | Anonymous vote (fingerprint in body) |
| POST | `/polls/:id/unvote` | Yes | Remove vote |
| POST | `/polls/:id/remix` | Yes | Fork a poll |

## Files

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/upload` | Yes | Upload file to Cloudinary |

## Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/polls/:id/comments` | No | List comments for a poll |
| POST | `/polls/:id/comments` | Yes | Add comment |
| DELETE | `/comments/:id` | Yes | Delete comment (owner only) |

## Reports (admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reports` | Yes | Report a poll or comment |
| GET | `/admin/reports` | Admin | View all reports |
| PATCH | `/admin/reports/:id` | Admin | Update report status |

## Poll create body example
```json
{
  "title": "Which logo variant?",
  "description": "Choosing between 3 directions",
  "options": [
    { "label": "Option A", "imageUrl": "https://res.cloudinary.com/..." },
    { "label": "Option B", "imageUrl": "https://res.cloudinary.com/..." }
  ],
  "visibility": "public",
  "allowAnonymousVotes": true,
  "allowRemix": true
}
```
