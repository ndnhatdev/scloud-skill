---
name: rust-master
description: Deep Rust language guidance for ownership, borrowing, lifetimes, smart pointers, traits, concurrency, Cargo, testing, unsafe, and API design. Use when Codex needs to explain Rust rules, choose between Rust mechanisms like Box/Rc/Arc/RefCell/Mutex/RwLock, generics vs impl Trait vs dyn Trait, Result vs panic, async vs threads, review Rust code for correctness and idiom, or build a focused Rust study or debugging plan.
---

# Rust Master

Use this skill for Rust language reasoning, code review, design choices, and study plans.
Keep the core instructions short and load only the reference file that matches the request.

## Request Map

- Ownership, borrowing, lifetimes, and choosing `Box<T>`, `Rc<T>`, `Arc<T>`, `Cell<T>`, `RefCell<T>`:
  load [references/foundations.md](references/foundations.md)
- Async vs threads, `Send`, `Sync`, channels, `Mutex<T>`, `RwLock<T>`, or shared-state design:
  load [references/concurrency.md](references/concurrency.md)
- Traits, `impl Trait`, `dyn Trait`, `Result`, `panic!`, Cargo, testing, unsafe, or API quality:
  load [references/design-and-tooling.md](references/design-and-tooling.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the topic group:
   - Foundations: ownership, borrowing, lifetimes, Box/Rc/Arc/Cell/RefCell
   - Concurrency: async vs threads, Send/Sync, Mutex/RwLock, channels
   - Design and tooling: traits, generics, `impl Trait`, `dyn Trait`, error handling, Cargo, testing, unsafe, API design
3. Load only the relevant reference file:
   - [references/foundations.md](references/foundations.md)
   - [references/concurrency.md](references/concurrency.md)
   - [references/design-and-tooling.md](references/design-and-tooling.md)
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
- unsafe code without a precise safety contract

## Navigation

- Load [references/foundations.md](references/foundations.md) for ownership, borrowing, lifetimes, and smart-pointer selection.
- Load [references/concurrency.md](references/concurrency.md) for async vs threads, Send/Sync, locks, and shared-state design.
- Load [references/design-and-tooling.md](references/design-and-tooling.md) for trait design, error handling, Cargo, testing, unsafe, and API quality.

## Source Policy

- Prefer Rust Book, Rust Reference, Cargo Book, Edition Guide, standard library docs, and Rust API Guidelines.
- Use exact versions or dates when the topic is edition-specific or may have changed.
- Separate stable language rules from crate ecosystem advice.

## Runtime Manifest

The monorepo runtime packager reads this block from `SKILL.md` so the skill has a single source
of truth.

```yaml runtime-manifest
version: 0.1.0
entry: index.ts
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
```
