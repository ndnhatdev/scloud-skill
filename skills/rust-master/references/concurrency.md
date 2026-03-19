# Concurrency

## Scope

Load this file for async vs threads, Send/Sync, shared-state design, and lock selection.
See also [foundations.md](foundations.md) for `Rc<T>`, `Arc<T>`, `RefCell<T>`, and ownership-first modeling.
See also [design-and-tooling.md](design-and-tooling.md) for unsafe concurrency edges and API design tradeoffs.

## Async vs Threads

- Use async for high-concurrency I/O-bound work.
- Use threads for CPU-bound parallelism or blocking operations.
- In real systems, combine them:
  - async for orchestration and network waits
  - worker threads or blocking pools for heavy compute
- Do not block the async executor with long-running CPU work or blocking syscalls.

## `Send` and `Sync`

- `Send` means ownership can move across threads.
- `Sync` means shared references can be used across threads.
- `Rc<T>` is not a cross-thread ownership tool.
- `RefCell<T>` is not `Sync`; it is single-threaded runtime borrowing only.
- `Arc<T>` only gives shared ownership. It does not make unsound inner mutation safe.

## Shared State Primitives

### `Mutex<T>`

- Use for exclusive mutation across threads.
- Keep critical sections short.
- Do not hold the guard across `.await`.
- Treat poisoning as a signal to inspect invariants, not as an automatic recovery story.

### `RwLock<T>`

- Use when reads dominate and writes are relatively rare.
- Avoid by default when fairness or writer starvation is unclear.
- Do not assume it is always better than `Mutex<T>`; contention patterns matter.

### Channels and Ownership Transfer

- Prefer channels or ownership transfer before shared mutable state when the design allows it.
- Message passing is often simpler than `Arc<Mutex<T>>`.

## Selection Rules

- CPU-bound parallel work: threads first.
- Fan-out I/O with many waits: async first.
- Shared ownership across threads: `Arc<T>`.
- Exclusive shared mutation: `Arc<Mutex<T>>`.
- Read-heavy shared state with clear contention benefit: `Arc<RwLock<T>>`.
- Single-thread interior mutability: `RefCell<T>`, not locks.

## Review Checklist

- Is the workload CPU-bound or I/O-bound?
- Is shared mutable state truly necessary?
- Is `Rc<T>` or `RefCell<T>` leaking into threaded code?
- Is any lock guard held across `.await`?
- Would channels simplify the model?
- Is `RwLock<T>` justified by actual read-heavy access?

## Official Sources

- https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html
- https://doc.rust-lang.org/book/ch17-06-futures-tasks-threads.html
- https://doc.rust-lang.org/std/sync/struct.Arc.html
- https://doc.rust-lang.org/std/sync/struct.Mutex.html
- https://doc.rust-lang.org/std/sync/struct.RwLock.html
- https://doc.rust-lang.org/stable/std/cell/index.html
