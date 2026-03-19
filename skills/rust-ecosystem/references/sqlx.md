# SQLx

## Scope

Load this file for SQLx pool lifecycle, query macros, transactions, migrations, offline preparation, and test patterns.
Use `rust-master` for trait-system or ownership questions behind repository abstractions.

## Core Rules

- Create one long-lived pool for the process and share cheap cloned handles.
- Do not create one pool per request and do not hide a single connection behind a mutex.
- Prefer `query!` or `query_as!` for static SQL that benefits from compile-time checking.
- Keep transactions short and scoped tightly around invariants that must be atomic.
- Keep migrations in the repo and treat them as part of the release contract.
- Account for nullability explicitly; SQL `NULL` usually means `Option<T>` on the Rust side.
- Plan build and CI for SQLx macros: provide `DATABASE_URL` or maintain `.sqlx` offline data.

## Review Checklist

- Is the pool initialized once and closed cleanly on shutdown?
- Are transactions wider than the real invariant requires?
- Is dynamic SQL being used where static checked queries would be safer?
- Are `Option<T>` and SQL nullability aligned?
- Do migrations, tests, and compile-time query checks agree on the schema source of truth?

## Sources

- https://docs.rs/sqlx/latest/sqlx/struct.Pool.html
- https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html
- https://docs.rs/sqlx/latest/sqlx/macro.query.html
- https://docs.rs/sqlx/latest/sqlx/macro.query_as.html
- https://docs.rs/sqlx/latest/sqlx/migrate/index.html

