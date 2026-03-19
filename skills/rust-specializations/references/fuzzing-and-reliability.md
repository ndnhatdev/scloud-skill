# Fuzzing and Reliability

## Scope

Load this file for cargo-fuzz, libFuzzer workflow, structure-aware fuzzing, coverage, and sanitizer-backed bug-finding.
Use `rust-master` for Miri, general unsafe review, or non-fuzz-specific testing strategy.

## Core Rules

- Use `cargo fuzz` when you need randomized, coverage-guided exploration of an input boundary.
- Fuzz the real parsing or execution boundary, not a helper that strips away the risky part of the code.
- Treat the fuzz corpus as an evolving artifact: crashes, regressions, and minimized reproductions all matter.
- Use structure-aware fuzzing when raw bytes hide too much of the reachable state space.
- Sanitizers and fuzzing complement each other; do not confuse either with full proof of correctness.

## Review Checklist

- Does the fuzz target reach the real risky code path?
- Is the target using the right compiler or sanitizer support for the environment?
- Are found crashes being minimized and preserved as regressions?
- Is coverage being examined when the campaign stalls?
- Is the project pretending fuzzing replaces design review or ordinary testing?

## Sources

- https://rust-fuzz.github.io/book/
- https://rust-fuzz.github.io/book/cargo-fuzz.html
- https://rust-fuzz.github.io/book/cargo-fuzz/guide.html
- https://rust-fuzz.github.io/book/cargo-fuzz/coverage.html
- https://rust-fuzz.github.io/book/cargo-fuzz/structure-aware-fuzzing.html
- https://doc.rust-lang.org/stable/unstable-book/compiler-flags/sanitizer.html

