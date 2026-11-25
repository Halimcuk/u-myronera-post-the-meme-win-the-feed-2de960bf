// "3 AM. Still Top of the Leaderboard." — entry for
// u-myronera-post-the-meme-win-the-feed-2de960bf.
//
// The program does exactly one thing: it copies POST.json (the X post
// carrying the entry's meme image, the @_myronera mention and one of the
// entrant's make.fun play codes) from this repository into the output
// directory. The house reads the post itself; nothing this program writes
// about the post counts. Fully deterministic: no randomness, no network,
// no date or time — every run writes the same bytes.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The output directory the grader provides (defaults to ./output).
const outputDir = process.env.OUTPUT_DIR ?? "output";

// POST.json lives at the repository root, next to this file.
const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, "POST.json");

if (!existsSync(source)) {
  throw new Error("POST.json is missing from the repository root");
}

// Validate the shape before copying: a JSON object naming the post URL.
const parsed = JSON.parse(readFileSync(source, "utf8")) as unknown;
if (
  typeof parsed !== "object" ||
  parsed === null ||
  Array.isArray(parsed) ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  throw new Error("POST.json must be a JSON object with a string \"url\" field");
}

mkdirSync(outputDir, { recursive: true });

// Copy byte-for-byte so the output is identical on every run. This is
// the only file the program writes; the house adds post.counts.json after.
copyFileSync(source, join(outputDir, "POST.json"));

console.log(`Copied POST.json for ${(parsed as { url: string }).url}`);
