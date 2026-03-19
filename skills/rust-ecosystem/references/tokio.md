# Tokio

## Scope

Load this file for Tokio runtime decisions: task spawning, channels, `select!`, shared state, blocking boundaries, and graceful shutdown.
Use `rust-master` for ownership, `Send` or `Sync`, and compiler diagnostics behind these choices.
See also [service-stack.md](service-stack.md) for the integrated Tokio + Axum + SQLx lifecycle.

## Core Rules

- Use Tokio for high-concurrency I/O and orchestration, not for hiding CPU-bound work.
- Use `tokio::spawn` for concurrent async work that is `'static` and `Send`.
- Use `spawn_blocking` at sync or CPU-heavy boundaries that must not stall the executor.
- Prefer dedicated owner tasks plus channels before shared mutable state around I/O resources.
- `std::sync::Mutex` is acceptable in async code only for short, low-contention critical sections that end before `.await`.
- Reach for `tokio::sync::Mutex` only when the guard truly must live across `.await`.
- Plan shutdown explicitly with cancellation plus task waiting, not by dropping random handles and hoping for the best.

## Selection Rules

- Single connection or device-like resource with serialized access: dedicated task + `mpsc`/`oneshot`
- Many independent tasks racing or waiting on cancellation: `select!`
- Sync library or CPU-heavy step inside async app: `spawn_blocking`
- Shared read/modify/write on small state with low contention: `Arc<std::sync::Mutex<T>>`
- Cross-task shutdown coordination: `CancellationToken` plus task tracking

## Integration Notes

- In Axum services, keep request-scoped work in handlers and long-lived coordination in background tasks or service objects.
- For DB work, SQLx pools are already shared handles; avoid wrapping a pool in extra mutexes.
- If a background task owns a network or queue resource, expose it to handlers through channels instead of shared locking.
- Be careful with `spawn_blocking`: started blocking tasks cannot be force-aborted, so runtime shutdown may wait for them unless you design bounded blocking work.

## Review Checklist

- Is any blocking code or wide critical section sitting on the runtime?
- Is a `tokio::sync::Mutex` used only because the code is async, not because the lock crosses `.await`?
- Would a manager task and channels simplify access to the shared resource?
- Is shutdown coordinated, or will tasks leak or be abruptly aborted?
- Are spawned tasks owned, awaited, or tracked somewhere meaningful?
- Is any long-lived blocking task incorrectly using `spawn_blocking` instead of a dedicated thread or service process?

## Sources

- https://tokio.rs/tokio/tutorial/spawning
- https://tokio.rs/tokio/tutorial/shared-state
- https://tokio.rs/tokio/tutorial/channels
- https://tokio.rs/tokio/topics/shutdown
- https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html
- https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html
