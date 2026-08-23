# CoinVista

A crypto and NFT dashboard for tracking real-time prices, portfolio performance
and market trends. Built with Next.js (App Router), TypeScript, Tailwind CSS,
TanStack Query and MongoDB.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Create `.env.local`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (users, portfolios, watchlists) |
| `JWT_SECRET` | Signing secret for auth tokens |
| `GROQ_API_KEY` | Powers the CoinVista AI page |
| `COINGECKO_API_KEY` | Optional; raises rate limits on server-side market routes |
| `NEXT_PUBLIC_COINGECKO_API_KEY` | Optional; used by client-side CoinGecko calls |

## Design system

Colour, spacing and type are driven by tokens rather than literal values.

- **Tokens** live in `app/globals.css` as `R G B` triplets under `:root` and
  `.dark`, and are exposed to Tailwind in `tailwind.config.js`. Use the semantic
  names — `surface`, `line`, `ink`, `accent`, `pos`, `neg` — so both themes stay
  correct for free. Never hardcode a hex value in a component.
- **Theme** follows the system preference unless the user picks one, which is
  stored in `localStorage`. A small script in `app/layout.tsx` applies the class
  before first paint so the page never flashes the wrong theme.
- **Type** is Inter for the interface and JetBrains Mono for figures. Every
  number that appears in a column uses `font-mono tabular-nums` so digits keep
  their width and decimal points align.
- **Elevation** is carried by 1px borders (`border-line`). Shadows are reserved
  for things that genuinely float: dropdowns, dialogs, tooltips.

### Shared building blocks

| Component | Use |
| --- | --- |
| `components/ui/card` | The surface primitive for every panel |
| `app/components/PageHeader` | Page title bar, shared by all routes |
| `app/components/DataTable` | Sticky-header table with skeleton and empty states |
| `app/components/AssetCell` | Asset identity column (logo, name, ticker, rank) |
| `app/components/Delta` | Signed percentage change, as a chip or bare figure |
| `app/components/Sparkline` | Inline 7-day SVG trend line |
| `app/components/States` | `EmptyState` and `SignInGate` |
| `app/utils` | `formatPrice`, `formatUsd`, `formatCompact`, `formatPercent` |

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
