# Wasm

## Scope

Load this file for Rust on WebAssembly: `wasm32-unknown-unknown`, `wasm-bindgen`, JS interop, target-specific dependencies, testing, and size-oriented review.
Use `rust-master` for general ownership or type-system questions hidden behind a wasm API.

## Core Rules

- Target the right environment first. `wasm-bindgen` is designed for `wasm32-unknown-unknown`.
- Treat the wasm target as a constrained environment: file I/O and networking assumptions from native code do not transfer.
- Factor I/O and threading out of portable libraries; let host code supply the environment-specific parts.
- Use target-specific dependencies and `cfg(target_arch = "wasm32")` when wasm-only interop is required.
- Use `#[wasm_bindgen]` only at the boundary that must cross into JavaScript.
- Design JS/Rust boundaries around supported types and explicit conversion instead of leaking internal Rust types into JS.

## Testing and Size

- Check plain portability with `cargo check --target wasm32-unknown-unknown`.
- Use `wasm-bindgen-test` or `wasm-pack test` when behavior must be verified in Node.js or a browser.
- Review generated glue and ABI shape when behavior is surprising.
- Treat code size as a design dimension: unnecessary exports, heavy dependencies, and glue-heavy conversions all matter.

## Review Checklist

- Is the crate assuming sync I/O or threads on wasm?
- Are wasm-only dependencies and exports isolated behind `cfg` boundaries?
- Is the JS boundary narrow and explicit?
- Are tests run on an actual wasm target rather than inferred from native tests?
- Is binary-size work grounded in exports and dependencies, not folklore alone?

## Sources

- https://rustwasm.github.io/docs/book/reference/add-wasm-support-to-crate.html
- https://rustwasm.github.io/docs/wasm-bindgen/
- https://rustwasm.github.io/docs/wasm-bindgen/reference/rust-targets.html
- https://rustwasm.github.io/docs/wasm-bindgen/wasm-bindgen-test/index.html
- https://rustwasm.github.io/wasm-bindgen/reference/optimize-size.html
- https://docs.rs/wasm-bindgen/latest/wasm_bindgen/prelude/
- https://docs.rs/serde-wasm-bindgen

