# Tooling and Debugging

## Scope

Load this file for practical wasm and embedded workflow: target checks, wasm tests, size tools, probe-based flashing, embedded logging, and platform-specific validation.
See also [wasm.md](wasm.md), [embedded-no-std.md](embedded-no-std.md), and [firmware-stack.md](firmware-stack.md) for the design rules these tools support.

## Wasm Workflow

- Use `cargo check --target wasm32-unknown-unknown` to catch portability breakage early.
- Use `wasm-pack test` or `wasm-bindgen-test` for Node.js or browser-target tests instead of trusting native tests.
- Use `--headless` browser modes in CI when browser behavior matters.
- Measure the final `*_bg.wasm` and generated JS output, not just the compiler's first wasm artifact.
- Use `wasm-opt` for post-link size work and `twiggy` when size profiling is needed before rewriting code.

## Embedded and Firmware Workflow

- Prefer `probe-rs run` as the default flash-and-run path when the target is supported.
- Use `probe-rs attach` when you need to inspect current target state without resetting or reflashing it.
- Put the runner in `.cargo/config.toml` so `cargo run` reflects the real hardware workflow.
- Use `defmt` when resource-constrained logging matters and the linker plus logger constraints fit the project.
- Make panic behavior, logging, flashing, and debug transport part of the project baseline, not ad hoc local setup.

## Validation Rules

- Host-native tests do not prove wasm behavior.
- Host-native tests do not prove `no_std` or interrupt behavior.
- For `no_std` libraries, keep target checks and at least one target-aware validation path in CI.
- Prefer one narrow end-to-end hardware or emulator workflow over many unverified assumptions.

## Review Checklist

- Does the wasm crate have real wasm-target tests?
- Are size changes measured with target artifacts and size tools rather than guessed from source?
- Is the embedded project's flash/debug/log flow reproducible through config or scripts?
- Is probe-based workflow or equivalent configured in the repo instead of tribal knowledge?
- Is logging and panic behavior appropriate for the target's resources and debugging needs?

## Sources

- https://rustwasm.github.io/docs/wasm-pack/commands/test.html
- https://rustwasm.github.io/book/reference/code-size.html
- https://rustwasm.github.io/wasm-bindgen/reference/optimize-size.html
- https://probe.rs/docs/tools/probe-rs/
- https://defmt.ferrous-systems.com/
- https://docs.rust-embedded.org/book/intro/tooling.html

