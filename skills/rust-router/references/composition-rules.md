# Composition Rules

## Scope

Load this file when the request may need more than one Rust skill or when you need to decide load order.
The goal is to combine the fewest skills that actually add distinct value.

## Multi-Skill Patterns

- `rust-ecosystem` then `rust-master`
  - Use when a Tokio, Axum, SQLx, or Tracing problem also hinges on ownership, `Send`, `Sync`, diagnostics, or performance.
- `rust-platforms` then `rust-master`
  - Use when wasm or embedded questions also depend on unsafe, lifetimes, or low-level review concerns.
- `rust-verification` then `rust-master`
  - Use when property tests, loom models, or Kani harnesses depend on core Rust invariants or unsafe reasoning.
- `rust-verification` then `rust-ecosystem`
  - Use when verification work is happening inside a Tokio, Serde, Axum, SQLx, or Tracing code path and crate-specific behavior still matters.
- `rust-ecosystem` then `rust-delivery`
  - Use when the question spans backend service code and how that service should be packaged or released.
- `rust-platforms` then `rust-delivery`
  - Use when the request crosses a platform target and host-binary distribution workflow.
- `rust-specializations` then `rust-verification`
  - Use when fuzzing or other specialized reliability work overlaps verification planning.

## Load-Order Rules

- Load the boundary-defining skill first.
- Load `rust-master` second when it clarifies the core language or review issue.
- Use two non-master skills only when each owns a genuinely separate operational system.
- Avoid loading three Rust skills unless the user explicitly asks for broad architectural planning.
- If two skills seem equally plausible, pick the narrower one first and treat the other as conditional support.

## Example Routes

- "Borrow-checker issue inside an Axum handler using SQLx":
  - `rust-ecosystem` then `rust-master`
- "Ship a Tokio service to musl and Windows with dist":
  - `rust-ecosystem` then `rust-delivery`
- "Wasm binary size and browser packaging":
  - `rust-platforms`
- "Use loom or Kani for a lock-free queue":
  - `rust-verification` then `rust-master`
- "Add proptest around Serde round-trips for an API payload":
  - `rust-verification` then `rust-ecosystem`
- "Review a parser hardened with cargo-fuzz and proptest":
  - `rust-specializations` then `rust-verification`
- "Kernel-driver code using unsafe pointer manipulation":
  - `rust-specializations` then `rust-master`

## Classic Mistakes

- Always loading `rust-master` first even when a domain skill clearly defines the problem.
- Pulling in three or four Rust skills for a request that only needs one.
- Confusing "advanced" with `rust-specializations`; many advanced questions still belong to ecosystem, platforms, delivery, or verification.
- Treating packaging and verification as support details when they are actually the main workflow boundary.
