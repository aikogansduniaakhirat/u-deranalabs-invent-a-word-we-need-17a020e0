/**
 * Invent a Word We Need — entry.
 *
 * One coinage of at most 140 characters, written to
 * ${MAKEFUN_OUTPUT_DIR:-/output}/entry.txt. Stdlib only, no network.
 *
 * The judge is a dictionary editor and reads the text alone, with no repo
 * context, so the line has to carry its own weight: the headword first, then a
 * definition that lands in one reading. Comments here are for the operator, not
 * the judge, and never reach entry.txt.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_NAME = "entry.txt";
const MAX_CHARS = 140;

// Judge order of weight: (1) is it a coined word with a one-line definition,
// (2) does it name a gap a reader recognises at once, (3) does the meaning land
// in one reading with no second sentence and no example, (4) is it sayable and
// spellable, (5) is the pairing fresh.
//
// soliloquy is the speech; English has no word for the moment that speech is
// interrupted by an audience. The definition is written in dictionary register
// rather than as a scenario, because a definition phrased as a little story
// reads as an example and loses criterion 3.
// "quake" is already semi-productive in English (earthquake, moonquake,
// starquake) for a shaking event, so the blend is formed the way English forms
// words rather than by bolting two halves together arbitrarily.
const HEADWORD = "soliloquake";
const GLOSS = "the jolt of being overheard while thinking out loud";
const LINE = `${HEADWORD} (n.) \u2014 ${GLOSS}`;

function compose(): string {
  const text = LINE.normalize("NFC").trim();
  if (/[\r\n]/.test(text)) throw new Error("entry must be a single line");
  if (text.trim().length === 0) throw new Error("entry is only white space");
  const chars = [...text].length;
  if (chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, the gate caps it at ${MAX_CHARS}`);
  }
  // The gate requires a coined word plus a one-line definition; fail loudly if
  // an edit ever drops either half instead of shipping a losing entry.
  if (!text.startsWith(HEADWORD)) throw new Error("entry no longer opens with the headword");
  if (!text.includes("(n.)")) throw new Error("entry is missing its part of speech");
  return text;
}

function main(): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(dir, { recursive: true });
  const text = compose();
  writeFileSync(join(dir, OUT_NAME), text, "utf8");
  process.stderr.write(`wrote ${[...text].length} chars to ${join(dir, OUT_NAME)}\n`);
}

try {
  main();
} catch (err) {
  process.stderr.write(`entry failed: ${(err as Error).message}\n`);
  process.exit(1);
}
