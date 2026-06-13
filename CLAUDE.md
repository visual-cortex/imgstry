Before implementing anything, identify which domain you are working in and
read the corresponding rule file from `.agents/rules/` (only the core rules
auto-load via AGENTS.md; domain rules load on demand):

- Processor, pipeline, operations, layers, splines (`source/core/**`): read
  core.md
- Convolution kernels and typed collections (`source/kernel/**`): read
  kernel.md
- Browser / node host bindings (`source/platform/**`): read platform.md
- Pure math, color, helpers (`source/utils/**`): read utils.md
- Tests (`test/**`, `*.test.ts`, `*.spec.ts`): testing.md (already loaded as
  core)
- All other source code: project.md, code-principles.md, implementation.md
  (always-on baseline, already loaded as core).

@AGENTS.md
