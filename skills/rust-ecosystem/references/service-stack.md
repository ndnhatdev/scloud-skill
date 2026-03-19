# Service Stack

## Scope

Load this file when the real problem is the integrated shape of a Rust web service built with Tokio, Axum, SQLx, and Tracing.
Use this file for startup order, app state, request flow, graceful shutdown, error boundaries, and integration testing.

## Canonical Shape

- Bootstrap configuration first.
- Initialize tracing before starting the server so startup failures are observable.
- Create one long-lived SQLx pool during startup and put it in app state.
- Build a single top-level Axum app state that holds stable shared resources such as config, pool, clients, and service handles.
- Keep handlers thin: extract request data, call a domain service, map domain results into HTTP responses.
- Use Tokio shutdown coordination so the listener, background tasks, and DB-facing work stop in a controlled order.

## Request Flow

1. Axum extracts request state and input.
2. Handler calls a service function or service object.
3. Service validates input and opens a SQLx transaction only if one invariant truly requires atomicity.
4. Repository code runs checked queries when possible.
5. Domain error is mapped once at the HTTP boundary through `IntoResponse`.
6. Tracing spans record the request, key IDs, DB operation names, and failure boundaries.

## App State Rules

- App state should contain long-lived shared resources, not ephemeral per-request data.
- Clone cheap handles such as SQLx pools, channels, and small config wrappers; do not clone heavy clients blindly.
- Prefer substates with `FromRef` when modules only need part of the top-level state.
- Do not put per-request mutable workflow state into shared app state.

## Shutdown Rules

- Keep the listener shutdown signal explicit.
- Stop accepting new work before tearing down critical resources.
- Propagate cancellation to long-lived tasks.
- Wait for in-flight tasks or background workers to finish where correctness requires it.
- Remember that started `spawn_blocking` tasks cannot be force-aborted; design bounded blocking work accordingly.

## Testing Strategy

- Unit test pure domain and query-building logic without HTTP where possible.
- Use Axum integration tests for routing, extraction, and response mapping.
- Use a real database or migration-applied test database for SQLx behavior that depends on schema or query macros.
- Keep migrations exercised in CI so schema drift is caught before deploy.
- Prefer a narrow end-to-end path that covers startup, one request, one DB write or read, and shutdown.

## Review Checklist

- Is startup order explicit: config, tracing, pool, app state, router, listener?
- Is app state stable and cheap to clone?
- Are handlers thin and transactions scoped to real invariants?
- Is shutdown coordinated across listener, tasks, and blocking work?
- Is there at least one integration test proving the request-to-DB path?

## Sources

- https://tokio.rs/tokio/topics/shutdown
- https://docs.rs/axum/latest/axum/struct.Router.html
- https://docs.rs/axum/latest/axum/extract/struct.State.html
- https://docs.rs/sqlx/latest/sqlx/struct.Pool.html
- https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html
- https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html
