---
trigger: glob
globs: 'source/utils/**'
description: 'Conventions for source/utils — pure math, color, and helper functions.'
applyTo: 'source/utils/**'
---

# Utils Guidelines

## Scope

`source/utils/` holds pure helpers: math, color-space conversions, clamping,
interpolation primitives.

## Hard Rules

- **Pure.** No side effects. No DOM. No mutation of inputs.
- One responsibility per file. Name the file after the export.
- No platform-specific imports.

## Color Conversions

- Input ranges are documented at the function level (0–255, 0–1, 0–360).
- Round-trip conversions (e.g. `rgb -> hsv -> rgb`) must converge within a
  documented tolerance.

## Clamping & Sampling

- Clamp helpers return the clamped value; they never throw on out-of-range
  input.
- Sampling helpers assume sorted inputs unless documented otherwise.

## Imports

- Utils may not import from `core/`, `platform/`, or `kernel/`. They are
  leaves.
- Re-exports flow up through `index.ts` only when a helper is part of the
  public surface.
