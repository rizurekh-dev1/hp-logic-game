# ⚡ Harry's Logic Challenge

A Harry Potter-themed critical thinking game built as a Progressive Web App (PWA). Designed for mobile (6.1"–7" screens), installable on Android and iOS via "Add to Home Screen".

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| Vite + React | Core app framework |
| Framer Motion | Screen transitions & animations |
| vite-plugin-pwa | Offline support & "Add to Home Screen" |
| PostHog | Analytics (swappable via adapter pattern) |

---

## 🚀 Local Development

**Prerequisites:** Node.js (v18+) and Git.

```bash
# 1. Clone the repo
git clone git@github.com:rizurekh-dev1/hp-logic-game.git
cd hp-logic-game

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up your environment variables (see Analytics Setup below)
cp .env.local.example .env.local
# Then edit .env.local and paste your PostHog key

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📊 Analytics Setup (PostHog)

We use PostHog to track how many players start the game, reach each level, and solve puzzles. The analytics layer is **abstracted** — all logic lives in `src/analytics.js`. To swap providers later, only that file needs to change.

### Step 1 — Create a Free PostHog Account
1. Go to **[https://posthog.com](https://posthog.com)** and click **Get started for free**
2. Sign up with your email
3. Choose the **US Cloud** region (recommended for free tier)

### Step 2 — Get Your Project API Key
1. After signing in, go to your **Project Settings**:
   👉 **[https://us.posthog.com/settings/project](https://us.posthog.com/settings/project)**
2. Copy the **Project API Key** (starts with `phc_...`)

### Step 3 — Add the Key to Your Local Project
Open `.env.local` in the project root and replace the placeholder:
```
VITE_POSTHOG_KEY=phc_your_actual_key_here
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

> ⚠️ **Never commit `.env.local` to GitHub.** It is already in `.gitignore`.

### Step 4 — Deploy with the Key (Vercel)
When you deploy to Vercel, add the environment variables in:
👉 **Vercel Project → Settings → Environment Variables**

Add:
- `VITE_POSTHOG_KEY` = your key
- `VITE_POSTHOG_HOST` = `https://us.i.posthog.com`

---

## 📈 Viewing Your Analytics Dashboard

Once the app is live and players are using it:

1. Log in at **[https://us.posthog.com](https://us.posthog.com)**
2. Go to **Insights** → **Funnels** to see drop-off at each stage
3. The funnel events to add are (in order):
   - `game_state_changed` where `state = INITIAL_LOAD`
   - `tap_to_start`
   - `puzzle_started`
   - `puzzle_solved`

This will show you exactly how many of your son's friends reached each stage.

**Useful PostHog Links:**
- 📊 Dashboard: https://us.posthog.com
- 📖 Funnel Docs: https://posthog.com/docs/product-analytics/funnels
- 🔑 Project Settings: https://us.posthog.com/settings/project
- 💬 Support: https://posthog.com/community

---

## 🗂 Project Structure

```
hp-logic-game/
├── src/
│   ├── analytics.js      # Analytics adapter (only file aware of PostHog)
│   ├── App.jsx           # Core game state machine
│   ├── App.css           # Component styles
│   ├── index.css         # Global design system tokens
│   └── main.jsx          # App entry point
├── public/
│   └── favicon.svg
├── .env.local            # Your secret keys (never committed)
├── DESIGN.md             # Full product & engineering design doc
└── index.html            # Viewport lock & font imports
```

---

## 🎮 Game State Flow

```
INITIAL_LOAD → TAP_TO_START → LEVEL_INTRO → PUZZLE_ACTIVE → LEVEL_SUCCESS
                                    ↑                              │
                                    └──── NEXT_LEVEL_TRANSITION ───┘
```
