# Cross Compilation

## Scope

Load this file for target triples, linker setup, Cargo target config, `rustup target add`, and when `-Z build-std` is actually justified.
Use `rust-platforms` when the problem is primarily about wasm or embedded runtime constraints rather than shipping host binaries.

## Core Rules

- `rustup target add` only installs the Rust standard library for the target; it does not install the whole system toolchain.
- Keep target-specific linker and runner settings in `.cargo/config.toml` instead of ad hoc shell flags.
- Prefer standard target triples and supported toolchains before inventing custom target specs.
- Use `cargo build --target <triple>` as the baseline delivery path when native linkers and SDKs are already available.
- Reach for `-Z build-std` only when you truly need custom targets or custom-std builds and are willing to accept nightly and `rust-src`.

## Review Checklist

- Is the target triple correct for the intended libc, ABI, and CPU?
- Is the linker or SDK requirement explicit in repo configuration?
- Is the team assuming `rustup target add` solved C toolchain needs?
- Is `build-std` being used for a real requirement rather than as a default fix?
- Is the cross-build path reproducible in CI as well as locally?

## Senior Heuristics

- Start with the simplest host-supported cross path and only add heavier delivery tooling when the baseline path hurts.
- Keep target configuration declarative and checked into the repo.
- If the crate has C dependencies, delivery complexity usually comes from the C toolchain, not from Cargo itself.
- Custom targets and `build-std` are powerful but should stay exceptional because they raise maintenance cost fast.
- A successful local cross build is only the first checkpoint; runtime compatibility and support policy come next.

## Sources

- https://rust-lang.github.io/rustup/cross-compilation.html
- https://doc.rust-lang.org/cargo/reference/config.html#target
- https://doc.rust-lang.org/cargo/commands/cargo-build.html
- https://doc.rust-lang.org/cargo/reference/unstable.html#build-std

