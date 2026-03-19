# Performance and Validation

## Scope

Load this file for profiling workflow, performance heuristics, binary-size and compile-time investigation, and the Rust toolchain used to validate correctness beyond `cargo test`.
See also [syntax-and-idioms.md](syntax-and-idioms.md) for clarity-first idioms that often fix unnecessary allocation and control-flow churn.
See also [community-lessons.md](community-lessons.md) for heuristics from real-world debugging and performance threads.
See also [diagnostics-and-type-errors.md](diagnostics-and-type-errors.md) for compiler-error triage and `cargo check` or diagnostic JSON workflow.
See also [macros-and-metaprogramming.md](macros-and-metaprogramming.md) when compile times or generated code are driven by macro expansion.

## Performance Workflow

- Measure in release mode before optimizing. Debug builds are not a performance baseline.
- Start with workload classification: CPU-bound, allocation-heavy, latency-sensitive, fan-out I/O, or binary-size constrained.
- Profile before rewriting code. The biggest wins usually come from algorithms, data layout, and avoiding work, not from cosmetic syntax changes.
- Reduce allocation and copying on hot paths, not blindly across the entire codebase.
- Treat generics, macros, and huge dependency graphs as compile-time and binary-size tradeoffs, not free abstractions.

## High-Value Heuristics

- Prefer simpler data structures before micro-tuning loops.
- Avoid repeated parsing, formatting, and allocation inside inner loops.
- Reuse buffers where ownership and lifetime constraints remain clear.
- Keep hot-path branching and cache behavior in mind when handling common special cases.
- If compile times or binary size matter, inspect macro expansion, monomorphization, and feature sprawl.

## Validation Tool Map

- Style and baseline linting: `cargo fmt`, `cargo clippy`, `cargo fix`
- IDE and inline diagnostics: `rust-analyzer`
- Macro debugging: `cargo expand`
- Benchmarking: `criterion`
- Undefined-behavior checks for unsafe and low-level code: `cargo miri test`
- Faster, more reliable test execution in large suites: `cargo nextest run`
- Coverage: `cargo llvm-cov`
- Dependency policy and advisories: `cargo deny`
- Unused dependencies: `cargo udeps`
- Feature-matrix and CI sweeps: `cargo hack`
- Minimum supported Rust version: `cargo msrv`
- Public API semver checks: `cargo semver-checks`
- Binary-size investigation: `cargo bloat`
- Compile-time investigation: `cargo build --timings`

## When to Use What

- Use `cargo clippy` on every branch; escalate selected lints in CI instead of turning on every pedantic lint by default.
- Use `cargo fix` for machine-applicable compiler or edition fixes, then review the diff instead of trusting it blindly.
- Use `cargo miri test` for unsafe code, raw pointers, FFI edges, and suspicious aliasing or initialization bugs.
- Use `cargo nextest run` when the suite is large or flaky under plain `cargo test`.
- Use `criterion` for repeatable benchmarks; do not infer performance from wall-clock `println!` timing.
- Use `cargo bloat` and `cargo build --timings` when binary size or compile times become product constraints.
- Use `cargo hack`, `cargo deny`, `cargo udeps`, `cargo msrv`, and `cargo semver-checks` to turn "it builds on my machine" into a real release gate.

## Review Checklist

- Was performance measured in release mode?
- Is there profiler or benchmark evidence for the claimed bottleneck?
- Are optimization changes increasing unsafe surface, generic bloat, or API complexity without a measured win?
- Does CI validate features, coverage, dependency hygiene, and semver where relevant?
- Are unsafe or low-level optimizations checked with Miri or equivalent targeted tests?

## Sources

- https://doc.rust-lang.org/book/appendix-04-useful-development-tools.html
- https://doc.rust-lang.org/cargo/commands/cargo-fix.html
- https://nnethercote.github.io/perf-book/introduction.html
- https://nnethercote.github.io/perf-book/general-tips.html
- https://nnethercote.github.io/perf-book/compile-times.html
- https://rust-lang.github.io/rust-clippy/stable/index.html
- https://github.com/rust-lang/miri
- https://nexte.st/
- https://docs.rs/crate/criterion/latest
- https://github.com/dtolnay/cargo-expand
- https://github.com/RazrFalcon/cargo-bloat
- https://github.com/taiki-e/cargo-llvm-cov
- https://github.com/EmbarkStudios/cargo-deny
- https://github.com/est31/cargo-udeps
- https://github.com/taiki-e/cargo-hack
- https://github.com/foresterre/cargo-msrv
- https://github.com/obi1kenobi/cargo-semver-checks
