# Premium proposal, checked against the actual content

The proposal argues Compilearn risks reading as "AI slop" and puts three fixes in Phase 1: gate the auto-lesson cron, finish the humanize pass, and audit or cut the weakest lessons. I measured all three against the repo before planning any work. Two are already done and the third does not find what it expected.

## What the content actually looks like

Parsed every module in all four tracks and read the lesson objects directly, rather than grepping, because a naive grep conflates lesson bodies with one-line quiz rationales.

| Track | Lessons | Median explanation | Shortest | With a coding challenge |
|---|---|---|---|---|
| AI Track | 177 | 2,786 chars | 1,905 | 177 of 177 |
| AI Projects | 183 | 2,562 chars | 1,574 | 176 of 183 |
| AP CSP | 56 | 1,839 chars | 1,250 | 56 of 56 |
| AP CSA | 88 | 1,754 chars | 1,490 | 88 of 88 |

504 lessons. **Not one is under 900 characters.** 497 of 504 carry a coding challenge whose reference solution passes its own test cases, enforced in CI by `verify-solutions`.

## Phase 1, item by item

**Gate the auto-lesson cron: already done.** Both content-expansion routines are disabled. Nothing has shipped unreviewed lessons to production since they were turned off. This was the proposal's biggest liability and it is closed.

**Finish the humanize pass: effectively done.** Across all 504 lessons: 0 em dashes, 4 curly quotes, 0 instances of "delve", 0 "in today's world", 0 "it's not just X, it's Y", 1 "powerful tool", 23 uses of crucial/vital/essential. That last number is 1 per 22 lessons, which is normal technical prose, not a tell.

**Audit and cut the weakest lessons: there is no thin tail to cut.** The shortest lesson in the entire catalog is 1,250 characters and every track's 10th percentile sits above 1,400. If there is a quality problem it is not length or missing exercises, and cutting by any length threshold would remove nothing.

## What the measurement did find

**Six duplicated lessons between the AI Track and AI Projects.** Module `ai-04` and product `prod-08` teach the same four topics under the same titles, plus two more pairs:

| Title | Appears as |
|---|---|
| The model has amnesia | `ai-04-l1`, `prod-08-1` |
| Giving the bot a personality | `ai-04-l2`, `prod-08-2` |
| The context window fills up | `ai-04-l3`, `prod-08-4` |
| Streaming the reply | `ai-04-l4`, `prod-08-6` |
| Why LLMs make things up | `ai-01-l4`, `ai-07-l1` |
| LLM-as-judge | `ai-08-l4`, `prod-21-5` |

This is the concrete form of the proposal's "breadth signals generation" worry. A learner who does both tracks hits the same lesson twice, which reads as machine-generated volume in a way no amount of polish hides. Two more pairs (`variables and assignment`, `linear search`) span CSP and CSA, where repetition across two different exams is defensible.

## What this changes about the plan

Phase 1 as written is mostly complete, so spending days on it would be redundant work on an already-closed problem. The remaining Phase 1 value is the dedupe above and the homepage wedge, which is a positioning decision rather than a content one.

Recommended reordering:

1. **Resolve the six duplicate lessons.** Decide per pair whether the AI Track or AI Projects owns the topic, and have the other reference it instead of restating it. Small, mechanical, and it removes the strongest structural slop signal actually present.
2. **Go to Phase 2, the wedge.** The attack-and-defend mechanic is the differentiator and it is the only item here that no competitor can copy quickly. That is where effort converts into something defensible.
3. **Treat the "is this slop" test as a periodic check, not a project.** The proposal's own test, land on a random lesson and judge it, is worth running against a sample. Nothing in the measurements suggests it will fail.

## What I could not measure

Whether the lessons are *good*, as opposed to substantial. Length, challenge coverage, and the absence of AI tells all say the content is not padded filler, but none of them say a lesson is correct, well-sequenced, or opinionated. That judgment needs a human reading a sample, and it is the one part of Phase 1 worth actually doing.

The distribution question is untouched here and remains the real bottleneck the proposal identifies. No amount of content work substitutes for it.
