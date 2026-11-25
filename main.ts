// Pigeon Pitch, One Line — make.fun entry
// Writes the one-line elevator pitch a city pigeon gives investors for its
// startup to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// The pitch is built from named parts so every beat earns its place:
// the startup name, the business model, the ask, and the pigeon punchline.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const NAME = "We're Coolective";
const MODEL = "I turn every crumb on this block into recurring revenue";
const ASK = "seed round is open";
const PUNCH = "and I've already pooped on the term sheet";

function buildEntry(): string {
  return `${NAME}: ${MODEL} — ${ASK}, ${PUNCH}.`;
}

type GateReport = { ok: boolean; chars: number; lines: number; reason: string };

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const lines = text.split("\n").length;
  if (chars < 1 || chars > 200)
    return { ok: false, chars, lines, reason: `length ${chars} out of 1-200` };
  if (text.trim().length === 0)
    return { ok: false, chars, lines, reason: "blank" };
  if (lines !== 1)
    return { ok: false, chars, lines, reason: "not a single line" };
  return { ok: true, chars, lines, reason: "passes" };
}

function verifyWritten(path: string): { text: string; sha256: string } {
  const text = readFileSync(path, "utf8");
  return { text, sha256: createHash("sha256").update(text, "utf8").digest("hex") };
}

const ENTRY = buildEntry();
const report = validateEntry(ENTRY);
if (!report.ok) throw new Error(`gate failed: ${report.reason}`);
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
const { text, sha256 } = verifyWritten(outPath);
console.log(`gate passes: ${report.chars} characters, ${report.lines} line, sha256 ${sha256}`);
console.log(`verified: ${JSON.stringify(text)}`);
