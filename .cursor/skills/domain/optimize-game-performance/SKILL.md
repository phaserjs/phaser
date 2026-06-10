---
name: optimize-game-performance
description: Profile and fix performance regressions. Use when frame time spikes, load times grow, or memory/allocations are suspect.
---

# Optimize Game Performance

## Phase 1 — Measure

1. Reproduce the slowdown (specific scene, entity count, or action).
2. Profile before changing code — frame time, draw calls, physics, script time, allocations.
3. Use engine profiler or external tools per repo docs; record baseline numbers.
4. Identify the hot path (one system or scene, not random micro-optimizations).

## Phase 2 — Fix

1. Address root cause: unnecessary per-frame work, uncached lookups, unbatched draws, physics overload.
2. Prefer algorithmic fixes (fewer updates, spatial partitioning, object pooling) over premature micro-opts.
3. Keep simulation/render separation intact (see `game-architecture` rule).
4. Re-profile after each meaningful change to confirm improvement.

## Phase 3 — Verify

1. Compare against baseline at target scene complexity.
2. Spot-check adjacent scenes for regressions.
3. Document non-obvious perf constraints in code comment or design notes if needed.

## Exit criteria

- [ ] Baseline and post-fix metrics recorded
- [ ] Hot path identified and addressed at root cause
- [ ] No new errors; gameplay behavior unchanged unless tuning was intentional

Stop when metrics meet milestone targets or diminishing returns — do not optimize cold paths.
