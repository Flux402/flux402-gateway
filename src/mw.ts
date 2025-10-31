import type { Request, Response, NextFunction } from "express";
import { buildQuote } from "./quote";

const VERIFIER_URL = process.env.VERIFIER_URL || "http://localhost:8788";

async function askVerifier(reference: string) {
  const url = `${VERIFIER_URL}/verify?ref=${encodeURIComponent(reference)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function x402Guard(req: Request, res: Response, next: NextFunction) {
  const header = req.header("X-PAYMENT");

  // No proof → return a fresh quote
  if (!header) {
    const q = buildQuote(req.path);
    return res.status(402).json(q);
  }

  // Parse opaque header (base64 of {"ref": "<uuid>"} by default)
  let ref: string | null = null;
  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    ref = String(parsed?.ref || "");
  } catch {
    return res.status(401).json({ error: "invalid_proof" });
  }
  if (!ref) return res.status(401).json({ error: "missing_reference" });

  try {
    const vr = await askVerifier(ref);
    if (vr.status === 200 && vr.data?.ok) {
      // success
      (req as any).flux402 = { reference: ref, txid: vr.data.txid };
      return next();
    }
    if (vr.status === 409) {
      return res.status(409).json({ state: "pending" });
    }
    return res.status(401).json({ error: "not_verified" });
  } catch (e) {
    return res.status(503).json({ error: "verifier_unavailable" });
  }
}
