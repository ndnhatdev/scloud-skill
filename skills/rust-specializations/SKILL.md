---
name: rust-specializations
description: Advanced Rust specialization guidance for compiler and tooling internals, fuzzing and sanitizers, Rust for Linux and kernel-driver work, SIMD or low-level intrinsics, and coverage mapping for remaining Rust frontier domains. Use when Codex needs to reason about rustc internals, MIR and query-driven compilation, cargo-fuzz and sanitizer workflow, Linux-kernel Rust constraints, std::arch and portable SIMD tradeoffs, or which advanced Rust areas still deserve separate skills.
---

# Rust Specializations

Use this skill for deep Rust verticals that sit beyond general language use, backend frameworks, or platform-target setup.
Keep the core instructions short and load only the reference file that matches the request.
For `proptest`, `loom`, Kani, or verification-strategy work, prefer the separate `rust-verification` skill if it is available.
For cross-compilation, packaging, `dist`, or Rust binary release workflow, prefer the separate `rust-delivery` skill if it is available.

## Request Map

- rustc internals, HIR or MIR, query system, compiler architecture, diagnostics internals, or compiler contribution workflow:
  load [references/compiler-and-tooling.md](references/compiler-and-tooling.md)
- `cargo fuzz`, libFuzzer, fuzz targets, structure-aware fuzzing, coverage, or sanitizer-backed reliability work:
  load [references/fuzzing-and-reliability.md](references/fuzzing-and-reliability.md)
- Rust for Linux, kernel drivers, kernel abstractions, unstable-feature policy, or low-level kernel integration:
  load [references/kernel-and-drivers.md](references/kernel-and-drivers.md)
- `std::arch`, target-feature detection, intrinsics, runtime dispatch, or `portable_simd` status:
  load [references/simd-and-intrinsics.md](references/simd-and-intrinsics.md)
- Missing Rust areas, coverage gaps, frontier domains, or deciding which Rust skill should be split next:
  load [references/coverage-and-frontiers.md](references/coverage-and-frontiers.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the specialization boundary:
   - Compiler and tooling: how rustc or compiler-like tooling actually works
   - Fuzzing and reliability: target selection, corpus, sanitizers, coverage, bug-finding workflow
   - Kernel and drivers: Rust inside Linux-kernel constraints and abstractions
   - SIMD and intrinsics: architecture-specific optimization, feature detection, and dispatch
   - Coverage and frontiers: what this Rust skill set already covers and which adjacent domains still warrant separate skills
3. Load only the relevant reference file. If the question crosses domains, load at most two reference files.
4. Prefer official primary sources over folklore because these domains change quickly.
5. Structure the answer around:
   - the specialization rule or constraint
   - why it fits the domain
   - tradeoffs and failure modes
   - a concrete next investigation path, tool, or refactor

## Core Rules

- Keep ordinary language questions in `rust-master`; use this skill when the problem depends on a specialized Rust subsystem.
- In compiler and driver work, architecture and invariants matter more than surface syntax.
- In fuzzing, the workflow and target choice matter as much as the harness.
- In kernel and intrinsics work, explicit context and platform constraints beat generic abstraction ideals.
- In SIMD and low-level optimization, measure first and keep a correct scalar fallback unless the environment is tightly controlled.

## Review Priorities

When auditing specialized Rust work, check these first:

- misunderstanding of rustc architecture, query flow, or MIR-level reasoning
- fuzzing setup that never reaches the real parsing or execution boundary
- sanitizer use that ignores target support or instrumentation limits
- kernel code that leaks unsafe or unstable assumptions out of abstraction boundaries
- intrinsics or target-feature usage without runtime dispatch, gating, or measurement

## Navigation

- Load [references/compiler-and-tooling.md](references/compiler-and-tooling.md) for rustc architecture and compiler-internals reasoning.
- Load [references/fuzzing-and-reliability.md](references/fuzzing-and-reliability.md) for cargo-fuzz, coverage, and sanitizers.
- Load [references/kernel-and-drivers.md](references/kernel-and-drivers.md) for Rust for Linux and kernel-driver constraints.
- Load [references/simd-and-intrinsics.md](references/simd-and-intrinsics.md) for intrinsics, feature detection, and SIMD tradeoffs.
- Load [references/coverage-and-frontiers.md](references/coverage-and-frontiers.md) for Rust coverage mapping, remaining frontier domains, and future skill-splitting decisions.

## Source Policy

- Prefer rustc-dev-guide, Rust Fuzz Book, Rust for Linux docs, standard library docs, and the Unstable Book.
- Use exact dates or current status notes when features are unstable or evolving.
- Separate stable library APIs from nightly-only or kernel-specific constraints.

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
        - compiler-tooling
        - fuzzing-reliability
        - kernel-drivers
        - simd-intrinsics
        - coverage-frontiers
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
