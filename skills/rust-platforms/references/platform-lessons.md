# Platform Lessons

## Scope

Load this file for community-tested heuristics and anti-patterns around Rust wasm and embedded work. These are recurring lessons from forums and field experience, not replacements for the primary docs.

## Wasm Lessons

- Choose the target and toolchain pair deliberately. `wasm32-unknown-unknown` plus `wasm-bindgen` is a different world from WASI-style targets.
- Do not assume all wasm targets share the same ABI or host capabilities.
- Keep the JS boundary narrow; once `#[wasm_bindgen]` spreads through internal code, portability and testing usually get worse.
- Native tests proving logic correctness do not prove browser or Node integration correctness.

## no_std and Embedded Lessons

- A crate can be `no_std` and still use `std` in tests. Integration tests compile separately with `std` by default, and forum experience strongly prefers `#[cfg(test)] extern crate std;` over toggling `#![no_std]` off with `cfg_attr(not(test), no_std)`.
- Do not assume a global critical section is always required. Some chips can update hardware state independently enough that finer-grained ownership is possible.
- If hardware access needs a peripheral reference everywhere, you probably still have a concurrency story to solve; the reference alone does not remove contention.
- Global mutable hardware state is reality; the job is to encode ownership and access discipline, not to pretend the globals do not exist.

## Embassy and Firmware Lessons

- Async syntax does not fix unclear peripheral ownership.
- If every interaction becomes its own task, the firmware often gets harder to reason about instead of easier.
- Logging, flashing, and attach-vs-run workflow are architecture choices because they shape how failures are observed.
- Board bring-up knowledge must live in config and code, not just in a senior engineer's shell history.

## Review Prompts

- Is this using target-specific magic where a clearer boundary would be better?
- Are tests proving host logic only, or the actual platform path?
- Is synchronization driven by hardware reality or by habit?
- Is async solving coordination, or only moving blocking and ownership confusion around?
- Would a newcomer know how to build, flash, run, and inspect this target from the repo itself?

## Community and Ecosystem Sources

- https://users.rust-lang.org/t/fixing-rusts-webassembly-targets/88947
- https://users.rust-lang.org/t/future-of-rust-wasm/133089
- https://users.rust-lang.org/t/can-a-no-std-crate-have-std-dependencies-in-test-cases-only/72982
- https://users.rust-lang.org/t/code-review-for-a-new-hal-gpio-implementation/66942
- https://docs.rust-embedded.org/book/peripherals/borrowck.html

