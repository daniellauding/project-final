# Slack Integration

**Status:** Planned
**Priority:** High — teams already discuss designs in Slack, meet them there

## Why

Design feedback conversations already happen in Slack. Messages like "which version do you prefer?" get buried in threads. Pejla's Slack integration turns those conversations into structured polls — without leaving Slack.

## MVP scope (Incoming Webhook)

The simplest version: post poll results to a Slack channel via incoming webhook.

### Setup flow
1. User goes to Pejla settings -> Integrations -> Slack
2. Clicks "Add to Slack" (incoming webhook OAuth)
3. Selects a channel (e.g. `#design-feedback`)
4. Pejla stores the webhook URL per user/team

### What gets posted

When a poll closes or hits a vote milestone, Pejla sends a formatted message:

```
+------------------------------------------+
|  Pejla: "Logo v3" results                |
|------------------------------------------|
|  Option A: ████████░░ 8 votes (53%)      |
|  Option B: █████░░░░░ 5 votes (33%)      |
|  Option C: ██░░░░░░░░ 2 votes (13%)      |
|                                           |
|  15 total votes - 4 comments             |
|  [View full results on Pejla]            |
+------------------------------------------+
```

### Webhook notifications
| Event | Slack message |
|-------|--------------|
| Vote received | "New vote on 'Logo v3' - Option A is leading (8 votes)" |
| Vote milestone | "'Logo v3' reached 25 votes!" |
| Poll closed | Results summary card (see above) |
| New comment | "@mia commented on 'Logo v3': 'Top left feels heavy'" |

### Technical approach (MVP)
```javascript
// In vote/comment endpoints, after saving:
const webhook = await SlackWebhook.findOne({ team: poll.team });
if (webhook) {
  await fetch(webhook.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: buildSlackBlocks(poll, event)
    })
  });
}
```

### Data model
```javascript
const slackWebhookSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User", required: true },
  team: { type: ObjectId, ref: "Team" },
  webhookUrl: { type: String, required: true },
  channel: String,
  channelId: String,
  events: {
    vote: { type: Boolean, default: true },
    voteMilestone: { type: Boolean, default: true },
    pollClosed: { type: Boolean, default: true },
    comment: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});
```

---

## Phase 2: Full Slack App

### Slash commands

#### `/pejla create`
Create a poll directly from Slack.

```
/pejla create "Which logo?" option1.png option2.png option3.png
```

Opens a Slack modal:
```
+----------------------------------+
|  Create Pejla Poll               |
|----------------------------------|
|  Title: [Which logo?]            |
|                                  |
|  Options:                        |
|  1. [Upload or paste URL]        |
|  2. [Upload or paste URL]        |
|  [+ Add option]                  |
|                                  |
|  Settings:                       |
|  [ ] Anonymous voting            |
|  [ ] Set deadline                |
|  Channel: #design-feedback       |
|                                  |
|  [Create]  [Cancel]              |
+----------------------------------+
```

After creation, posts an interactive card to the channel with vote buttons.

#### `/pejla results [shareId]`
Show poll results inline in Slack.

```
/pejla results abc123
```

Returns an ephemeral message (only visible to you) with the current vote breakdown.

### Interactive voting
When a poll is posted to Slack, team members can vote with buttons — no need to open pejla.io:

```
+------------------------------------------+
|  Logo v3 - Vote now!                      |
|  by @daniel                               |
|------------------------------------------|
|  [image thumbnails]                       |
|                                           |
|  [Vote A]  [Vote B]  [Vote C]            |
|                                           |
|  3 votes so far  |  View on Pejla        |
+------------------------------------------+
```

### Message action: "Create Pejla poll from this thread"
- Right-click a Slack message -> "Create Pejla poll"
- Extracts images/links from the thread
- Pre-fills poll options from attachments
- Great for turning messy threads into structured votes

### Link unfurling
When someone pastes a `pejla.io/poll/abc123` link in Slack, it unfurls into a rich preview card:

```
+------------------------------------------+
|  pejla.io                                 |
|  Logo v3 - Design Vote                    |
|  [thumbnail]  8 votes | 4 comments        |
|               Option A leading (53%)      |
|               [Vote now]                  |
+------------------------------------------+
```

### OAuth2 flow
1. User clicks "Add to Slack" on pejla.io
2. Redirects to Slack OAuth: `https://slack.com/oauth/v2/authorize?scope=commands,chat:write,links:read,links:write&client_id=...`
3. User approves, Slack redirects back with code
4. Pejla exchanges code for access token
5. Store token + team info in database

### Required Slack scopes
| Scope | Why |
|-------|-----|
| `commands` | Slash commands `/pejla` |
| `chat:write` | Post messages to channels |
| `links:read` | Detect pejla.io links for unfurling |
| `links:write` | Post unfurl cards |
| `incoming-webhook` | MVP webhook posting |
| `users:read` | Map Slack users to Pejla users |

## API endpoints needed

| Method | Path | Description |
|--------|------|-------------|
| GET | `/integrations/slack/install` | Start OAuth2 flow |
| GET | `/integrations/slack/callback` | OAuth2 callback |
| POST | `/integrations/slack/commands` | Slash command handler |
| POST | `/integrations/slack/interactions` | Button clicks, modal submissions |
| POST | `/integrations/slack/events` | Event subscriptions (link unfurling) |
| DELETE | `/integrations/slack` | Disconnect Slack |

## Ties into

- [[Notifications]] — Slack becomes a notification channel alongside in-app and email
- [[Figma Plugin]] — Plugin can show which Slack channel a poll was posted to
- [[Browser Extension]] — Extension can send results to a connected Slack channel
- [[Beta Launch Plan]] — Slack integration is a launch differentiator for design teams
- [[AI Integration]] — AI vote summaries can be posted to Slack automatically
