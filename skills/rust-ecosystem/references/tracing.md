# Tracing

## Scope

Load this file for `tracing` and `tracing-subscriber`: span design, subscriber setup, filtering, layering, and instrumentation of async services.
Use `rust-master` for language-level macro or type-system issues when they appear.

## Core Rules

- Initialize the subscriber once near startup with a clear default filter strategy.
- Use spans for operations with duration and events for point-in-time facts.
- Prefer structured fields over interpolated strings so logs remain queryable.
- Use `#[instrument]` on request, job, and repository boundaries, but skip large, noisy, or sensitive values.
- Add stable correlation fields such as request IDs, user IDs, resource IDs, and query names when useful.
- Compose layers deliberately; formatting, filtering, and export concerns should stay modular.

## Review Checklist

- Is there a root subscriber with `EnvFilter` or another configurable filter path?
- Are request or job boundaries wrapped in spans with useful structured fields?
- Is `#[instrument]` recording too much data or leaking secrets?
- Are filters global or per-layer in a way that matches the output sinks?
- Will the emitted fields be useful for debugging, not just verbose?

## Sources

- https://docs.rs/tracing/latest/tracing/attr.instrument.html
- https://docs.rs/tracing/latest/tracing/struct.Span.html
- https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html
- https://docs.rs/tracing-subscriber/latest/tracing_subscriber/layer/index.html
- https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/index.html

