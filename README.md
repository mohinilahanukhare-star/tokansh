# TokANSH — Frontend UI

**Unlocking Real Estate, One Ansh at a Time.**

This is the **React frontend-only** repository for the TokANSH DRUNIX Hackathon 2026 MVP. The separate backend repository is responsible for Python FastAPI, Go DRUNIX integration, application persistence and chaincode. Do not add backend services or blockchain secrets here.

## Official product baseline

The source of truth is the team's [baseline documentation](https://github.com/kshewani/tokansh/tree/main/docs), especially:

- [UI_DESIGN_GUIDELINES.md](https://github.com/kshewani/tokansh/blob/main/docs/UI_DESIGN_GUIDELINES.md)
- [MVP_SCOPE.md](https://github.com/kshewani/tokansh/blob/main/docs/MVP_SCOPE.md)
- [BUSINESS_RULES.md](https://github.com/kshewani/tokansh/blob/main/docs/BUSINESS_RULES.md)
- [API_CONTRACTS.md](https://github.com/kshewani/tokansh/blob/main/docs/API_CONTRACTS.md)
- [DEMO_SCRIPT.md](https://github.com/kshewani/tokansh/blob/main/docs/DEMO_SCRIPT.md)

### Frontend stack

React 19 · TypeScript · Vite · Tailwind CSS · Radix/shadcn-style reusable UI primitives · React Router · TanStack Query · Recharts · Lucide icons.

Primary colour is deep navy **#102B4E**, action blue **#1769AA**, secondary slate blue **#607D9B**, neutral background **#F4F6F9** and white surfaces. These are TokANSH colours, **not an official Citi brand template**.

## Demo sign-in and route protection

The public frontend first presents `#/login`. Visitors must select one of the three approved demo roles (Admin/Issuer, Investor, Lender) and click **Enter demo workspace** before any workspace route is displayed.

- Workspace routes redirect to `#/login` until a demo session is selected.
- The selected role is held in React state and `sessionStorage` for the current browser tab only, so a refresh retains the selected demo account.
- **Logout** and **Logout / Switch account** clear the demo session and return to the login screen; a previously opened direct dashboard URL will be gated again.
- The header identifies the active demo role. Switching accounts uses Logout and a fresh role selection rather than an unreviewed in-app role change.

**This is only client-side demonstration navigation—not authentication or a security boundary.** Never use it to protect sensitive data. Python backend authorization is still required for real users and core ledger operations.

## What's included

- Role selector for **Admin/Issuer (Meera)**, **Investor (Aarav)** and **Lender**. This is **not real authentication**.
- Role-scoped navigation with dashboard, property registry, issuance, marketplace, portfolio, transactions, collateral, lending, rental distributions, asset intelligence, audit and system status.
- Responsive components, accessible labels, transaction review dialogs and visual status indicators.
- Scenario selector with the baseline illustrated flow: onboarding → approval → 100,000 ANSH issuance → 500 ANSH purchase → 200 ANSH pledge (300 available) → full release (500 available).
- Example entitlement: 500 / 100,000 × ₹10,00,000 = ₹5,000. This is **not a verified historical distribution**.
- API transport boundary in `src/api/transport.ts`, selected response/request types in `src/api/contracts.ts`, and React Query for checking backend system status when configured.
- A dedicated system-status page displaying dependencies independently, without assuming that API availability proves DRUNIX connectivity.

## Important: no false ledger success

**This public website is a UI preview, not a running DRUNIX-backed transaction platform.** The scenario selector displays read-only hypothetical stages; it does not simulate authoritative ownership or claim a DRUNIX commitment. No real investment, bank transfer, loan, property registration or ledger transaction can be performed until the backend is connected.

A core ANSH action must not change displayed verified ownership before the Python backend confirms the real DRUNIX commit and the resulting holdings are queried. The frontend does not create fake transaction identifiers. Backend status `SUBMITTED`, `UNKNOWN` or `RECONCILIATION_REQUIRED` must not be painted as success.

In preview mode, forms allow reviewing request fields; confirmation explains that a backend is required and changes **no** ledger state.

## Run

Install Node.js 22+ and run:

```powershell
git clone https://github.com/mohinilahanukhare-star/tokansh.git
cd tokansh
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173. To verify:

```powershell
npm.cmd test
npm.cmd run build
```

PowerShell users can use `npm.cmd` to avoid execution-policy errors.

## API integration

Create `.env.local` from `.env.example`:

```env
VITE_API_MODE=preview
VITE_API_BASE_URL=
```

When the Python API is available, configure its public HTTPS base URL and `VITE_API_MODE=real`. The system-status query then calls `GET /api/v1/system/status`. Domain API write contracts have been scaffolded but **full read and write integration is not finished**: endpoint field shapes, authenticated session handling, ledger polling and error reconciliation must be verified against the actual running backend. Changing the environment variable alone will not make a real DRUNIX workflow work.

All API calls should be proxied through Python REST; the browser must never hold DRUNIX peer credentials, private keys or connection certificates.

## GitHub Pages

The free public preview is hosted at:

**https://mohinilahanukhare-star.github.io/tokansh/**

A push to `main` runs GitHub Actions to test, build and publish the Vite site with the `/tokansh/` base path. HashRouter allows direct navigation without server-side SPA rewrites. The public deployment uses preview mode.

## Verification

`tests/scenario.test.mjs` checks baseline values and ensures preview audit records never contain fabricated DRUNIX transaction IDs or commitment evidence.

These are unit tests and build checks, not an end-to-end browser audit. The final DRUNIX demo must pass the team's backend/business-rule integration acceptance criteria.
