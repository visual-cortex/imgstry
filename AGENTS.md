# Always-loaded core (small, project-wide)

@.agents/rules/project.md

@.agents/rules/code-principles.md

@.agents/rules/implementation.md

@.agents/rules/testing.md

# Domain rules - load on demand

Domain-specific rules are NOT auto-imported to keep baseline context small.
Read them when the work touches the matching area. CLAUDE.md routes the
mapping; the rule files live at `.agents/rules/`:

- `core.md` - processor, pipeline, operations, layers, splines (source/core)
- `kernel.md` - convolution kernels and typed collections (source/kernel)
- `platform.md` - browser / node host bindings (source/platform)
- `utils.md` - pure math, color, helpers (source/utils)

Read with the Read tool when the task enters the domain. Re-read after long
gaps if context was compacted.
