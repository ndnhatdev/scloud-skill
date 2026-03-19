---
name: rust-master
version: 0.1.0
description: Rust specialist skill for ownership, borrowing, lifetimes, traits, async and concurrency, Cargo, testing, unsafe, and API design. Use when you need to explain Rust rules, compare Box/Rc/Arc/RefCell/Mutex/RwLock, generic vs impl Trait vs dyn Trait, Result vs panic, threads vs async, or build a focused study, debug, or design checklist for Rust code.
env_requirements: []
input_schema:
  type: object
  properties:
    topic:
      type: string
      enum:
        - overview
        - ownership
        - lifetimes
        - smart-pointers
        - traits
        - error-handling
        - async-vs-threads
        - concurrency
        - cargo
        - testing
        - unsafe
        - api-design
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
---

# rust-master runtime manifest

This file is the runtime manifest for the monorepo single-file tool architecture:

- `index.ts` contains the runtime logic that turns a Rust question into a focused report.
- `skill.md` is the manifest consumed by `scripts/packager.ts`.

The AgentSkill-standard instructions now live in:

- `SKILL.md`
- `references/foundations.md`
- `references/concurrency.md`
- `references/design-and-tooling.md`

Research baseline used to build the current skill:

- Official Rust documentation was reviewed on `2026-03-19`.
- The Rust 2024 Edition Guide page listed release version `1.85.0`.
- Stable standard library pages reviewed for this skill showed `std 1.94.0` with build date `2026-03-02`.

The runtime behavior in `index.ts` is intentionally aligned with those references and prefers:

- ownership-first reasoning
- smallest sound abstraction first
- official Rust docs over secondary summaries
- design tradeoffs with explicit failure modes
