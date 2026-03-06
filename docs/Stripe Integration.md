# Stripe Integration

**Status:** Planned
**Priority:** Medium — need this before real launch, not for beta

## Approach: Stripe Checkout + Customer Portal

Don't build billing UI from scratch. Stripe Checkout handles payment, Stripe Portal handles subscription management. You only need:
1. A "Subscribe" button that redirects to Stripe Checkout
2. A webhook endpoint that activates the plan
3. A "Manage subscription" link to Stripe Portal

## Setup steps

### 1. Stripe account
- Create account at stripe.com
- Set up products + prices in Stripe Dashboard:
  - `pro_monthly` — 79 SEK/mo
  - `team_monthly` — 249 SEK/mo (base, 10 seats)
  - `team_seat` — 29 SEK/mo (metered, per extra seat)

### 2. Backend changes

#### New fields on User model
```javascript
// Add to User schema
stripeCustomerId: { type: String, default: "" },
plan: {
  type: String,
  enum: ["free", "pro", "team", "enterprise"],
  default: "free"
},
planExpiresAt: { type: Date, default: null },
teamSeats: { type: Number, default: 0 }
```

#### New endpoints
```
POST   /billing/checkout          # Create Stripe Checkout session
POST   /billing/portal            # Create Stripe Portal session
POST   /billing/webhook           # Stripe webhook (signature verified)
GET    /billing/status             # Current plan info
```

#### Checkout endpoint
```javascript
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/billing/checkout", authenticateUser, async (req, res) => {
  const { priceId } = req.body; // "pro_monthly" or "team_monthly"

  // Create or reuse Stripe customer
  let customerId = req.user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      metadata: { userId: req.user._id.toString() }
    });
    customerId = customer.id;
    req.user.stripeCustomerId = customerId;
    await req.user.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/settings?billing=success`,
    cancel_url: `${process.env.FRONTEND_URL}/settings?billing=cancel`,
  });

  res.json({ url: session.url });
});
```

#### Webhook endpoint
```javascript
app.post("/billing/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        // Activate plan
        break;
      case "customer.subscription.updated":
        // Plan change (upgrade/downgrade)
        break;
      case "customer.subscription.deleted":
        // Downgrade to free
        break;
      case "invoice.payment_failed":
        // Grace period / notify user
        break;
    }

    res.json({ received: true });
  }
);
```

### 3. Frontend changes

#### Pricing page
- Simple comparison table (Free vs Pro vs Team)
- "Get started" -> register (free)
- "Upgrade to Pro" -> POST `/billing/checkout` -> redirect to Stripe
- "Start Team plan" -> same flow

#### Plan gating
```typescript
// In pollStore or a separate billingStore
const canCreatePoll = user.plan !== "free" || userPollCount < 5;
const canSetPassword = user.plan !== "free";
const canInviteTeam = user.plan === "team" || user.plan === "enterprise";
```

#### Settings page
- Show current plan
- "Manage subscription" -> POST `/billing/portal` -> redirect to Stripe Portal
- Stripe Portal handles: cancel, update card, change plan, invoices

### 4. Environment variables
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAM_PRICE_ID=price_...
```

## Testing
- Use Stripe test mode (`sk_test_...`)
- Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:8080/billing/webhook`

## Dependencies
- `stripe` npm package (backend)
- No frontend Stripe SDK needed (Checkout is a redirect)
