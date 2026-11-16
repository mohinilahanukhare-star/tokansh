# TokANSH — frontend-only coding rules

This GitHub repository is **React UI only**. Do not add Python microservices, Go gateway, DRUNIX chaincode, ledger containers, internal databases, credentials, private keys or certificates.

## Baseline documentation

Before changing functionality, review the official team's documents at https://github.com/kshewani/tokansh/tree/main/docs, especially UI_DESIGN_GUIDELINES.md, MVP_SCOPE.md, BUSINESS_RULES.md, API_CONTRACTS.md, DOMAIN_MODEL.md, DECISIONS.md, DEMO_SCRIPT.md.

Those backend/API contracts supersede earlier speculative endpoint lists.

## UI stack and design

- React + TypeScript + Vite; Tailwind CSS; Radix/shadcn-style UI components; React Router; TanStack Query; Recharts; Lucide.
- Deep navy #102B4E, financial blue #1769AA, slate blue #607D9B, light neutral backgrounds and white cards.
- Do not copy Citi logos or brand marks. Reserve green for *actual confirmed success*.
- Maintain accessible labels, keyboard focus, form validation, review dialogs, empty/error/loading/unknown states, responsive tables and clear values with INR Indian grouping.
- Separate page components, shared UI primitives, typed API transport and pure illustration fixtures.

## Truthfulness and security

- Frontend role switch is not authentication; backend must enforce role and organizational permissions.
- No browser-direct DRUNIX calls. Never fabricate committed transactions, ledger transaction IDs, bank approvals or payment confirmations.
- Core ANSH issuance, transfer, pledge and release require actual DRUNIX commitment. Preview scenario selection does **not** update authoritative holdings.
- Payment simulation, lending, valuation, REIT data and payout simulation must be explicitly labeled.
- Always distinguish application status from ledger status, use idempotency keys and safe reconciliation, and do not blindly retry ambiguous ledger outcomes.

## Demo acceptance

TechPark One: ₹100 crore valuation, 100,000 ANSH, ₹10,000 per ANSH. Purchase 500 → pledge 200 → available 300 → repayment and release → available 500. Record-date entitlement example ₹5,000 on ₹10,00,000 total distribution.

Run `npm test` and `npm run build` on every pull request. Keep the site hosted on GitHub Pages in preview mode until real APIs and DRUNIX are verified.
