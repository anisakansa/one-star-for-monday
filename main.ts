// One Star for Monday — make.fun entry.
// The program writes one line to output/entry.txt: a one-star review of
// Monday written as if Monday were a restaurant, 25 words or fewer.
// No wall-clock, no Date, no Math.random, no network: the output is a
// constant string, so every run is byte-identical by construction.

// The line, chosen after auditing the judge's brief (most important first):
// 1. It reads as a one-star restaurant review: it opens with the rating.
// 2. It sounds like a real diner's complaint: a table, a waiter, a bill.
// 3. The joke lands on Monday itself and no other day: you booked the
//    weekend and got seated on Monday instead, then the waiter charged
//    you five days — the bill is the whole work week. Tuesday could
//    never follow a weekend booking, so the line cannot be about any
//    other day of the week.
// 4. It is short and quotable: one breath, twenty words, no trimming.
// 5. Plain text, no hashtags, no stage directions, no explanation.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY: string =
  "One star. Booked a table for the weekend, got seated on Monday instead, and the waiter charged me five days.";

// Gate: the sealed scorer accepts UTF-8 text of 1 to 180 characters.
const MAX_CHARS: number = 180;
// The brief caps the review at 25 words.
const MAX_WORDS: number = 25;
// Pinned counts of the winning line, measured by the local runs below:
// 108 characters, 20 words, a single line with no trailing newline.
const EXPECTED_CHARS: number = 108;
const EXPECTED_WORDS: number = 20;

function countWords(text: string): number {
  const words: string[] = text.split(" ").filter(function (w: string): boolean {
    return w.length > 0;
  });
  return words.length;
}

function isPureAscii(text: string): boolean {
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) > 127) {
      return false;
    }
  }
  return true;
}

function gate(entry: string): void {
  if (entry.length < 1 || entry.length > MAX_CHARS) {
    throw new Error("gate: length out of range: " + String(entry.length));
  }
  if (entry.trim() !== entry) {
    throw new Error("gate: entry has surrounding whitespace");
  }
  if (entry.indexOf("\n") !== -1) {
    throw new Error("gate: entry is not a single line");
  }
  const words: number = countWords(entry);
  if (words < 1 || words > MAX_WORDS) {
    throw new Error("gate: word count out of range: " + String(words));
  }
  if (entry.length !== EXPECTED_CHARS) {
    throw new Error("gate: char count changed: " + String(entry.length));
  }
  if (words !== EXPECTED_WORDS) {
    throw new Error("gate: word count changed: " + String(words));
  }
  if (!isPureAscii(entry)) {
    throw new Error("gate: entry is not pure ASCII");
  }
}

function writeEntry(entry: string): void {
  // Primary target: cwd-relative output/entry.txt, the path the grader
  // scores (a repo-relative write the read-only sandbox tolerates).
  // Never dirname(fileURLToPath(import.meta.url)): the script folder is
  // read-only in the grading sandbox and that write dies with EROFS.
  const outDir: string = join(process.cwd(), "output");
  try {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
    return;
  } catch (primaryError) {
    console.log(
      "cwd-relative output write failed (" +
        (primaryError as Error).message +
        "); trying absolute /output",
    );
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", entry, "utf8");
}

function main(): void {
  gate(ENTRY);
  writeEntry(ENTRY);
  console.log("chars=" + String(ENTRY.length));
  console.log("words=" + String(countWords(ENTRY)));
  console.log("ok");
}

main();
