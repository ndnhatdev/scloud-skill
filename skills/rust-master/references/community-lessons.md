# Community Lessons

## Scope

Load this file for battle-tested heuristics from Rust community discussions and tool docs. These are design heuristics and failure patterns, not substitutes for the language rules.
See also [foundations.md](foundations.md) and [concurrency.md](concurrency.md) for the underlying rules.
See also [diagnostics-and-type-errors.md](diagnostics-and-type-errors.md) for turning forum-style symptoms back into compiler-error families.

## Classic Lessons

- `clone()` is not automatically a bug. Blind cloning in hot loops is a bug candidate; cloning at ownership boundaries is often the simplest correct choice.
- If the borrow checker keeps resisting, first shorten scopes, move ownership, or return owned data. Do not default to `RefCell<T>` or large lifetime signatures.
- `Rc<RefCell<T>>` and `Arc<Mutex<T>>` are often symptoms of an unclear ownership model. They are valid tools, not default architecture.
- In async Rust, prefer `std::sync::Mutex` for short purely synchronous critical sections and async mutexes only when the lock must live across `.await`.
- `RwLock<T>` is not a free speedup. It only helps when the access pattern actually favors many readers and few writers.
- Returning `Vec<T>` is often better than forcing borrowed or iterator-heavy APIs that leak lifetime complexity.
- For closed sets of behaviors, `enum` often beats `dyn Trait` in simplicity, debuggability, and performance.
- Iterator chains are usually fine, but clever combinator stacks are not always clearer or faster than loops. Measure hot code and optimize for readability elsewhere.

## Anti-Pattern Radar

- Pervasive interior mutability in application-state types.
- Lock guards or borrowed views escaping farther than the invariant requires.
- Async functions that do blocking work or hold sync guards across `.await`.
- Macro-heavy or highly generic code pushed into public APIs without regard for compile times and error quality.
- Fighting the type system to preserve borrowed outputs that would be cleaner as owned values.

## Review Prompts

- Is the current design paying complexity to avoid a cheap allocation or clone that would not matter?
- Is shared mutable state being used because it is truly required, or because ownership transfer was not modeled first?
- Would a dedicated owner task plus message passing simplify this async design?
- Is this API "zero-copy" for real benefit, or only to satisfy aesthetic pressure?
- Is a tool-based check missing for the specific risk here: UB, semver, features, dependency hygiene, or benchmark evidence?

## Community and Ecosystem Sources

- https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html
- https://users.rust-lang.org/t/std-mutex-vs-futures-mutex-vs-futures-lock-mutex-for-async/41710
- https://users.rust-lang.org/t/what-makes-async-mutex-more-expensive-than-sync-mutex/100806
- https://users.rust-lang.org/t/which-mutex-to-use-parking-lot-or-std-sync/85060
- https://users.rust-lang.org/t/solved-should-i-clone-to-avoid-borrow-check/23815
- https://users.rust-lang.org/t/why-use-clone/116632
- https://users.rust-lang.org/t/implementing-iterator-for-vec/71398
- https://users.rust-lang.org/t/return-an-iterator-from-struct-in-refcell/86580
- https://users.rust-lang.org/t/returning-an-iterator/24402
- https://users.rust-lang.org/t/performance-difference-between-iterator-and-for-loop/50254
