# Delivery Strategy

## Scope

Load this file when the question is not just "how do I build target X" but "how should this repo ship Rust binaries sanely over time."
This file connects native builds, cross tools, compatibility choices, and release automation into one decision model.

## Strategy Rules

- Start from the target matrix you can actually test and support.
- Use native builds when native platform work is the constraint; use cross tools when toolchain setup is the constraint.
- Add `dist` after the artifact matrix is stable enough to automate.
- Keep fast CI, slow release CI, and manual release steps clearly separated.
- Treat artifact compatibility, naming, and installer UX as product-level decisions.

## Combination Patterns

- Native cargo plus `.cargo/config.toml`: simplest path when linkers and SDKs are already manageable.
- `cross` plus targeted native runners: good when Linux cross-builds are easy in containers but macOS or signing still needs native machines.
- `cargo-zigbuild` plus `dist`: useful when you need controlled Linux portability and automatic release artifacts.
- `cargo-xwin` plus `dist`: useful when Windows MSVC artifacts should be produced from non-Windows builders but still verified somewhere sensible.
- Minimal matrix first, then expand only after support and testing prove it is worth the cost.

## Classic Mistakes

- Building a huge release matrix before the team can even support one clean target per platform.
- Mixing local convenience scripts with CI release logic until no one knows the canonical path.
- Assuming generated CI absolves the team from understanding the release flow.
- Treating QEMU or cross-emulated tests as equivalent to native release validation.
- Shipping binaries with vague platform labels and no compatibility policy.

## Suggested Rollout

1. Define supported targets and compatibility promises.
2. Make one reproducible local build path per target family.
3. Encode linker, runner, and cache settings in repo config.
4. Add release automation only after the matrix and artifact names are stable.
5. Keep native validation for the places where cross tools stop helping.

## Sources

- https://rust-lang.github.io/rustup/cross-compilation.html
- https://github.com/cross-rs/cross
- https://github.com/rust-cross/cargo-zigbuild
- https://github.com/rust-cross/cargo-xwin
- https://github.com/axodotdev/cargo-dist

