# Binary Compatibility

## Scope

Load this file for libc, ABI, and portability tradeoffs: musl vs GNU, MSVC vs GNU on Windows, glibc floor selection, and why "it built" does not yet mean "it is broadly runnable."

## Core Rules

- Choose the binary compatibility story deliberately; do not let the build host decide it by accident.
- Use musl when self-contained Linux artifacts are a real requirement and dependencies allow it.
- Use GNU libc targets when that matches your deployment environment and you can state the glibc support floor clearly.
- Prefer Windows MSVC targets for mainstream Windows distribution unless you have a specific reason to prefer GNU.
- Avoid pretending static glibc is a standard easy path; it comes with real toolchain limits.

## Review Checklist

- Is the intended libc or ABI obvious from the target list?
- If using GNU libc, is the minimum supported glibc version stated or enforced?
- Is musl chosen for a real support reason, not only because "static sounds simpler"?
- Are macOS or Windows artifacts relying on platform-native steps that cross-only pipelines cannot finish?
- Does the release documentation match the actual compatibility promises?

## Senior Heuristics

- For Linux CLI distribution, musl can simplify support, but native dependencies and runtime behavior still need testing.
- `cargo-zigbuild` is useful when you need a lower glibc floor without building on an ancient distro.
- If you need one macOS artifact for both Intel and Apple Silicon, make that an explicit packaging decision, not an afterthought.
- Prefer explicit support statements over vague "Linux x64" release labels.
- Compatibility is part of product support; if you cannot test it, be conservative about promising it.

## Sources

- https://github.com/rust-cross/cargo-zigbuild
- https://github.com/rust-cross/cargo-xwin
- https://github.com/cross-rs/cross

