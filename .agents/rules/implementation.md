---
trigger: glob
globs: '**'
description: 'General implementation approach for imgstry source code.'
applyTo: '**'
---

# Implementation Guidelines

## Before Writing Code

- Search for an existing pattern first. This codebase has conventions.
- Check `core/`, `kernel/`, `pixel/`, `utils/` for a similar helper before
  introducing a new one.
- Prefer linking to a real file as the example, not an abstract description.

## Naming Conventions

- **PascalCase**: types, interfaces, classes (rare).
- **camelCase**: functions, variables, methods, file names of helpers.
- **ALL_CAPS**: module-level constants representing fixed values (e.g.
  `MAX_CHANNELS`). Not for ordinary `const`s.
- **dot-namespacing**: `imgstry.processor.ts`, `imgstry.operation.ts` is the
  existing convention for core surfaces. Keep it.

## TypeScript Standards

- Strict mode on.
- No `any`. Narrow at boundaries; never propagate.
- Public types live next to or below the module they describe; truly shared
  types go in `source/types/`.
- Use `readonly` on input arrays / structures that ops must not mutate
  (curves, points, kernels). The pixel buffer is the exception.

## Module Layout

- One responsibility per file. If a file exceeds ~200 lines of logic without
  obvious cohesion, split it.
- Re-export public surface through the nearest `index.ts`; do not import from
  internal sub-paths across subsystems.

## Tooling

- Format: rely on the repo's existing formatter / ESLint config. Do not switch
  formatters.
- Type-check before claiming done: `npm run check`.
- Tests: `npm run test:run` (single pass). Watch mode: `npm test`.

## Performance Discipline

- Bench before optimising. Anecdotes are not data.
- A "perf" commit must include a numeric delta in the message body or the
  bench output linked from the PR.
- Do not regress benches without explicit justification (correctness fix,
  feature addition with clear win, etc.).

## Rule Frontmatter

- YAML frontmatter values use **single quotes**. Do not change `'` to `"`.
- Keep `applyTo` populated; downstream tooling (Copilot, Antigravity, Claude)
  reads it.
