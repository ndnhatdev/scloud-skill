---
name: rust-platforms
description: Rust platform guidance for WebAssembly, embedded no_std, Embassy async embedded, platform tooling, community lessons, and firmware architecture. Use when Codex needs to design or review wasm32 targets, wasm-bindgen interop, wasm testing and size work, no_std embedded crates, interrupts, linker and memory layout concerns, Embassy tasks and executors, probe-rs or defmt workflow, or end-to-end embedded firmware structure in Rust.
---

# Rust Platforms

Use this skill for Rust platform-specific guidance beyond general language rules.
Keep the core instructions short and load only the reference file that matches the request.
Treat `wasm`, `embedded/no_std`, and `embassy` as focused subdomains inside this one packaged skill rather than duplicated standalone skills.

## Request Map

- `wasm32`, `wasm-bindgen`, `wasm-pack`, JS interop, browser or Node targets, wasm tests, or wasm binary size:
  load [references/wasm.md](references/wasm.md)
- `#![no_std]`, embedded targets, linker scripts, interrupts, PAC/HAL/BSP layering, memory-mapped registers, or critical sections:
  load [references/embedded-no-std.md](references/embedded-no-std.md)
- Embassy executor, tasks, spawners, timers, channels, signals, async embedded patterns, or interrupt-driven async firmware:
  load [references/embassy.md](references/embassy.md)
- Integrated firmware shape using no_std + HAL/PAC + Embassy + logging/flash workflow:
  load [references/firmware-stack.md](references/firmware-stack.md)
- `wasm-pack`, `wasm-bindgen-test`, `wasm-opt`, `twiggy`, `probe-rs`, `defmt`, embedded flashing/debugging, or target-specific validation:
  load [references/tooling-and-debugging.md](references/tooling-and-debugging.md)
- Community heuristics, forum-tested anti-patterns, or "what usually goes wrong" in wasm or embedded Rust:
  load [references/platform-lessons.md](references/platform-lessons.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the platform boundary:
   - Wasm: target triple, JS interop, environment limits, testing, size
   - Embedded no_std: runtime absence, interrupts, critical sections, memory layout, linker and startup
   - Embassy: async executor model, task spawning, timer and sync primitives, ISR integration
   - Firmware stack: app structure, task ownership, board support, flashing, logging, and integration tests
   - Tooling and debugging: wasm tests, size work, probe-based flashing, logging, and target validation
   - Platform lessons: recurring forum and ecosystem mistakes that do not show up in the happy-path docs
3. Load only the relevant reference file. If the question crosses layers, load at most two reference files.
4. Prefer official project docs and book-style primary sources.
5. Structure the answer around:
   - the platform constraint or rule
   - why it fits the target environment
   - tradeoffs and failure modes
   - a concrete next refactor, command, or architecture shape

## Core Rules

- Keep general ownership, traits, diagnostics, and unsafe reasoning in `rust-master`; use this skill for platform-specific constraints and ecosystems.
- On wasm, design around the target environment first: async I/O, JS interop, and size constraints matter more than native assumptions.
- In `no_std`, treat runtime absence, linker layout, and interrupt concurrency as first-class design constraints.
- In Embassy, do not block the executor; async tasks must yield cooperatively.
- In embedded firmware, make startup, resource ownership, interrupts, executor use, and flashing/debug workflow explicit.
- Validate on the real target path early; native tests and host builds do not prove wasm or firmware behavior.

## Review Priorities

When auditing platform-focused Rust code, check these first:

- native assumptions leaking into wasm such as sync I/O, threads, or unsupported target behavior
- hidden `std` dependencies or allocator assumptions in code claiming `no_std`
- unsafe interrupt sharing, overly broad critical sections, or unclear memory-layout assumptions
- Embassy tasks that block, misuse spawners, or hide resource ownership
- firmware with no clear bootstrap order, task ownership model, logging plan, or deployment path
- missing target-specific tooling such as wasm-target tests, probe-based run/attach flow, or embedded logging and panic strategy
- community-known traps such as `cfg_attr(not(test), no_std)`, overusing global critical sections, or assuming all wasm targets behave the same

## Navigation

- Load [references/wasm.md](references/wasm.md) for wasm targets, interop, testing, and size tradeoffs.
- Load [references/embedded-no-std.md](references/embedded-no-std.md) for no_std, interrupts, linker layout, and embedded structure.
- Load [references/embassy.md](references/embassy.md) for Embassy executor, tasks, timers, and async embedded coordination.
- Load [references/firmware-stack.md](references/firmware-stack.md) for integrated firmware architecture.
- Load [references/tooling-and-debugging.md](references/tooling-and-debugging.md) for platform-specific testing, flashing, logging, and size/debug workflow.
- Load [references/platform-lessons.md](references/platform-lessons.md) for community heuristics and anti-patterns.

## Source Policy

- Prefer the Rust and WebAssembly docs, wasm-bindgen guide, Embedded Rust Book, Embedonomicon, Embassy Book, and official docs.rs pages for Embassy crates.
- Use official tool docs for `wasm-pack`, `probe-rs`, and `defmt` when operational workflow matters.
- Use community threads as heuristics and failure-pattern evidence, not as substitutes for platform contracts.
- Use exact dates when crate or target behavior may have changed.
- Separate target constraints from ordinary Rust-language constraints; route general language reasoning back to `rust-master`.

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
        - wasm
        - embedded-no-std
        - embassy
        - firmware-stack
        - tooling-debugging
        - platform-lessons
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
