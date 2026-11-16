# TokANSH — React UI

**Unlocking Real Estate, One Ansh at a Time.** A responsive hackathon frontend for investor, asset-manager and lender experiences.

This repository is **frontend-only**. It contains no Python backend services, Hyperledger/DRUNIX network or chaincode. The backend will be provided separately.

## What is implemented?

| Page | Current state |
| --- | --- |
| Demo login / role selection | Working UI mock (not real authentication) |
| Investor dashboard | Working synthetic charts, metrics, activity |
| Explore properties and asset details | Working listings, search and details |
| My portfolio (ANSH + REIT) | Working synthetic balances |
| Trade & transfer | Working mock buy/sell, payment failure, safe retry, pledged-unit restrictions |
| Collateral & loans | Working mock pledge request and locked balances |
| Asset manager | Working synthetic issuance and distribution recording |
| Lender dashboard | Working mock approve/reject, repayment, release |
| Transactions & audit | Working event history and JSON export |
| Intelligence (optional) | Working indicative scenario controls |

**Data and transactions are simulated in your browser. Nothing here proves blockchain commit or real payments.** Roles are a UX demo and not a security control. The Python APIs will later provide authenticated roles, authoritative DRUNIX operation status, cash/payment simulations and institution-scoped data.

## Stack

React 19, TypeScript, Vite 6, Lucide icons and responsive CSS. No server code.

## Run locally

Install Node.js 22+ and npm, then:

```powershell
git clone https://github.com/mohinilahanukhare-star/tokansh.git
cd tokansh
git checkout feature/tokansh-react-ui
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173.

To build:

```powershell
npm.cmd run build
npm.cmd run preview
```

To run mock-engine tests:

```powershell
npm.cmd test
```

> In PowerShell, `npm.cmd` avoids the `npm.ps1` execution-policy issue.

## Frontend API integration

Create a local file `.env.local` (do not commit):

```env
VITE_API_MODE=mock
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

All screens currently run from the mock adapter. The centralized API transport is in `src/api/client.ts`; when the separate Python services are ready, integrate the approved v2 endpoint shapes there and in domain-specific hooks, then opt into `VITE_API_MODE=real`. Merely toggling the flag **does not** activate real integration today: the UI warns that requests still use the mock engine.

The browser must never call DRUNIX peers or hold blockchain certificates, keys or service secrets. Real write actions must be authorized by Python and show processing/COMMITTED/REJECTED states based on its operation API. Never infer ledger finality from HTTP 202 or a payment-success screen.

## Demo account roles

Select a pre-seeded Investor, Asset Manager, Lender or Admin profile at the sign-in screen. Switching accounts is intentionally a front-end-only experience.

The demo engine uses localStorage to persist synthetic transactions across refreshes. To return to seed data, clear the site's localStorage key `tokansh-demo-v2`. Data is not shared across browsers and is not a production database.

## MVP demo sequence

1. Open Investor dashboard, TechPark One and portfolio.
2. Attempt a buy with "Simulate payment failure" enabled. Verify balance unchanged.
3. Retry the failed buy once; confirm only one synthetic ownership change.
4. Request a pledge; switch to Lender and approve.
5. Return to Investor and attempt to sell more than the available unpledged ANSH units. Verify that the action is blocked.
6. Switch to Lender, confirm simulated repayment, authorize release.
7. Switch to Asset Manager and record a distribution.
8. Review Transactions & Audit for lifecycle events.
9. Explore optional valuation scenarios.

## Deploy on Vercel

Import `mohinilahanukhare-star/tokansh` into Vercel:
- Framework: **Vite**
- Root directory: **repository root**
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_MODE=mock` until Python backend integration is complete.

`vercel.json` handles SPA navigation fallback. Deployment is not yet connected or performed.

## Frontend boundaries

Only frontend code and frontend documentation belong here. No Python microservices, Go chaincode, DRUNIX peers, database credentials or actual investment processing. For real functionality, backend owners must implement the validated API contract.
