# Routinely

A routine tracker built to handle **complex, domain-specific tracking** that generic habit apps can't model — balance-based obligations, hierarchical progress, and multi-state logging — alongside ordinary habits and tasks.

**Live:** [myroutinely.vercel.app](https://myroutinely.vercel.app/)

## Why I built it

Two reasons. First, a personal need: my daily routine includes things no off-the-shelf tracker models correctly. Second, as an engineering exercise: most habit apps only handle "did X today, yes/no." I wanted to build a tracking engine that handles harder shapes of data:

- **Debt-balance tracking** — miss an obligation and it accrues to a balance that must be paid back later; the balance stays consistent no matter which client writes to it (enforced by a Postgres trigger, not client code). Implemented here for missed (qaza) prayers.
- **Hierarchical progress tracking** — long-running goals measured against a structured corpus, down to individual line items, with daily review cycles. Implemented here for Quran memorization (hifz) across all 114 surahs.
- **Multi-state logging** — completions that aren't boolean: on-time / late / missed, each feeding stats differently.

Prayers and hifz are the first domains because they're mine — but the underlying patterns (balances, hierarchies, multi-state) generalize to anything: workout debt, course progress, spaced repetition.

## Features

- **Habits** — daily/weekly/custom recurrence, one-tap completion, streaks
- **Daily tasks** — lightweight day-to-day task list
- **Prayer tracker** — 5 daily logs with on-time/late/missed status; missed prayers feed an auto-synced qaza balance
- **Hifz tracker** — Sabq/Sabqi/Manzil daily cycle, per-surah and per-line progress
- **Stats** — consistency charts, streaks, completion rates (Recharts)
- **Auth** — email/password with signup, login, password reset (Supabase Auth)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui, dark mode via next-themes |
| Forms/validation | react-hook-form + Zod |
| Backend | Supabase (Postgres + Auth) |
| Charts | Recharts |

## Architecture notes

- **Database-first design.** The schema lives in 12 versioned SQL migrations (`supabase/migrations/`) — enums, tables, seed data, functions, triggers — so the whole backend is reproducible from scratch.
- **Row Level Security everywhere.** Every user-data table is protected by RLS (32 policies); the client only ever sees its own rows. No trust placed in application code.
- **Integrity lives in the database.** Balance syncing is a Postgres trigger (`sync_qaza_balance`), so state can't drift regardless of which client writes the log. Profile creation is handled by an auth trigger.
- **Route groups** separate the `(auth)` and `(dashboard)` shells cleanly in the App Router.

## Built with AI, designed by me

Most of the code was written with Claude Code. The parts that required a human: the data model (how balance-based and hierarchical tracking are represented), the decision to enforce integrity with RLS and DB triggers rather than client logic, the feature scope, and review of everything that shipped. I treat AI as a very fast pair programmer — the design decisions and the accountability are mine.

## Running locally

```bash
git clone https://github.com/chmAli/routinely.git
cd routinely
npm install

# Set up Supabase
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# Apply migrations in supabase/migrations/ to your Supabase project (in order)

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- Generalize the balance and hierarchy engines so users can define their own complex trackers
- Reminders
- Notifications
- Ability to create custom complex Trackers
