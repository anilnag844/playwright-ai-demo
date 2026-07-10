# playwright-ai-demo

[![CI](https://github.com/anilnag844/playwright-ai-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/anilnag844/playwright-ai-demo/actions/workflows/ci.yml)

A public, sanitized demo of the **multi-layer Playwright + TypeScript framework architecture** I build at enterprise scale — Page Object Model, custom fixtures, a shared API client, CI on GitHub Actions, and AI-assisted test generation with Claude.

> The production version of this architecture (an enterprise natural-language QE platform on AWS Bedrock + Claude + MCP servers, serving 9 digital product teams at a Fortune 500 hospitality & gaming enterprise) is proprietary. This repo demonstrates the same patterns against public demo targets, with no client code.
>
> 🌐 More context: [anilnag844.github.io](https://anilnag844.github.io) · [LinkedIn](https://www.linkedin.com/in/anilkumarnag/)

## Architecture

```
src/
├── pages/          Page Object Model — locators declared once, specs never see selectors
│   └── todo-page.ts
├── fixtures/       Custom fixtures — specs receive ready-to-use page objects & clients
│   └── test.ts
└── api/            Shared API client — status assertions + JSON parsing in one place
    └── api-client.ts
tests/
├── e2e/            UI tests against demo.playwright.dev/todomvc (chromium)
└── api/            API tests against jsonplaceholder.typicode.com
scripts/
└── generate-tests.ts   AI-assisted test generation (plain English → Playwright spec)
```

The three layers mirror what survives real-world team growth:

1. **Page objects** absorb UI churn — a selector change touches one file, not fifty specs.
2. **Fixtures** remove boilerplate — adding a page object to the framework is one line; every spec gets it for free, already navigated and ready.
3. **A shared API client** keeps specs declarative — HTTP plumbing, status assertions, and (in production) auth-token refresh and logging live in one layer.

In the enterprise version, the same layering is what lets AI-generated tests scale across many teams: the model is grounded in the framework's own page objects and fixtures, so generated specs follow the house patterns instead of inventing brittle raw selectors per team.

## Run it

```bash
npm ci
npx playwright install chromium
npm test            # everything
npm run test:e2e    # UI suite only
npm run test:api    # API suite only
npm run report      # open the HTML report
```

## AI-assisted test generation

Describe a scenario in plain English; the script feeds the framework's actual page object, fixtures, and an example spec to Claude and writes a new spec that uses them:

```bash
export ANTHROPIC_API_KEY=sk-...   # bring your own key — nothing is bundled
npm run ai:generate -- "verify a user can complete and then delete a todo"
npx playwright test tests/generated
```

This is the core idea behind natural-language test automation, reduced to ~80 lines:

- **Ground the model in the framework** — it sees real page objects, so output matches house style.
- **Generate, then review and execute** — generated specs land in `tests/generated/` for human review before joining the suite.
- **The production version goes further** — requirements validation via Jira MCP, design context via Figma MCP, AWS Bedrock for enterprise model access, traceability into Xray, and automatic execution with reporting.

## CI

Every push and PR runs type-checking and the full suite on GitHub Actions (chromium, 2 workers, retries on CI, HTML report uploaded as an artifact).

## License

MIT
