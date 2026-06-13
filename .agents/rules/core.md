---
trigger: glob
globs: 'source/core/**'
description: 'Patterns and conventions for source/core — operations, pipeline, processor, layers, splines.'
applyTo: 'source/core/**'
---

# Core Guidelines

## Scope

`source/core/` is the heart of the engine: the processor, the pipeline runner,
operation contracts, layers, points, splines, and core types.

## Hard Rules

- **No platform code.** No `document`, `window`, `OffscreenCanvas`, `Worker`,
  `fs`. Anything that touches the host runtime belongs in
  `source/platform/`.
- **No DOM-typed imports.** If a type comes from `lib.dom.d.ts`, it stops at
  the platform boundary.
- **Pure where possible.** The pipeline runner is the only intentional
  mutator; everything else stays referentially transparent.

## Operations

- Each operation exports a factory returning an `Operation` shape (name,
  parameters, kernel/pixel function).
- Operations are data, not behavior bound to a class. Keep them serialisable
  so the worker thread can replay them.
- New operations live next to their family (point ops in `point/`, curve ops
  in `spline/`, etc.).

## Pipeline

- The runner consumes `Operation[]` and a buffer. It does not know what an
  op does — only its contract.
- Do not branch on operation names inside the runner. Add capability flags on
  the operation shape if a new behavior is needed.

## Layers

- Layers compose multiple pipelines. A layer must declare its blend mode and
  must not assume buffer ownership beyond its own scope.

## Splines & Points

- Inputs to operations; never mutated post-construction.
- Provide derived data (LUTs, sampled arrays) via pure helpers in `utils/` or
  inside `spline/` itself.

## Worker Bridge

- `imgstry.thread.ts` serialises `Operation[]` to a worker.
- New operations must round-trip cleanly. If an op carries a non-cloneable
  field (functions, class instances), redesign it before merging.
