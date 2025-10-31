import { randomUUID } from "crypto";

export type Quote = {
  x402Version: "1";
  scheme: "solana:spl-transfer";
  network: string;
  mint: string;
  payTo: string;
  amount: string;
  reference: string;
  description: string;
  expiresAt: number; // unix seconds
  maxAmountRequired?: string;
  signature?: string; // optional server attestation (not implemented in MVP)
};

export function buildQuote(resource: string): Quote {
  const ttl = Number(process.env.QUOTE_TTL_SEC || 90);
  return {
    x402Version: "1",
    scheme: "solana:spl-transfer",
    network: process.env.NETWORK || "devnet",
    mint: process.env.MINT_PUBKEY || "",
    payTo: process.env.TREASURY_PUBKEY || "",
    amount: "0.01",
    reference: randomUUID(),
    description: `Access ${resource}`,
    expiresAt: Math.floor(Date.now() / 1000) + ttl
  };
}
