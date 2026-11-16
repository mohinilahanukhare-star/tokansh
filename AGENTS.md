# TokANSH frontend-only agent instructions

This repository contains **only a React + TypeScript + Vite UI** for TokANSH.
Do not add Python backend implementations, DRUNIX chaincode, certificates, peers, bank services, database deployment configurations or backend Docker files.

## Functionality
Keep all ten MVP views, role-aware routing, reusable visual components, responsive layout, form validation, and clear demo/provenance labeling.

## Integration
Mock workflows are *synthetic and browser-local*, never claimed to be authoritative DRUNIX state.
The Python backend will be supplied by another development workstream. Use its approved OpenAPI contract/JSON shapes instead of guessing fields.
When integrating, use \`src/api/client.ts\`, send idempotency keys on write actions, and poll final operation status before treating transfers/locks as committed.
Use secure server-side permissions. Frontend role hiding is not authorization.

## Verification
Before any changes: preserve existing UI screens and behavior.
Run \`npm run build\` and \`npm test\` when dependencies are available. Check login, trade failure/retry, pledge locking and lender release.
Never commit .env secrets or display unverified ledger status as verified.
