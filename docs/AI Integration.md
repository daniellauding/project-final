# AI Integration

**Status:** Planned
**Priority:** Medium — differentiator that makes Pejla smarter than a simple poll tool

## Why

Design feedback is hard to synthesize. After 30 people vote, reading through comments and making sense of patterns is tedious. AI can turn raw votes + comments into actionable insights in seconds.

## Integration approach

All AI features use the **Claude API** (Anthropic). Claude is strong at nuanced analysis, structured reasoning, and creative suggestions — perfect for design feedback.

### API setup
```javascript
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
```

---

## MVP: AI Vote Summary

**The simplest, highest-value feature.** After a poll gets enough votes/comments, generate a one-paragraph summary.

### What it does
Takes all votes, comments, and vote patterns and produces:

> "Team leans toward Option A (53% of votes). Commenters highlight the clean typography and balanced whitespace. Option B has a vocal minority who prefer its bolder color palette. The main concern with Option A is that the logo mark may not scale well at small sizes. Recommendation: go with Option A but test the logo mark at 16x16."

### How it works
```javascript
const summary = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 500,
  messages: [{
    role: "user",
    content: `Summarize this design poll for the creator.

Poll: "${poll.title}"
Options: ${poll.options.map(o => `${o.label}: ${o.votes} votes`).join(", ")}
Comments: ${comments.map(c => `@${c.author}: "${c.text}"`).join("\n")}

Write a concise summary (2-3 sentences) of:
1. Which option is winning and why
2. Key themes from comments
3. Any concerns raised
Tone: professional, direct, actionable.`
  }]
});
```

### Trigger
- Manual: "Summarize votes" button on poll results page
- Auto: generate when poll closes or hits 10+ votes

### UI
```
+------------------------------------------+
|  AI Summary                    [refresh]  |
|------------------------------------------|
|  Team leans toward Option A (53%).        |
|  Commenters highlight the clean           |
|  typography. Main concern: logo mark      |
|  may not scale at small sizes.            |
+------------------------------------------+
```

### API endpoint
| Method | Path | Description |
|--------|------|-------------|
| POST | `/polls/:id/ai-summary` | Generate/refresh AI summary |

---

## Phase 2: AI-Assisted Poll Creation

### AI-generated poll suggestions
Upload a design brief or describe a project, and AI suggests poll options:

**Input:** "We're redesigning our checkout flow. Need feedback on button placement."

**Output:**
> "Based on your brief, here are 3 poll directions you could create:
> 1. Button position: top vs bottom vs sticky footer
> 2. Button style: primary filled vs outline vs ghost
> 3. CTA copy: 'Buy now' vs 'Add to cart' vs 'Continue'"

### AI brief generator
Upload a design image and get a structured feedback brief:

**Input:** Upload screenshot of a landing page

**Output:**
> "Feedback brief for Landing Page v2:
> - Layout: hero section with left-aligned text, right image
> - Color: blue primary, white background
> - Suggested feedback areas: headline clarity, CTA visibility, image relevance, mobile layout
> - Suggested poll: 'Which headline resonates more?' with 3 variants"

---

## Future Features

### Smart tagging
Auto-categorize polls based on content analysis:
- UI design
- Branding / logo
- Motion / animation
- Audio / sound design
- Typography
- Color palette
- Layout / spacing
- Illustration
- Icon design

Tags help with discovery, filtering, and analytics ("What does your team vote on most?").

### AI comparison
Side-by-side analysis of design options. AI describes differences between options:

> "Option A vs Option B:
> - A uses a serif typeface, B uses sans-serif
> - A has more whitespace around the CTA
> - B has higher contrast ratio (better for accessibility)
> - A feels more premium/editorial, B feels more modern/tech"

### Accessibility checker
AI scans uploaded design images for a11y issues:
- Color contrast ratio estimation
- Text size readability
- Touch target size (mobile)
- Missing alt text suggestions
- Color blindness simulation insights

Returns a quick score + actionable fixes:

> "A11y quick check:
> - Contrast: body text on background may not meet WCAG AA (estimated 3.8:1, need 4.5:1)
> - CTA button looks small for mobile (estimate < 44px tap target)
> - Suggestion: increase button padding, darken body text"

### AI comment insights
Beyond vote summary, analyze comment sentiment and themes:
- Positive/negative/neutral sentiment per option
- Recurring keywords and themes
- Disagreement detection ("Team is split on color choice")
- Suggested follow-up polls based on unresolved debates

---

## Data model

### AI summary storage
```javascript
const aiSummarySchema = new mongoose.Schema({
  poll: { type: ObjectId, ref: "Poll", required: true, index: true },
  summary: { type: String, required: true },
  model: { type: String, default: "claude-sonnet-4-20250514" },
  votesAtGeneration: Number,    // snapshot so we know when to refresh
  commentsAtGeneration: Number,
  tokens: Number,               // track usage
  createdAt: { type: Date, default: Date.now }
});
```

## Cost management
- Cache summaries — only regenerate when votes/comments change significantly
- Use `claude-sonnet-4-20250514` (fast + cheap) for summaries, `claude-opus-4-20250514` for deeper analysis
- Rate limit: max 1 AI call per poll per 5 minutes
- Free tier: 3 AI summaries/month. Pro: unlimited. Team: unlimited + AI comparison
- Track token usage per user for billing

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/polls/:id/ai-summary` | Generate vote summary |
| POST | `/polls/:id/ai-compare` | Compare options (Phase 2) |
| POST | `/ai/brief` | Generate feedback brief from image |
| POST | `/ai/suggest-poll` | Suggest poll from text prompt |
| POST | `/ai/a11y-check` | Accessibility check on image |

## Ties into

- [[Slack Integration]] — AI summaries can be auto-posted to Slack when a poll closes
- [[Figma Plugin]] — "AI Brief" button in plugin to generate feedback questions
- [[Browser Extension]] — Show AI summary in extension popup for quick review
- [[Notifications]] — Notify poll creator when AI summary is ready
- [[Beta Launch Plan]] — AI features in roadmap as future differentiator
