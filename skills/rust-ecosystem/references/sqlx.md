# SQLx

## Scope

Load this file for SQLx pool lifecycle, query macros, transactions, migrations, offline preparation, and test patterns.
Use `rust-master` for trait-system or ownership questions behind repository abstractions.
See also [service-stack.md](service-stack.md) for app bootstrap, request-to-DB flow, and shutdown.

## Core Rules

- Create one long-lived pool for the process and share cheap cloned handles.
- Do not create one pool per request and do not hide a single connection behind a mutex.
- Prefer `query!` or `query_as!` for static SQL that benefits from compile-time checking.
- Keep transactions short and scoped tightly around invariants that must be atomic.
- Keep migrations in the repo and treat them as part of the release contract.
- Account for nullability explicitly; SQL `NULL` usually means `Option<T>` on the Rust side.
- Plan build and CI for SQLx macros: provide `DATABASE_URL` or maintain `.sqlx` offline data.

## Integration Notes

- A pool is already a shared handle; clone it into services or handlers cheaply instead of centralizing a single connection behind locks.
- Use transactions in service or repository boundaries that own the invariant, not across entire HTTP handlers by default.
- SQLx macro docs require build-time schema access through `DATABASE_URL` or `.sqlx` offline data, and queries must be string literals or literal concatenations.
- Query output nullability follows schema metadata conservatively; expression columns often become `Option<T>` unless you override shape carefully.

## Review Checklist

- Is the pool initialized once and closed cleanly on shutdown?
- Are transactions wider than the real invariant requires?
- Is dynamic SQL being used where static checked queries would be safer?
- Are `Option<T>` and SQL nullability aligned?
- Do migrations, tests, and compile-time query checks agree on the schema source of truth?
- Does CI provide either `DATABASE_URL` or `.sqlx` data so checked-query macros remain reliable outside a developer laptop?

## Sources

- https://docs.rs/sqlx/latest/sqlx/struct.Pool.html
- https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html
- https://docs.rs/sqlx/latest/sqlx/macro.query.html
- https://docs.rs/sqlx/latest/sqlx/macro.query_as.html
- https://docs.rs/sqlx/latest/sqlx/migrate/index.html
