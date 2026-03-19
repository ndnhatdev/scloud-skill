# Coverage and Frontiers

## Scope

Load this file when the question is not about one specialized subsystem itself, but about Rust coverage as a whole:
which advanced areas are already covered, which ones still deserve separate skills, and what the next split should be.
Use the domain-specific reference files for concrete technical questions once the boundary is known.

## Current Coverage Map

- `rust-master`: core language, diagnostics, idioms, performance, macros, unsafe, interop, and advanced type-system work
- `rust-ecosystem`: Tokio, Serde, Axum, SQLx, Tracing, and service-stack integration
- `rust-platforms`: wasm, embedded `no_std`, Embassy, firmware architecture, and platform tooling
- `rust-specializations`: rustc internals, fuzzing and sanitizers, Rust for Linux, and SIMD or intrinsics
- `rust-verification`: `proptest`, `loom`, Kani, and layered verification strategy

## Remaining High-Value Frontiers

- Distribution and cross-compilation:
  - `cross`, `cargo-zigbuild`, `cargo-dist`, musl or static-linking choices, CI matrix design, and release artifacts
- Desktop and GUI applications:
  - `tauri` for desktop apps with a Rust core and web UI
  - `egui` or `iced` when immediate-mode or native-style GUI architecture becomes the dominant concern
- Graphics, game, and GPU work:
  - `wgpu` for graphics or compute pipelines
  - `bevy` when ECS, plugins, asset pipelines, and real-time engine architecture dominate the design
- Data-heavy systems, only if the repo's work moves there:
  - `polars`, Arrow, and DataFusion style workflows have enough separate design pressure to justify their own skill

## Split Decision Rules

- Create a dedicated Rust skill when the domain has its own toolchain, testing strategy, CI shape, and operational failure modes.
- Keep the domain inside an existing skill when it is still mostly about core Rust rules plus a few crate APIs.
- Split when answering correctly requires more than one reference file on most requests.
- Split when community pain points are domain-specific and keep recurring in reviews.
- Prefer new skills for domains that change architecture and deployment workflow, not just syntax.

## Senior Heuristics

- Do not create a new skill just because a crate is popular; create it when the crate pulls in a different engineering discipline.
- Distribution deserves its own lane because cross-compiling and shipping binaries is an operational system, not only a Cargo command.
- GUI and graphics deserve separate skills only if the project genuinely lives there; otherwise they stay as future candidates.
- Keep `rust-master` focused on language and design rules; let domain skills own their toolchains and operational workflows.

## Suggested Next Splits

1. `rust-delivery` for cross-compilation, packaging, release automation, and target-distribution tradeoffs.
2. `rust-gui` or `rust-graphics` only if the product direction actually depends on desktop UI or rendering and GPU work.
3. data-system skills only if the repo actually moves toward Arrow, DataFusion, or Polars style workloads.

## Sources

- https://tauri.app/start/
- https://docs.rs/egui/latest/egui/
- https://bevyengine.org/learn/quick-start/introduction/
- https://sotrh.github.io/learn-wgpu/
- https://opensource.axo.dev/cargo-dist/
