# TokANSH — UI Frontend Only

**Unlocking Real Estate, One Ansh at a Time.**

This repository is exclusively for the **React + TypeScript + Vite frontend** for the TokANSH DRUNIX Hackathon MVP. The Python backend microservices and DRUNIX network are separately owned and maintained; they must **not** be committed to this repository.

## Planned MVP screens
1. Login with demo roles
2. Investor dashboard
3. Explore properties and details
4. Portfolio: ANSH plus separately labeled synthetic REIT holdings
5. Trading and transfer, including failure/retry and settlement states
6. Collateral and loans
7. Asset Manager: issuance and distributions
8. Lender dashboard: decisions and authorized release
9. Transactions and audit trail
10. Intelligence scenarios (optional)

## Frontend architecture

- React, TypeScript, Vite
- Role-aware routing, shared UI components and typed API client
- Deterministic **mock API adapter** during development
- Production API adapter for separately supplied Python REST services
- API base URL configured with `VITE_API_BASE_URL`
- No direct browser access to DRUNIX peers, keys, chaincode or certificates

## Status

The React frontend has **not been implemented yet** in this branch. Earlier Python-served demo files were a separate exploratory prototype and are not part of this frontend repository.

## Integration rules

Use the approved API contract for field names, enums and error envelopes. Actual DRUNIX ledger status must come from the Python backend; mock responses must be visibly labeled simulated. Do not imply property title transfer, real lender payment or live REIT trades.
