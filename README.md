# gAIns

gAIns is a small money-management app for South African households. Users choose an income range, dependant count, and living condition, then receive a percentage budget split and three practical tips from a server-side OpenRouter call.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://127.0.0.1:3000
```

3. Run the app:

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

## Checks

```bash
npm run lint
npm run build
npm audit
```
