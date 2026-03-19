---
name: rust-verification
description: Rust verification guidance for property-based testing with proptest, concurrency model checking with loom, formal verification with Kani, and choosing the right verification layer. Use when Codex needs to design or review property tests, shrinking strategies, loom-based interleaving checks, Kani proof harnesses, verification limits, or decide between unit tests, proptest, fuzzing, loom, and Kani in Rust.
---

# Rust Verification

Use this skill for Rust verification workflows that go beyond ordinary unit tests.
Keep the core instructions short and load only the reference file that matches the request.
Use `rust-master` for ordinary testing, diagnostics, or unsafe guidance that does not depend on specialized verification tools.
Use `rust-specializations` for fuzzing-specific workflows and sanitizer-backed bug hunting.

## Request Map

- `proptest`, property testing, shrinking, strategies, generators, arbitrary structured inputs, or turning invariants into tests:
  load [references/proptest.md](references/proptest.md)
- `loom`, deterministic concurrency testing, interleavings, `RUSTFLAGS="--cfg loom"`, or concurrency bug reproduction:
  load [references/loom.md](references/loom.md)
- Kani, `#[kani::proof]`, `kani::any()`, assumptions, proof harnesses, formal verification, unsupported-feature limits, or CI for Kani:
  load [references/kani.md](references/kani.md)
- Choosing between unit tests, regression tests, proptest, fuzzing, loom, and Kani:
  load [references/verification-strategy.md](references/verification-strategy.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the verification boundary:
   - Proptest: arbitrary structured inputs and shrinking around functional invariants
   - Loom: exhaustive schedule exploration for small deterministic concurrent cores
   - Kani: bounded proof harnesses and model checking for safety or correctness claims
   - Verification strategy: choosing the right layer and combining tools sanely
3. Load only the relevant reference file. If the question crosses layers, load at most two reference files.
4. Prefer primary docs because these tools have real operational limits and environment constraints.
5. Structure the answer around:
   - the verification goal
   - why the chosen tool fits
   - modeling limits and failure modes
   - the next concrete harness, refactor, or CI step

## Core Rules

- Pick the verification tool from the bug model, not from popularity.
- Keep the system under test small enough that the tool can explore it meaningfully.
- Shrinking quality, determinism, and assumptions are part of the test design, not cleanup work.
- Convert findings from proptest, loom, fuzzing, or Kani into ordinary regression tests when possible.
- Do not force one verification tool to solve a problem that belongs to a different layer.

## Review Priorities

When auditing verification-heavy Rust work, check these first:

- properties that are too vague or too weak to catch real regressions
- proptest strategies that generate invalid or irrelevant inputs and then filter too much
- loom tests that still depend on ordinary `std` concurrency primitives or nondeterministic system behavior
- Kani proof harnesses with missing assumptions, unbounded state, or unsupported-feature blind spots
- no clear handoff from generated or proven failures into normal regression coverage

## Navigation

- Load [references/proptest.md](references/proptest.md) for strategy design, shrinking, and property-testing heuristics.
- Load [references/loom.md](references/loom.md) for deterministic concurrency testing and schedule exploration.
- Load [references/kani.md](references/kani.md) for proof harnesses, symbolic inputs, limitations, and CI usage.
- Load [references/verification-strategy.md](references/verification-strategy.md) for tool selection and layered verification planning.

## Source Policy

- Prefer the Proptest Book, docs.rs for `proptest` and `loom`, and the official Kani book and reference.
- Use exact dates or status notes when discussing Kani support and limitations because it is under active development.
- Separate fuzzing and sanitizer workflows from verification workflows; they complement each other but are not interchangeable.

## Runtime Manifest

```yaml runtime-manifest
version: 0.1.0
entry: scripts/index.ts
env_requirements: []
input_schema:
  type: object
  properties:
    topic:
      type: string
      enum:
        - overview
        - proptest
        - loom
        - kani
        - verification-strategy
        - all
    goal:
      type: string
      enum:
        - learn
        - choose
        - review
        - debug
        - design
        - study-plan
    question:
      type: string
    constraints:
      type: string
    depth:
      type: string
      enum:
        - quick
        - standard
        - deep
  additionalProperties: false
```
