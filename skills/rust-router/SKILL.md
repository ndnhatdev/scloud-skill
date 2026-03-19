---
name: rust-router
description: Rust skill-routing guidance for choosing which Rust skills should handle a request, and in what order. Use when Codex needs to classify a Rust question across rust-master, rust-ecosystem, rust-platforms, rust-specializations, rust-verification, and rust-delivery; decide whether one or multiple Rust skills should be combined; or triage an ambiguous Rust request before deeper analysis.
---

# Rust Router

Use this skill as the intake layer for Rust requests when the right domain skill is not obvious.
Keep the core instructions short and load only the routing reference that matches the task.
The goal is to choose the smallest effective set of Rust skills, usually one primary skill plus at most one supporting skill.

## Request Map

- Choose the best Rust skill for a request, classify an ambiguous request, or map a question to one primary Rust skill:
  load [references/skill-map.md](references/skill-map.md)
- Decide whether multiple Rust skills should be combined, what order to load them in, or how to handle mixed-domain requests:
  load [references/composition-rules.md](references/composition-rules.md)

## Workflow

1. Classify the request as `route`, `review`, `debug`, `design`, or `study-plan`.
2. Detect the main Rust boundary:
   - `rust-master`: core language, diagnostics, performance, unsafe, API design
   - `rust-ecosystem`: Tokio, Serde, Axum, SQLx, Tracing, service-stack work
   - `rust-platforms`: wasm, `no_std`, Embassy, firmware, target-specific platform tooling
   - `rust-specializations`: rustc internals, fuzzing, Rust for Linux, SIMD, frontier mapping
   - `rust-verification`: proptest, loom, Kani, verification-strategy
   - `rust-delivery`: cross-compilation, target tooling, packaging, release automation
3. Pick one primary skill. Add a secondary skill only if the request truly crosses a second boundary.
4. Prefer `rust-master` as the support skill when a domain request also depends on ownership, diagnostics, unsafe, or performance reasoning.
5. Return the chosen skill set with a short explanation of why the boundary fits and why other skills were not chosen.

## Core Rules

- Do not load multiple Rust skills by default; routing exists to reduce noise, not increase it.
- Default to one primary skill whenever one boundary clearly dominates.
- Add `rust-master` as support when a domain-specific request also hinges on core language or review concerns.
- Use two non-master skills together only when the request genuinely spans two operational systems, such as ecosystem plus delivery.
- If the request is broad or unclear, route to the narrowest skill that can ask the next useful question.

## Review Priorities

When routing a Rust request, check these first:

- crate or target names that already imply a clear skill boundary
- whether the request is about language rules or about a domain toolchain
- whether the user wants implementation guidance, verification, platform behavior, or release workflow
- whether adding a second skill would clarify the answer or just duplicate context
- whether `rust-master` should support the domain skill because the hard part is still ownership, diagnostics, unsafe, or performance

## Navigation

- Load [references/skill-map.md](references/skill-map.md) for the boundary of each Rust skill.
- Load [references/composition-rules.md](references/composition-rules.md) for multi-skill rules and load order.

## Source Policy

- Treat the local Rust skills in this repo as the source of truth for routing.
- Keep routing explanations anchored to skill boundaries, not to crate popularity alone.
- Prefer deterministic routing heuristics over vague "could use anything" answers.

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
        - route-request
        - combine-skills
        - all
    goal:
      type: string
      enum:
        - route
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
