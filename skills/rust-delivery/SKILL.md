---
name: rust-delivery
description: Rust delivery guidance for cross-compilation, target toolchains, binary compatibility, packaging, release automation, and CI distribution workflows. Use when Codex needs to choose between native cargo builds, cross, cargo-zigbuild, cargo-xwin, or dist; reason about musl vs GNU or MSVC targets; configure linkers and target triples; design release artifacts and installers; or plan a Rust release matrix and distribution pipeline.
---

# Rust Delivery

Use this skill for Rust build, packaging, and release workflows that go beyond ordinary local `cargo build`.
Keep the core instructions short and load only the reference file that matches the request.
Use `rust-master` for language-level performance and Cargo questions that do not depend on shipping binaries across targets.
Use `rust-platforms` for wasm or embedded target constraints that are primarily platform-runtime problems.

## Request Map

- target triples, `rustup target add`, linkers, `.cargo/config.toml`, `cargo build --target`, custom targets, or `-Z build-std`:
  load [references/cross-compilation.md](references/cross-compilation.md)
- `cross`, `cargo-zigbuild`, `cargo-xwin`, target-specific toolchains, containerized builds, glibc targeting, or Windows MSVC cross builds:
  load [references/target-tooling.md](references/target-tooling.md)
- `dist` or `cargo-dist`, release artifacts, installers, generated CI, GitHub Releases, or release automation:
  load [references/packaging-and-release.md](references/packaging-and-release.md)
- musl vs GNU, MSVC vs GNU, glibc compatibility, static vs dynamic linking, universal binaries, or artifact portability:
  load [references/binary-compatibility.md](references/binary-compatibility.md)
- choosing a delivery stack, release matrix, or CI workflow for Rust binaries:
  load [references/delivery-strategy.md](references/delivery-strategy.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the delivery boundary:
   - Cross-compilation basics: target triple, linker, std availability, and Cargo config
   - Target tooling: `cross`, `cargo-zigbuild`, `cargo-xwin`, native runners, and when each one wins
   - Packaging and release: `dist` artifacts, installers, generated CI, and release flow
   - Binary compatibility: libc or ABI choices, portability, and installer expectations
   - Delivery strategy: how to combine build tools and CI without accidental complexity
3. Load only the relevant reference file. If the request crosses layers, load at most two reference files.
4. Prefer official docs and project READMEs because delivery tooling changes faster than ordinary Rust syntax.
5. Structure the answer around:
   - the target or release goal
   - why the chosen delivery tool fits
   - compatibility or CI risks
   - the next concrete config, command, or pipeline change

## Core Rules

- Choose delivery tools from target constraints and release goals, not from habit.
- Start with the simplest viable build path; add heavier tooling only when target support or distribution demands it.
- Keep target-specific linker and runner configuration explicit in repo config, not in developer memory.
- Separate "can I compile it" from "can I ship and support it"; packaging, compatibility, and CI matter too.
- Native runners still win when signing, notarization, or platform-native packaging is the real bottleneck.

## Review Priorities

When auditing Rust delivery work, check these first:

- `rustup target add` used as if it installs the whole cross toolchain
- `cross test` used as if QEMU behavior is equivalent to fast native CI
- glibc, musl, or MSVC assumptions left implicit in release artifacts
- `dist` adopted before the project has a stable target and artifact matrix
- release pipelines with no clear ownership of versioning, changelog, tags, or artifact naming

## Navigation

- Load [references/cross-compilation.md](references/cross-compilation.md) for target triples, linker setup, and `build-std`.
- Load [references/target-tooling.md](references/target-tooling.md) for `cross`, `cargo-zigbuild`, and `cargo-xwin`.
- Load [references/packaging-and-release.md](references/packaging-and-release.md) for `dist`, installers, and generated CI.
- Load [references/binary-compatibility.md](references/binary-compatibility.md) for musl vs GNU, MSVC, glibc, and portability tradeoffs.
- Load [references/delivery-strategy.md](references/delivery-strategy.md) for end-to-end release planning and CI matrix decisions.

## Source Policy

- Prefer the rustup book, Cargo Book, and official project docs for `cross`, `cargo-zigbuild`, `cargo-xwin`, and `dist`.
- Use exact dates or status notes when docs or product naming changed recently, such as `dist` formerly being called `cargo-dist`.
- Separate compile-time success from supported-distribution guarantees; delivery answers should state that distinction explicitly.

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
        - cross-compilation
        - target-tooling
        - packaging-release
        - binary-compatibility
        - delivery-strategy
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
