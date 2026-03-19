# Skill Map

## Scope

Load this file when the main task is identifying which Rust skill should own a request.
This is the boundary map for the Rust skill set in this repo.

## Rust Skill Boundaries

- `rust-master`
  - Use for ownership, borrowing, lifetimes, diagnostics, traits, macros, unsafe, performance, API design, and general Rust code review.
  - Default support skill when another domain question still depends on core Rust reasoning.
- `rust-ecosystem`
  - Use for Tokio, Serde, Axum, SQLx, Tracing, and integrated async service structure.
  - Best when the crate ecosystem and service architecture dominate the request.
- `rust-platforms`
  - Use for wasm, embedded `no_std`, Embassy, firmware architecture, flashing, and target-specific platform tooling.
  - Best when the runtime environment or target platform is the hard constraint.
- `rust-specializations`
  - Use for rustc internals, MIR or query-system reasoning, cargo-fuzz, Rust for Linux, SIMD, and frontier-map questions.
  - Best when the request sits outside ordinary app or library development.
- `rust-verification`
  - Use for `proptest`, `loom`, Kani, and choosing between verification layers.
  - Best when the core problem is how to prove or systematically search correctness.
- `rust-delivery`
  - Use for cross-compilation, `cross`, `cargo-zigbuild`, `cargo-xwin`, `dist`, musl vs GNU or MSVC, and release pipelines.
  - Best when the problem is how to ship Rust binaries, not just how to compile them once.

## Default Routing Rules

- Choose `rust-master` when no other skill boundary clearly dominates.
- Choose a domain skill first when the request names a crate, target, or workflow that already defines the boundary.
- Add `rust-master` second only when the domain request also needs ownership, unsafe, diagnostics, or performance reasoning.
- Do not route to `rust-specializations` for ordinary Tokio, Axum, wasm, or delivery questions just because they are advanced.
- Do not route to `rust-delivery` for wasm or embedded firmware unless the real question is shipping host binaries or installers.

