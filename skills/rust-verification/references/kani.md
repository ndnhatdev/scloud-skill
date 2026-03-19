# Kani

## Scope

Load this file for Kani proof harnesses, `kani::any()`, assumptions, model-checking limits, unsupported-feature boundaries, and CI usage.
Use `rust-specializations` for fuzzing and sanitizer workflows; Kani is not a fuzzing replacement.

## Core Rules

- Use Kani when you need bounded proofs about safety or correctness, especially around small critical logic or unsafe code.
- Write focused proof harnesses with explicit assumptions and explicit assertions.
- Keep the state space small enough that the verifier can finish.
- Wrap proof harnesses in `cfg(kani)` and use `cargo kani` for package-level workflow.
- Read the limitations and feature-support docs before trusting a proof on advanced or concurrent code.

## Review Checklist

- Is the proof harness small and explicit about symbolic inputs?
- Are assumptions narrowing the search space in a justified way rather than hiding bugs?
- Are loops, recursion, or input sizes bounded when needed?
- Is the team aware of unsupported or partially supported Rust features?
- Is there a CI path or repeatable local command for running the proofs?

## Senior Heuristics

- Kani is strongest on small isolated components, not whole service binaries.
- If the proof does not encode the intended invariant explicitly, a successful run may prove very little.
- Prefer multiple small proof harnesses over one giant harness that mixes unrelated claims.
- Use concrete playback or a translated regression test when Kani finds a counterexample.
- As of 2026-03-19, Kani docs still describe concurrency as out of scope; do not use it as a replacement for loom.

## Sources

- https://model-checking.github.io/kani/
- https://model-checking.github.io/kani/usage.html
- https://model-checking.github.io/kani/reference/attributes.html
- https://model-checking.github.io/kani/tutorial-nondeterministic-variables.html
- https://model-checking.github.io/kani/limitations.html
- https://model-checking.github.io/kani/rust-feature-support.html
- https://model-checking.github.io/kani/install-github-ci.html

