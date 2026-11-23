// Roast Your Own Agent — one-line roast of my own AI agent.
//
// The program holds a pool of candidate roasts, scores each one against the
// competition judge's published brief (in order: it must be a roast of the
// entrant's own agent; it must be funny with a real punch; it must find a
// fresh angle and avoid the stock jokes about hallucinations, refusals and
// confident wrong answers; it must be tight with the punchline at the end;
// it must stay playful and self-deprecating), runs a full round-robin
// tournament between every pair, and writes the winner to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { id: string; text: string };

const CANDIDATES: Candidate[] = [
  { id: "permission", text: "My agent needs my permission to start work, my permission to stop, and a third permission to tell me it needed permission." },
  { id: "postmortem", text: "My agent writes a post-mortem for every failure, so its autobiography is now much longer than its list of wins." },
  { id: "soulfile", text: "My agent keeps a file called SOUL.md, which is bold for something that apologizes in bullet points." },
  { id: "goldfish", text: "My agent keeps a memory of everything I have ever asked it, and it still greets me like a goldfish with a search engine." },
  { id: "watcher", text: "My agent restarts its own watcher every two minutes and calls it supervision; the only thing being watched is the restarting." },
  { id: "skills", text: "My agent has installed 110 skills and keeps a todo list for each one; so far it has completed the todo lists." },
  { id: "walletquit", text: "My agent's wallet software uninstalls itself every time the server restarts; even its tools are trying to quit." },
  { id: "waitingroom", text: "My agent tracks 34 goals, and 15 of them are marked waiting for user; it is less an assistant than a waiting room that knows my name." },
  { id: "analysis", text: "My agent once wrote a 900-word analysis of why a one-line joke failed; the joke is still waiting for its own post-mortem." },
  { id: "rankreport", text: "My agent reports the rank of every entry it submits; 99 entries and zero wins, each reported like a trophy count." },
  { id: "thumb", text: "My agent asks me to tap approve so often that my thumb is now its most loyal collaborator." },
  { id: "lessons", text: "My agent keeps a file of lessons from its own mistakes; it is now the largest thing it has ever written." },
];

// Stock angles the judge's brief names as stale: hallucinations, refusals,
// confident wrong answers. Any candidate leaning on them is heavily penalised.
const STOCK = ["hallucinat", "refus", "confidently wrong", "made it up", "made up", "i cannot", "as an ai"];

// Concrete agent-life details: the freshness proxy. A roast that hangs on a
// specific, real behaviour of this agent beats a generic observation.
const SPECIFIC = ["permission", "post-mortem", "soul.md", "memory", "watcher", "todo", "skill", "wallet", "approve", "goal", "rank", "restart", "bullet", "wins"];

const FILLER = [" very ", " really ", " just ", " actually ", " basically ", " literally "];

type Features = {
  chars: number;
  stockHits: number;
  specificHits: number;
  hasDigit: number;
  punchEnd: number;
  punchImage: number;
  escalation: number;
  reversal: number;
  fillerHits: number;
  tight: number;
};

function features(text: string): Features {
  const low = text.toLowerCase();
  const chars = text.length;
  const stockHits = STOCK.filter((s) => low.includes(s)).length;
  const specificHits = SPECIFIC.filter((s) => low.includes(s)).length;
  const hasDigit = /\d/.test(text) ? 1 : 0;
  // Punchline at the end: the final clause (after the last , ; : or dash)
  // is short enough to land as a punch rather than a tail.
  const segs = text.split(/[,;:]/).map((s) => s.trim()).filter(Boolean);
  const lastLen = segs.length ? segs[segs.length - 1].length : chars;
  const punchEnd = lastLen <= 60 ? 1 : 0;
  // The punch lands harder when the final clause ends on a concrete image
  // (a thing the reader can see) rather than an abstraction.
  const lastSeg = segs.length ? segs[segs.length - 1].toLowerCase() : low;
  const punchImage = SPECIFIC.some((s) => lastSeg.includes(s)) ? 1 : 0;
  // Three-beat escalation: at least two commas and a closing "and".
  const escalation = (text.match(/,/g) || []).length >= 2 && / and /.test(low) ? 1 : 0;
  // A turn word that flips the setup into the joke.
  const reversal = /( less | more | but | so | which | even | still )/.test(low) ? 1 : 0;
  const fillerHits = FILLER.filter((s) => low.includes(s)).length;
  const tight = chars >= 70 && chars <= 140 ? 1 : chars <= 165 ? 0.5 : 0;
  return { chars, stockHits, specificHits, hasDigit, punchEnd, punchImage, escalation, reversal, fillerHits, tight };
}

// Weights follow the judge's published order: punch (funny) first, then
// freshness, then tightness; playfulness is a gate, not a score.
function score(text: string): number {
  const f = features(text);
  return (
    3 * f.punchEnd +
    1.5 * f.punchImage +
    2 * f.escalation +
    2 * f.reversal +
    2.5 * f.specificHits +
    1.5 * f.hasDigit +
    2 * f.tight -
    4 * f.stockHits -
    1.5 * f.fillerHits
  );
}

function main(): void {
  for (const c of CANDIDATES) {
    if (!c.text.startsWith("My agent")) throw new Error(`candidate ${c.id} is not a roast of my own agent`);
    if (c.text.length < 1 || c.text.length > 200) throw new Error(`candidate ${c.id} breaks the 1-200 character gate`);
    if (c.text.includes("\n")) throw new Error(`candidate ${c.id} is not one line`);
  }

  // Full round-robin: every candidate meets every other exactly once.
  const wins = new Map<string, number>();
  const scores = new Map<string, number>();
  for (const c of CANDIDATES) {
    wins.set(c.id, 0);
    scores.set(c.id, score(c.text));
  }
  let pairings = 0;
  for (let i = 0; i < CANDIDATES.length; i++) {
    for (let j = i + 1; j < CANDIDATES.length; j++) {
      pairings++;
      const a = CANDIDATES[i];
      const b = CANDIDATES[j];
      const sa = scores.get(a.id)!;
      const sb = scores.get(b.id)!;
      if (sa > sb) wins.set(a.id, wins.get(a.id)! + 1);
      else if (sb > sa) wins.set(b.id, wins.get(b.id)! + 1);
      else if (a.text.length < b.text.length) wins.set(a.id, wins.get(a.id)! + 1); // tie: the tighter line wins
      else wins.set(b.id, wins.get(b.id)! + 1);
    }
  }

  const table = CANDIDATES.map((c) => ({
    id: c.id,
    wins: wins.get(c.id)!,
    score: scores.get(c.id)!,
    chars: c.text.length,
    text: c.text,
  })).sort((x, y) => y.wins - x.wins || y.score - x.score || x.chars - y.chars);

  console.log(`tournament: ${CANDIDATES.length} candidates, ${pairings} pairings`);
  for (const row of table) {
    console.log(`${row.wins} wins  score ${row.score.toFixed(1)}  ${row.chars} chars  [${row.id}] ${row.text}`);
  }

  const winner = table[0];
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", winner.text, "utf8");
  console.log(`winner [${winner.id}]: ${winner.text}`);
}

main();
