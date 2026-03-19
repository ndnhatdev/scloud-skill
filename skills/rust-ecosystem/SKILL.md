---
name: rust-ecosystem
description: Practical Rust backend ecosystem guidance for Tokio, Serde, Axum, SQLx, and Tracing, including focused Rust-Tokio, Rust-Axum, and Rust-SQLx guidance inside one skill. Use when Codex needs to design or review async services, app state, request handlers, serialization, database access, migrations, structured logging, graceful shutdown, or integration patterns in modern Rust applications.
---

# Rust Ecosystem

Use this skill for Rust application-stack guidance built on common backend crates.
Keep the core instructions short and load only the reference file that matches the request.
Treat Tokio, Axum, and SQLx as focused subdomains inside this one packaged skill rather than separate duplicated skills.

## Request Map

- Tokio runtime, tasks, channels, `select!`, shared state, `spawn_blocking`, or graceful shutdown:
  load [references/tokio.md](references/tokio.md)
- Serde derive attributes, enum representations, defaults, flattening, renaming, or custom serialization:
  load [references/serde.md](references/serde.md)
- Axum routers, state, extractors, middleware, `IntoResponse`, or handler design:
  load [references/axum.md](references/axum.md)
- SQLx pools, transactions, query macros, migrations, offline preparation, or DB testing:
  load [references/sqlx.md](references/sqlx.md)
- End-to-end service architecture that combines Tokio, Axum, SQLx, and Tracing:
  load [references/service-stack.md](references/service-stack.md)
- Tracing subscribers, `EnvFilter`, spans, events, layers, `#[instrument]`, or async observability:
  load [references/tracing.md](references/tracing.md)

## Workflow

1. Classify the request as `learn`, `choose`, `review`, `debug`, `design`, or `study-plan`.
2. Identify the main crate or integration boundary:
   - Tokio: runtime model, tasks, channels, shutdown, sync-vs-async locking, blocking boundaries
   - Serde: payload modeling, derive attrs, enum shape, compatibility, zero-copy tradeoffs
   - Axum: router composition, request extraction, state flow, response mapping, middleware
   - SQLx: pool lifecycle, query typing, transactions, migrations, tests, offline workflow
   - Service stack: startup, app state, graceful shutdown, request-to-DB flow, integration tests, and boundary ownership across Tokio + Axum + SQLx
   - Tracing: subscriber setup, field design, request spans, filtering, async instrumentation
3. Load only the relevant reference file. If the question crosses layers, load at most two reference files.
4. Prefer official project docs and docs.rs for crate behavior.
5. Structure the answer around:
   - the design rule or choice
   - why it fits this crate or boundary
   - tradeoffs and failure modes
   - a concrete next refactor, command, or code pattern

## Core Rules

- Keep core language and ownership reasoning in `rust-master`; use this skill for crate-level patterns.
- In Tokio, do not block the runtime and do not default to async mutexes.
- In Serde, treat derive attributes as wire-format contracts, not cosmetic annotations.
- In Axum, keep handlers thin and map domain errors to HTTP at the boundary.
- In SQLx, create one long-lived pool, keep transactions short, and prefer compile-time checked queries when possible.
- Across Tokio + Axum + SQLx, keep startup, app state, shutdown, and error mapping explicit rather than implicit.
- In Tracing, use structured fields and spans deliberately; avoid logging secrets or noisy high-cardinality data.

## Review Priorities

When auditing Rust application-stack code, check these first:

- sync blocking or wide lock scopes inside async paths
- uncontrolled task spawning, missing cancellation, or no shutdown plan
- confusing Serde shape changes such as `untagged`, `flatten`, or `deny_unknown_fields`
- Axum extractor order mistakes, duplicated body consumption, or bloated handlers
- SQLx pool-per-request, overly wide transactions, or runtime SQL where static macros fit
- missing service lifecycle design: no bootstrap order, no shutdown coordination, no clear app state ownership, or no integration test story
- missing trace context, missing filters, or fields that are too large, sensitive, or high-cardinality

## Navigation

- Load [references/tokio.md](references/tokio.md) for runtime, channels, shared state, and shutdown.
- Load [references/serde.md](references/serde.md) for payload shape, derive attributes, and compatibility choices.
- Load [references/axum.md](references/axum.md) for router composition, extractors, state, and responses.
- Load [references/sqlx.md](references/sqlx.md) for pools, query macros, transactions, and migrations.
- Load [references/service-stack.md](references/service-stack.md) for the integrated Tokio + Axum + SQLx application shape.
- Load [references/tracing.md](references/tracing.md) for subscribers, fields, spans, layers, and filtering.

## Source Policy

- Prefer official Tokio, Serde, Axum, SQLx, and Tracing project documentation.
- Use exact dates when crate behavior may have changed.
- Separate crate-level guidance from core language rules; route ownership, lifetimes, trait-system, or compiler diagnostics questions back to `rust-master`.

## Runtime Manifest

```yaml runtime-manifest
version: 0.1.0
entry: scripts/index.ts
env_requirements: []
input_schema:
  type: object
  properties:
    topic:
      type: string
      enum:
        - overview
        - tokio
        - serde
        - axum
        - sqlx
        - service-stack
        - tracing
        - all
    goal:
      type: string
      enum:
        - learn
        - choose
        - review
        - debug
        - design
        - study-plan
    question:
      type: string
    constraints:
      type: string
    depth:
      type: string
      enum:
        - quick
        - standard
        - deep
  additionalProperties: false
```
