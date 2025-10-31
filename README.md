# Flux402 Gateway (MVP)
HTTP x402 gateway for pay-per-request access. Issues quotes (402 + PRO), validates proof via Verifier, and serves protected routes.

## Quick start
```bash
cp .env.example .env   # fill TREASURY_PUBKEY and MINT_PUBKEY
npm i
npm run dev
curl -i http://localhost:8787/api/protected   # -> 402 with PRO
# then retry with X-PAYMENT base64 of {"ref":"DEMO"} if using demo verifier
```
