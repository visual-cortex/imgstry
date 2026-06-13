---
trigger: glob
globs: 'source/kernel/**'
description: 'Patterns for source/kernel — matrix kernels and typed collections.'
applyTo: 'source/kernel/**'
---

# Kernel Guidelines

## Scope

`source/kernel/` holds convolution kernels and typed collections used by
operations.

## Kernels

- Kernels are immutable, numeric, and named.
- Provide both the kernel data and the radius / normalization metadata; do not
  recompute it at the call site.
- New kernels live in their own file under `kernel/` with a default-export
  factory or a named constant — match the existing surface, do not invent a
  new convention per file.

## Collections

- Typed collections wrap typed arrays with index-safe access helpers.
- Do not leak the underlying buffer outside the collection unless explicitly
  exposed via a method named `buffer` / `raw`.
- Mutation methods must be named such that they clearly mutate (`set`,
  `fill`, `swap`). Read-only methods return new values.

## Performance

- Kernels live in the hot path. Avoid allocations in their factories beyond
  the one-time setup.
- Prefer flat `Float32Array` / `Int32Array` over nested arrays for
  cache-friendly traversal.
