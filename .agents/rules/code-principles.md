---
trigger: glob
globs: '**'
description: 'Functional programming, immutability, simplicity, and function design principles.'
applyTo: '**'
---

# Code Principles

## Functional Programming

- Prefer pure functions: same input -> same output.
- Side effects live at the boundaries (platform adapters, IO, the pipeline
  runner). Math and color logic stays pure.
- **Exception: the pipeline mutates pixel buffers by contract** — this is the
  hot path. Document any mutation outside that contract with a one-line comment
  explaining why.

## Immutability

- `const` over `let` whenever possible.
- Use `map` / `filter` / `reduce` instead of mutating loops, **except** in
  per-pixel hot loops where a `for` loop over `Uint8ClampedArray` indices is
  measurably faster and idiomatic. Bench before swapping.
- Use TypeScript `readonly`: `Readonly<T>`, `ReadonlyArray<T>`.

## Early Exits

Guard clauses over nested `if`s.

```ts
function applyOp(op: Operation | null, buf: Uint8ClampedArray) {
  if (!op) return buf;
  if (op.disabled) return buf;
  if (buf.length === 0) return buf;
  return op.kernel(buf);
}
```

## Function Design

- Single responsibility per function.
- 3+ parameters -> single object parameter.
- Pass dependencies as parameters (don't reach for module-level singletons
  inside leaf functions).

**Bad**

```ts
function blur(buf, radius, sigma, channels) { /* ... */ }
```

**Good**

```ts
function blur({ buffer, radius, sigma, channels }: BlurParams) { /* ... */ }
```

## Iteration Patterns

- Use `map` / `filter` / `reduce` for collections of operations, points,
  layers.
- Use index loops for per-pixel work; comment with the rationale only if
  surprising (e.g. branchless variant chosen for SIMD-friendliness).

## Type Safety

- Strict TS; no `any`. If a foreign API leaks `any`, narrow at the boundary.
- No non-null assertions (`!`). Handle `null` / `undefined` explicitly.
- Prefer `array.at(i)` over `array[i]` when the index may be out of range.
- Buffer indexing inside known-bounds loops is fine.

## Simplicity

- Prefer the small obvious solution over the clever one.
- Three similar lines beat a premature abstraction.
- If a helper appears in 2+ places, consider lifting it to `utils/`.

## Hot-path Discipline

- Allocations in per-pixel loops are bugs. Pre-allocate LUTs and reuse them.
- Avoid object literals / closures inside per-pixel iteration.
- When in doubt, write the bench first.
