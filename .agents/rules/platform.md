---
trigger: glob
globs: 'source/platform/**'
description: 'Platform-specific bindings for browser and node — canvas, offscreen, worker, fs adapters.'
applyTo: 'source/platform/**'
---

# Platform Guidelines

## Scope

`source/platform/` adapts the platform-agnostic core to a host runtime.

```
platform/
  browser/   # canvas, offscreen, worker handle
  node/      # node-specific bindings
```

## Hard Rules

- **Core may not depend on platform.** Imports flow platform -> core, never
  core -> platform.
- Every platform module owns its own resources. If you create it, you destroy
  it (workers, canvases, file handles).
- Feature-detect before using a host API. Fall back gracefully (e.g. main
  thread when `Worker` is missing).

## Worker Thread

- The worker handle is typed as `Worker` — keep it tight.
- Messages crossing the boundary are structured-cloneable. Pipelines arrive
  as `Operation[]`; the worker replays them through the same processor used
  on the main thread.
- Never embed closures in messages.

## Canvas / Offscreen

- Buffer extraction goes through a thin adapter so tests can substitute
  `ImageData`-like fixtures.
- Do not reach into the DOM from inside an op — request the buffer at the
  edge, apply the pipeline, write back.

## Node Adapter

- Node binding mirrors the browser surface where it makes sense
  (`processor.from(buffer)`, etc.). Divergence in API shape is a code smell;
  keep parity.

## Tests

- Browser platform tests live next to their target and run under jsdom (see
  `test/unit/browser/`).
- Node platform tests run under the node environment.
