/**
 * AI-assisted test generation — a minimal, sanitized example of the pattern
 * behind a natural-language QE platform: describe a scenario in plain
 * English, get a Playwright spec that uses this framework's page objects
 * and fixtures.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npm run ai:generate -- "verify a user can complete and then delete a todo"
 *
 * The production version of this pattern runs on AWS Bedrock with MCP
 * integrations (Jira for requirements traceability, Figma for design
 * context) and executes the generated specs automatically. This script
 * keeps only the core idea so it runs anywhere with an API key.
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const scenario = process.argv.slice(2).join(' ').trim();
if (!scenario) {
  console.error('Usage: npm run ai:generate -- "<scenario in plain English>"');
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY to run AI test generation. No key is bundled with this repo.');
  process.exit(1);
}

// Ground the model in the real framework: it sees the actual page object and
// fixtures, so generated specs use them instead of inventing raw selectors.
const frameworkContext = [
  ['src/pages/todo-page.ts', readFileSync(join(root, 'src/pages/todo-page.ts'), 'utf8')],
  ['src/fixtures/test.ts', readFileSync(join(root, 'src/fixtures/test.ts'), 'utf8')],
  ['tests/e2e/todo.spec.ts', readFileSync(join(root, 'tests/e2e/todo.spec.ts'), 'utf8')],
]
  .map(([path, content]) => `// ${path}\n${content}`)
  .join('\n\n');

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-opus-4-8',
  max_tokens: 16000,
  system:
    'You generate Playwright tests for an existing TypeScript framework. ' +
    'Use only the page objects, fixtures, and assertion patterns shown in the provided framework files. ' +
    'Respond with a single complete .spec.ts file and nothing else — no markdown fences, no commentary.',
  messages: [
    {
      role: 'user',
      content: `Framework files:\n\n${frameworkContext}\n\nGenerate a Playwright spec for this scenario: ${scenario}`,
    },
  ],
});

const block = response.content.find((b) => b.type === 'text');
if (!block) {
  console.error('Model did not return a spec. Stop reason:', response.stop_reason);
  process.exit(1);
}

const outDir = join(root, 'tests', 'generated');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `generated-${Date.now()}.spec.ts`);
writeFileSync(outFile, block.text.trim() + '\n');

console.log(`Generated spec written to ${outFile}`);
console.log('Review it, then run: npx playwright test tests/generated');
