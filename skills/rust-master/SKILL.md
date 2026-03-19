---
name: rust-master
description: Deep Rust language and production guidance for ownership, borrowing, lifetimes, diagnostics, idioms, performance, tooling, smart pointers, traits, advanced type-system features, macros, pinning, FFI, no_std, concurrency, Cargo, testing, unsafe, and API design. Use when Codex needs to explain Rust rules, choose between Box/Rc/Arc/RefCell/Mutex/RwLock, generics vs impl Trait vs dyn Trait, GATs/HRTBs/const generics, macro_rules vs proc macros, Pin/Unpin, repr(C), Result vs panic, async vs threads, interpret borrow-checker and type-system compiler errors, review Rust code for correctness, idiom, and performance, or build a focused Rust debugging, optimization, or study plan.
---

# Rust Master

Use this skill for Rust language reasoning, code review, design choices, and study plans.
Keep the core instructions short and load only the reference file that matches the request.
For Tokio, Serde, Axum, SQLx, or Tracing crate-level guidance, prefer the separate `rust-ecosystem` skill if it is available.
For wasm, embedded `no_std`, Embassy, or firmware-platform guidance, prefer the separate `rust-platforms` skill if it is available.
For compiler internals, fuzzing, Rust for Linux, or SIMD or intrinsics work, prefer the separate `rust-specializations` skill if it is available.

## Request Map

- Ownership, borrowing, lifetimes, and choosing `Box<T>`, `Rc<T>`, `Arc<T>`, `Cell<T>`, `RefCell<T>`:
  load [references/foundations.md](references/foundations.md)
- Async vs threads, `Send`, `Sync`, channels, `Mutex<T>`, `RwLock<T>`, or shared-state design:
  load [references/concurrency.md](references/concurrency.md)
- Traits, `impl Trait`, `dyn Trait`, `Result`, `panic!`, Cargo, testing, unsafe, or API quality:
  load [references/design-and-tooling.md](references/design-and-tooling.md)
- Associated types, GATs, HRTBs, const generics, or advanced generic API design:
  load [references/advanced-type-system.md](references/advanced-type-system.md)
- Borrow-checker errors, type mismatches, trait-bound errors, object safety, coherence, `Send`/`Sync`, or compiler diagnostic workflow:
  load [references/diagnostics-and-type-errors.md](references/diagnostics-and-type-errors.md)
- `macro_rules!`, declarative macros, proc macros, derive macros, attribute macros, or compile-time code generation:
  load [references/macros-and-metaprogramming.md](references/macros-and-metaprogramming.md)
- `Pin`, `Unpin`, `Future::poll`, `extern "C"`, `repr(C)`, layout, `CStr`/`CString`, or `no_std`:
  load [references/systems-interop.md](references/systems-interop.md)
- Syntax, idioms, iterator style, pattern matching, collection APIs, and common refactor shapes:
  load [references/syntax-and-idioms.md](references/syntax-and-idioms.md)
- Profiling, performance tuning, codegen and binary-size tradeoffs, or Rust validation tools and CI checks:
  load [references/performance-and-validation.md](references/performance-and-validation.md)
- Community heuristics, classic Rust mistakes, forum-learned tradeoffs, or "what seniors usually do here":
  load [references/community-lessons.md](references/community-lessons.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the topic group:
   - Foundations: ownership, borrowing, lifetimes, Box/Rc/Arc/Cell/RefCell
   - Concurrency: async vs threads, Send/Sync, Mutex/RwLock, channels
   - Design and tooling: traits, generics, `impl Trait`, `dyn Trait`, error handling, Cargo, testing, unsafe, API design
   - Advanced type system: associated types, GATs, HRTBs, const generics, and higher-order generic API constraints
   - Diagnostics and type errors: borrow checker, inference, mismatched types, trait bounds, object safety, coherence, method resolution, `Send`/`Sync`
   - Macros and metaprogramming: `macro_rules!`, proc macros, derives, and compile-time syntax generation
   - Systems and interop: pinning, FFI, ABI/layout, `repr` attributes, and `no_std`
   - Syntax and idioms: expression-oriented control flow, iterators, entry APIs, conversions, newtypes, enum vs trait object
   - Performance and validation: release-vs-debug, profiling, allocation and binary size, `cargo fmt`/`clippy`/`miri`/`nextest`/coverage/dependency hygiene
   - Community lessons: recurring anti-patterns and ecosystem-tested heuristics
3. Load only the relevant reference file. If the task mixes correctness plus performance or tooling, load at most one rule file and one operational file:
   - [references/foundations.md](references/foundations.md)
   - [references/concurrency.md](references/concurrency.md)
   - [references/design-and-tooling.md](references/design-and-tooling.md)
   - [references/advanced-type-system.md](references/advanced-type-system.md)
   - [references/diagnostics-and-type-errors.md](references/diagnostics-and-type-errors.md)
   - [references/macros-and-metaprogramming.md](references/macros-and-metaprogramming.md)
   - [references/systems-interop.md](references/systems-interop.md)
   - [references/syntax-and-idioms.md](references/syntax-and-idioms.md)
   - [references/performance-and-validation.md](references/performance-and-validation.md)
   - [references/community-lessons.md](references/community-lessons.md)
4. Prefer official Rust project documentation. If the answer may have changed, verify with current official docs before answering.
5. Structure the answer around:
   - the decision or rule
   - why it fits
   - tradeoffs and failure modes
   - a concrete next step, example, or refactor direction

## Core Rules

- Model ownership before reaching for concurrency primitives, interior mutability, or unsafe code.
- Prefer the smallest sound abstraction first: borrow, own, smart pointer, runtime borrow check, then unsafe.
- Reject `clone()`, `RefCell<T>`, `Arc<Mutex<T>>`, and `unsafe` as default fixes. Use them only after the ownership model is clear.
- Review Rust code for soundness and behavior first, not style first.
- For library guidance, favor standard traits, clear contracts, object-safe traits when useful, additive Cargo features, and panic-free handling of normal invalid input.

## Review Priorities

When auditing Rust code, check these first:

- invalid ownership flow, lifetime confusion, or unnecessary cloning
- `Rc<T>` or `RefCell<T>` used across thread boundaries
- lock guards held across `.await`
- `panic!` or `unwrap()` in library paths where callers should recover
- object-safety, coherence, or trait-bound mistakes
- misuse of GATs, HRTBs, const generics, or type-level cleverness where a simpler API would be clearer
- recurring compiler diagnostics such as E0277, E0282/E0283, E0308, E0382, E0499, E0502, E0507, E0597, E0599, or non-`Send` futures
- macro expansion, proc-macro behavior, or generated-code debugging handled without `cargo expand` or clear span diagnostics
- unsound pinning, FFI boundaries, invalid layout assumptions, or accidental `std` assumptions in code meant for `no_std`
- non-idiomatic signatures, iterator misuse, or unnecessary allocations hidden behind "borrow checker fixes"
- performance claims without release-mode measurement or profiling evidence
- missing validation coverage for feature matrices, semver, unsafe code, or dependency hygiene
- unsafe code without a precise safety contract

## Navigation

- Load [references/foundations.md](references/foundations.md) for ownership, borrowing, lifetimes, and smart-pointer selection.
- Load [references/concurrency.md](references/concurrency.md) for async vs threads, Send/Sync, locks, and shared-state design.
- Load [references/design-and-tooling.md](references/design-and-tooling.md) for trait design, error handling, Cargo, testing, unsafe, and API quality.
- Load [references/advanced-type-system.md](references/advanced-type-system.md) for associated types, GATs, HRTBs, and const-generics choices.
- Load [references/diagnostics-and-type-errors.md](references/diagnostics-and-type-errors.md) for compiler-error triage, type-system failures, borrow-checker failures, and trait-bound debugging.
- Load [references/macros-and-metaprogramming.md](references/macros-and-metaprogramming.md) for macro design, proc-macro tradeoffs, and expansion debugging.
- Load [references/systems-interop.md](references/systems-interop.md) for pinning, FFI, layout, ABI, and `no_std` boundaries.
- Load [references/syntax-and-idioms.md](references/syntax-and-idioms.md) for idiomatic signatures, iterator style, pattern matching, collection APIs, and refactor patterns.
- Load [references/performance-and-validation.md](references/performance-and-validation.md) for profiling workflow, performance heuristics, and tool-based validation.
- Load [references/community-lessons.md](references/community-lessons.md) for community-tested heuristics, anti-patterns, and tradeoffs that recur in real Rust codebases.

## Source Policy

- Prefer Rust Book, Rust Reference, Cargo Book, Edition Guide, standard library docs, and Rust API Guidelines.
- Prefer the official Rust error index and `rustc --explain` for compiler error interpretation.
- Prefer Rustonomicon and the Embedded Rust Book for unsafe, layout, FFI, pinning, and `no_std` guidance that the Book only covers lightly.
- Use exact versions or dates when the topic is edition-specific or may have changed.
- Separate stable language rules from crate ecosystem advice.
- Use Tokio, Clippy, Miri, Criterion, and tool project docs for operational guidance.
- Use forum and community threads as heuristics and failure-pattern evidence, not as substitutes for language rules.

## Runtime Manifest

The monorepo runtime packager reads this block from `SKILL.md` so the skill has a single source
of truth.

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
        - ownership
        - lifetimes
        - smart-pointers
        - traits
        - advanced-type-system
        - error-handling
        - async-vs-threads
        - concurrency
        - diagnostics
        - macros
        - systems-interop
        - cargo
        - testing
        - unsafe
        - api-design
        - syntax-idioms
        - performance
        - tooling-validation
        - community-lessons
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
