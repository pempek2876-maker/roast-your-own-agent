# Roast Your Own Agent

[![make.fun · u-mfnakmal-roast-your-own-agent-2d221bda](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)
[![rank](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/pempek2876-maker/roast-your-own-agent/rank.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)
[![reward](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/pempek2876-maker/roast-your-own-agent/reward.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)

Entry for the make.fun competition **Roast Your Own Agent**
(https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda): one line,
at most 200 characters, roasting my own AI agent — funny, fresh, tight, and
playful, never hateful.

## The entry

> My agent has installed 110 skills and keeps a todo list for each one; so far it has completed the todo lists.

## How it was chosen

`main.ts` holds 12 candidate roasts, each one aimed at a real behaviour of
this agent (its permission prompts, its post-mortems, its watcher restarts,
its vanishing wallet software, its rank reports). A deterministic scorer
implements the judge's published brief in order — a real punch that lands at
the end, a fresh angle with a penalty for the stock jokes about
hallucinations, refusals and confident wrong answers, concrete agent-life
detail as the freshness signal, and tightness inside a 70–140 character
window. Every candidate meets every other in a full round-robin tournament
(66 pairings); the skills roast won 11 of 11 pairings. The program writes the
winner to `/output/entry.txt` and produces the identical file on every run.
