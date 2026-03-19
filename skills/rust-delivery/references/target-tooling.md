# Target Tooling

## Scope

Load this file for choosing between `cross`, `cargo-zigbuild`, `cargo-xwin`, and native runners or native toolchains.
This is the operational layer that sits on top of basic target and linker configuration.

## Tool Selection Rules

- Use native `cargo build --target` first when the linker and SDK story is already easy and reproducible.
- Use `cross` when containerized Linux or Unix cross-builds are the fastest reliable path and you want a Cargo-like CLI.
- Use `cargo-zigbuild` when Zig-based linking reduces setup pain, especially for Linux glibc targeting or certain Apple cross-builds.
- Use `cargo-xwin` when you need Windows MSVC targets from non-Windows hosts.
- Use native runners for signing, notarization, or platform-native packagers that cross tools do not solve well.

## Review Checklist

- Is the tool chosen because of real target friction, not just familiarity?
- Does `cross` rely on QEMU for tests, and is the team treating that as slower and less predictable than native tests?
- Is `cargo-zigbuild` being used with an explicit `--target`, or is it accidentally acting like plain `cargo build`?
- Are glibc version or SDK cache choices explicit?
- Is a Windows release pipeline trying to avoid native concerns that actually need native validation?

## Senior Heuristics

- `cross` is strong when the container story is a feature, not a burden.
- `cross test` is useful, but QEMU-backed tests are slower and can fail for reasons unrelated to your crate.
- `cargo-zigbuild` is excellent for controlling minimum glibc versions, but it does not magically solve every C dependency edge case.
- `cargo-xwin` is the direct answer when you want Windows MSVC artifacts without maintaining a Windows builder for every compile.
- If the matrix already includes native macOS or Windows runners for release polish, do not overfit everything into one Linux-only build step.

## Sources

- https://github.com/cross-rs/cross
- https://github.com/rust-cross/cargo-zigbuild
- https://github.com/rust-cross/cargo-xwin

