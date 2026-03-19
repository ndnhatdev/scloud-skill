# Loom

## Scope

Load this file for `loom`-based concurrency testing: exhaustive schedule exploration, cfg-gated primitives, deterministic test design, and debugging failing interleavings.
Use `rust-master` for general `Send` and `Sync` reasoning when no loom workflow is involved.

## Core Rules

- Use loom for small concurrency cores where scheduler interleavings are the real risk.
- Tests must be fully deterministic apart from loom-controlled nondeterminism.
- Replace `std` synchronization primitives with loom equivalents under a `cfg(loom)` path.
- Keep the model small; loom is for critical synchronization logic, not entire applications.
- Use checkpoints and logging only after the model is already minimal enough to be explored.

## Review Checklist

- Does the test isolate the real concurrency boundary?
- Are all relevant primitives swapped to loom types under `cfg(loom)`?
- Is nondeterminism from RNG, time, or I/O removed or mocked?
- Is the explored state space bounded enough to finish reliably?
- Is there a path from the failing schedule back to a normal regression test?

## Senior Heuristics

- Extract the synchronization core into a tiny module before writing loom tests.
- Run loom in release mode as recommended by the docs because state-space exploration is expensive.
- A loom failure is usually evidence of a real synchronization bug or an invalid model; do not dismiss it lightly.
- If the model explodes combinatorially, shrink the state machine or reduce actor count before tweaking environment variables.
- Keep loom-specific code localized so production code does not become unreadable.

## Sources

- https://docs.rs/loom/latest/loom/
- https://docs.rs/loom/latest/loom/#writing-tests
- https://docs.rs/loom/latest/loom/#debugging-failing-tests

