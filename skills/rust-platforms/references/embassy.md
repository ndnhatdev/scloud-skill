# Embassy

## Scope

Load this file for Embassy async embedded design: executor choice, task declarations, spawners, timers, channels, signals, and interrupt-driven async firmware.
Use `rust-master` for language-level async, pinning, or diagnostics that sit underneath Embassy behavior.
See also [tooling-and-debugging.md](tooling-and-debugging.md) for logging and debug workflow around Embassy-based firmware.
See also [platform-lessons.md](platform-lessons.md) for task-ownership and async-overuse heuristics.

## Core Rules

- Embassy makes async/await a first-class option for embedded development, but the executor still depends on tasks yielding cooperatively.
- Prefer the safe `#[embassy_executor::main]` and `#[embassy_executor::task]` path before reaching for raw executor APIs.
- `Spawner` is not `Send`; use it inside the executor thread. Use `SendSpawner` when spawning from another thread and only for `Send` tasks.
- Do not block Embassy tasks indefinitely; blocking prevents the executor from scheduling other tasks.
- Model long-lived peripheral ownership explicitly. Async does not eliminate resource ownership problems.

## Task and Sync Rules

- Embassy task functions must be `async` and cannot use generics.
- Task spawning is explicit; a task function call creates a `SpawnToken` that must be spawned.
- Use `embassy_time::Timer` for async time-based waits instead of busy loops.
- Use `embassy_sync` primitives such as `Channel`, `Signal`, `Watch`, and async `Mutex` according to the communication pattern.
- Prefer safe executor wrappers and the task macro; raw executor APIs are for lower-level control with sharper safety edges.

## Review Checklist

- Is any task blocking instead of yielding?
- Is `Spawner` being moved somewhere that really needs `SendSpawner`?
- Are task counts and ownership explicit, or are resources implicitly shared?
- Is `embassy_sync` using the right primitive for one-to-one, broadcast, latest-value, or mutex-style coordination?
- Are raw executor pieces being used without a clear reason to bypass the safe wrappers?

## Sources

- https://embassy.dev/book/
- https://docs.rs/embassy-executor/latest/embassy_executor/struct.Spawner.html
- https://docs.embassy.dev/embassy-executor/git/std/attr.task.html
- https://docs.embassy.dev/embassy-executor/git/std/struct.SendSpawner.html
- https://docs.embassy.dev/embassy-executor/git/cortex-m/struct.SpawnToken.html
- https://docs.rs/embassy-time/latest/embassy_time/struct.Timer.html
- https://docs.rs/embassy-sync/latest/embassy_sync/
