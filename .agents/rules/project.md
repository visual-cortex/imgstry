---
trigger: glob
globs: '**'
description: 'Core project overview, structure, architecture, and tooling for imgstry. Applies to all files.'
applyTo: '**'
---

# Project Guidelines

## Tech Stack

- TypeScript (strict mode), targeting both browser and Node.
- Vite for dev/build, Vitest for tests, ESLint for linting.
- `Uint8ClampedArray` is the canonical pixel buffer.
- Bench harness in `bench/`.

## Project Structure

```
source/
  core/
    imgstry.editor.ts        # high-level editor facade
    imgstry.operation.ts     # operation contracts
    imgstry.processor.ts     # pipeline orchestrator
    imgstry.thread.ts        # worker-thread bridge
    layer/                   # layer composition
    pipeline/                # pipeline runner
    point/                   # point/curve types
    spline/                  # spline interpolation
    types/                   # shared core types
  kernel/                    # matrix kernels + typed collections
  pixel/                     # pixel-level primitives
  platform/
    browser/                 # canvas, offscreen, worker bindings
    node/                    # node-side bindings
  types/                     # public type exports
  utils/                     # pure math/color helpers
  index.ts                   # public entry
test/                        # vitest specs grouped by surface
bench/                       # benchmark runners
declarations/                # generated .d.ts (do not edit)
```

## Architecture Patterns

### `core/` is platform-agnostic
Core code references only typed arrays and pure math. No `document`, no
`window`, no `fs`. Environment-specific work goes through `platform/`.

### Pipeline operates by mutation
Operations mutate the pixel buffer in place. The processor owns the buffer
lifecycle. Callers needing immutability clone upstream.

### Operations declare their contract
Every op exports a typed factory + a `Operation` shape (name, args, kernel or
pixel function). Do not bypass the contract with ad-hoc closures.

### Worker offloading is opt-in
`imgstry.thread.ts` routes a pipeline through a Web Worker when the host
supports it. The same `Operation[]` runs identically on main thread or worker.

### Splines and points are value types
`spline/` and `point/` produce immutable curve descriptors. They are inputs to
operations, never mutated post-construction.

## Commit Standards

Follow [Conventional Commits](https://www.conventionalcommits.org/).

- Types: `feat`, `fix`, `perf`, `refactor`, `test`, `chore`, `docs`, `build`, `ci`.
- Scope often matches subsystem: `feat(core):`, `perf(spline,color):`,
  `fix(worker):`.
- Breaking changes use the `!` marker:
  `perf(processor)!: rewrite batch around a typed-array LUT pipeline`.

## Tooling

- **Test**: `npm test` (Vitest watch) / `npm run test:run` (single run).
- **Lint**: `npm run lint`, autofix via `npm run lint:fix`.
- **Type-check**: `npm run check`.
- **Build**: `npm run build` (Vite library mode).
- **Bench**: see `bench/` runners; do not regress without justification.
