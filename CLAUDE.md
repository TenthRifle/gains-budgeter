# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## Environment

Copy `.env.local.example` to `.env.local` and set:
- `OPENROUTER_API_KEY` — required, must start with `sk-or-`
- `OPENROUTER_MODEL` — optional, defaults to `openai/gpt-4o-mini`
- `OPENROUTER_SITE_URL` — optional, sent to OpenRouter for attribution

## Architecture

Single-page app with one API route. All source lives under `app/`.

**`app/page.tsx`** — the entire frontend. One file containing: the 4-step state machine (`step` 1–3 = form, step 4 = output/loading/error), all UI components (`StepOne`–`StepThree`, `LoadingState`, `OutputScreen`, `BudgetBreakdown`, `AdviceCards`), and the `INCOME_BOUNDS` map used to convert percentages into rand ranges for display.

**`app/api/budget/route.ts`** — the only API endpoint (`POST /api/budget`). Flow:
1. Validates request body against enum constants
2. Calls OpenRouter with a JSON schema `response_format` that forces 4 fields: `food_pct`, `housing_pct`, `transport_pct`, `savings_pct`, plus 3 `advice` strings
3. `normaliseBudgetResponse` redistributes `savings_pct` into food, then for `R4k-R10k` income shifts up to 5% from housing into food, then rounds and corrects to exactly 100%

**Key invariant:** the model is always asked for 4 budget buckets summing to 100; the client only ever sees 3 (savings is absorbed server-side). If the normalised result doesn't pass `isBudgetResponse` (total !== 100), the route returns a 502.

## Enums shared between client and server

`INCOME_RANGES`, `LIVING_CONDITIONS`, and `DEPENDANTS` are defined in both `page.tsx` and `route.ts` — keep them in sync if you change them.
