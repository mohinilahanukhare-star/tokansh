# TokANSH frontend-only development instructions

Repository boundary: **React UI code only**. Do not create or commit Python backend, DRUNIX chaincode, node certificates, private keys, blockchain infrastructure or deployment files for backend services.

Use React + TypeScript + Vite. Implement the approved 10-screen MVP with responsive, accessible components.

Use a typed API client and switchable mock/real API adapters. The Python backend APIs will be supplied separately. All network requests must go to the configured backend base URL; never call blockchain peers directly from the browser.

Enforce role-aware UI navigation and route guards, but never confuse frontend hiding with server-side authorization. Backend owns identity, permissions and ledger state.

Respect proposed API contract: money as strings, operation statuses, idempotency and simulated/committed provenance. Clearly label synthetic REITs, payment outcomes and indicative valuations.

Prioritize functional screens, forms, loading/error states and consistent navigation. Verify TypeScript build and frontend tests before merging.
