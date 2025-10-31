import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { x402Guard } from "./x402/mw";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Demo protected endpoint
app.get("/api/protected", x402Guard, (req, res) => {
  const ctx = (req as any).flux402 || {};
  res.json({ secret: "granted", at: Date.now(), verify: ctx });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`[flux402-gateway] listening on :${port}`);
});
