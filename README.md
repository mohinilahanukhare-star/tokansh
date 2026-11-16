# TokANSH — DRUNIX Hackathon 2026

**Unlocking Real Estate, One Ansh at a Time.**

A fractional real-estate lifecycle prototype with investor, asset manager and lender experiences.

## Status

The first runnable **synthetic demo** is packaged separately as `TokANSH_Runnable_Demo_App.zip` in the ChatGPT conversation. This GitHub branch is being prepared for source publication.

The demo uses Python standard-library HTTP APIs and dependency-free HTML/CSS/JavaScript. It is **not** the proposed React/TypeScript production frontend, and it **does not connect to a live DRUNIX network**.

## MVP scope

1. Demo login and role-based access
2. Investor dashboard
3. Explore properties and property detail
4. ANSH and external synthetic REIT portfolio
5. Trade, payment failure/retry and settlement
6. Collateral and loans
7. Asset-manager issuance and distributions
8. Lender approval and release
9. Transactions and audit
10. Optional intelligence scenarios

## Architecture

Browser UI -> Python API -> synthetic state service (to be replaced by production microservices and DRUNIX integration).

The demo must **not** be used for actual investments, loan disbursement or property transfers. Values, payment events and REIT holdings are synthetic.

## Next steps

- Commit tested application files from the runnable package.
- Validate backend API contracts and DRUNIX integration points.
- Add CI smoke tests and deploy a review environment.
- Connect the approved Python microservices and secure organization-aware authorization.

## Deployment

The self-contained demo package includes a Dockerfile, `render.yaml`, smoke tests and a Windows launcher. See its README for run instructions.
