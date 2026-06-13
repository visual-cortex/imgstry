---
trigger: glob
globs: '**/*.{test,spec}.ts'
description: 'Testing philosophy, layout, and conventions for imgstry.'
applyTo: '**/*.{test,spec}.ts'
---

# Testing Guidelines

## Framework

Vitest in jsdom (for browser-platform tests) and Node environments. See
`vitest.config.ts`.

## File Organization

- Tests live under `test/`, grouped by surface (`test/unit/`, `test/color/`,
  `test/utils/`, etc.).
- Resources / fixtures live in `test/resources/`.
- Browser-targeted tests live alongside their browser surface (e.g.
  `test/unit/browser/imgstry.offscreen.test.ts`).

## Running Tests

```bash
npm test           # watch mode
npm run test:run   # single run
npm run coverage   # coverage report
```

## Testing Philosophy

- **Test pure functions first.** Pixel math, color conversions, splines, and
  kernels are deterministic — assert exact outputs against known fixtures.
- **Behavior, not implementation.** Don't assert on internal call sequences.
- **Reference fixtures, not snapshots.** Image fixtures live in
  `test/resources/`; compare buffers byte-by-byte (or with a small
  channel-wise tolerance when documented).
- **Platform tests run on the platform they target.** Browser bindings under
  jsdom; node bindings against the node runtime.

## Pixel Comparison

- Equality: byte-for-byte over `Uint8ClampedArray`.
- Tolerance comparisons require a justification comment naming the source of
  the tolerance (rounding mode, color-space drift, etc.) and a numeric bound.

## Conventions

- Top-level `describe` names the unit under test, optionally with a kind
  prefix: `describe('processor: pipeline', ...)`,
  `describe('color: hsv -> rgb', ...)`.
- Nested `describe` groups scenarios.
- `it` titles read as sentences starting with `'should ...'`.

## What NOT to Mock

- Do not mock typed arrays.
- Do not mock pure math helpers — call them.
- Mock only platform boundaries (canvas, worker handle, fs).
