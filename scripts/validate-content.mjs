#!/usr/bin/env node

import { PROJECTS, LESSONS, CHALLENGES, COMPETITIVE } from "../src/content/index.js";
import { validateContent } from "../src/content/schema.js";

const { ok, errors, counts } = validateContent({ PROJECTS, LESSONS, CHALLENGES, COMPETITIVE });

console.log(
  `Validated: ${counts.projects} projects, ${counts.lessons} lessons, ` +
    `${counts.challenges} challenges, ${counts.problems} problems.`
);

if (ok) {
  console.log("All content valid.");
  process.exit(0);
}

console.error(`\n${errors.length} content item(s) failed validation:\n`);
for (const e of errors) {
  console.error(`  [${e.kind}] ${e.id}`);
  for (const issue of e.issues) {
    console.error(`      - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
}
process.exit(1);
