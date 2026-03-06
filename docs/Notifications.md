# Notifications

**Status:** Planned
**Priority:** High — drives engagement + return visits

## Why

Users create a poll and leave. Without notifications, they have to manually check back. A notification bell keeps them engaged and drives return visits.

## What triggers a notification

| Event | Who gets notified | Message |
|-------|-------------------|---------|
| New vote | Poll creator | "Someone voted on 'Logo v3'" |
| Vote milestone | Poll creator | "'Logo v3' reached 10 votes" |
| New comment | Poll creator | "@mia commented on 'Logo v3'" |
| Comment reply | Comment author | "@alex replied to your comment" |
| Poll deadline approaching | Poll creator | "'Logo v3' closes in 1 hour" |
| Poll closed / deadline hit | Poll creator + voters | "'Logo v3' is closed — see results" |
| Poll remixed | Original creator | "@sam remixed 'Logo v3'" |
| Team invite | Invited user | "You were invited to team 'Design'" |

## MVP scope

### In-app notification bell
- Bell icon in header navbar (next to user avatar)
- Red badge with unread count
- Dropdown panel showing recent notifications
- Click notification -> navigate to relevant poll
- "Mark all as read" button
- Persist read/unread state in database

### UI
```
  [bell icon with red dot "3"]
       |
       v
  +----------------------------------+
  |  Notifications           [clear] |
  |----------------------------------|
  |  * @mia voted on "Logo v3"       |
  |    2 minutes ago                  |
  |----------------------------------|
  |  * "Header variants" hit 10      |
  |    votes!  —  1 hour ago          |
  |----------------------------------|
  |    @alex commented: "Love the    |
  |    contrast on option B"          |
  |    3 hours ago                    |
  |----------------------------------|
  |  [View all notifications]        |
  +----------------------------------+
```

## Data model

### Notification schema
```javascript
const notificationSchema = new mongoose.Schema({
  recipient: { type: ObjectId, ref: "User", required: true, index: true },
  type: {
    type: String,
    enum: ["vote", "vote_milestone", "comment", "comment_reply",
           "deadline", "poll_closed", "remix", "team_invite"],
    required: true
  },
  poll: { type: ObjectId, ref: "Poll" },
  comment: { type: ObjectId, ref: "Comment" },
  actor: { type: ObjectId, ref: "User" },       // who triggered it
  actorName: String,                              // denormalized for speed
  message: String,                                // pre-rendered text
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | List notifications (auth, paginated) |
| GET | `/notifications/unread-count` | Get unread count (for badge) |
| PATCH | `/notifications/:id/read` | Mark one as read |
| PATCH | `/notifications/read-all` | Mark all as read |

## Implementation plan

### Phase 1: In-app (MVP)
1. Create Notification model
2. Add notification creation logic to vote/comment/remix endpoints
3. Add GET/PATCH notification endpoints
4. Build NotificationBell component in navbar
5. Poll for unread count every 30s (or on focus)

### Phase 2: Real-time
- WebSocket (Socket.io) for instant notifications
- Push notification count to bell without polling

### Phase 3: External (post-MVP)
- Email digest (daily/weekly summary)
- Browser push notifications (Web Push API)
- [[Slack Integration]] as a full notification channel:
  - Incoming webhook: post vote/comment/close events to a Slack channel
  - Per-team and per-user settings for which events trigger Slack messages
  - Interactive Slack messages: vote directly from the notification
  - AI vote summaries auto-posted to Slack when a poll closes (via [[AI Integration]])
- Extension badge shows unread count

## Aggregation rules (avoid spam)
- Group multiple votes: "5 people voted on 'Logo v3'" instead of 5 separate notifications
- Debounce: wait 1 minute before sending vote notification (batch)
- Don't notify for own actions
- Max 1 milestone notification per threshold (10, 25, 50, 100)

## Notification channels summary

| Channel | Phase | Description |
|---------|-------|-------------|
| In-app bell | MVP | Bell icon in navbar with dropdown |
| Email digest | Phase 3 | Daily/weekly summary email |
| Browser push | Phase 3 | Web Push API notifications |
| Slack | Phase 3 | Webhook + interactive messages (see [[Slack Integration]]) |
| Browser extension | Phase 3 | Badge with unread count |
| Figma plugin | Phase 3 | Notification dot in plugin panel |

## Extension + Plugin tie-in
- Browser extension badge shows unread count
- Figma plugin shows notification dot
- Slack channel receives formatted notification cards
- All channels link back to pejla.io notification center
