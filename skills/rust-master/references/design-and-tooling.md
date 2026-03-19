# Design and Tooling

## Scope

Load this file for trait design, `impl Trait` vs `dyn Trait`, error handling, Cargo, testing, unsafe, and API design.

## Traits, Generics, and Trait Objects

- Prefer generics or argument-position `impl Trait` for static dispatch and homogeneous use sites.
- Use return-position `impl Trait` to hide one concrete return type without boxing.
- Remember that every return branch of `-> impl Trait` must resolve to the same concrete type.
- Use `dyn Trait` for heterogeneous collections or runtime-selected behavior.
- Keep a trait object-safe if downstream users may reasonably need `dyn Trait`.
- Respect coherence and orphan rules when planning trait impls.

## Error Handling

- Use `Option<T>` when absence is expected and not diagnostic.
- Use `Result<T, E>` for recoverable failure.
- Use `panic!` for broken invariants, impossible states, tests, or examples.
- Prefer `?` for propagation and `From` conversions for composition.
- In library APIs, avoid `panic!` for normal invalid user input.
- Prefer `expect()` over bare `unwrap()` when a panic is intentionally tied to an invariant.

## Cargo and Project Structure

- Keep reusable logic in `lib.rs` and keep `main.rs` thin.
- Use modules to express privacy boundaries deliberately.
- Use workspaces when crates should share a lockfile and common commands.
- Keep features additive.
- Avoid mutually exclusive features unless separate crates or runtime configuration are clearly worse.
- Inspect resolved features with `cargo tree -e features` when dependency behavior is surprising.

## Testing

- Use unit tests in the same file for private helpers and local invariants.
- Use integration tests in `tests/` for public API behavior.
- Move logic from `main.rs` into `lib.rs` when integration tests need direct access.
- Test panic contracts, error behavior, and feature combinations where they affect public behavior.

## Unsafe Rust

- Unsafe does not disable the borrow checker.
- Keep unsafe blocks as small as possible.
- Document the exact safety contract at every unsafe boundary.
- Encapsulate unsafe internals behind safe APIs when possible.
- In Rust 2024, unsafe operations inside unsafe functions should still live inside explicit `unsafe {}` blocks.

## API Design

- Implement standard traits when semantics are correct: `Clone`, `Debug`, `Eq`, `Ord`, `Hash`, `Default`, `Display`.
- Favor `From`, `AsRef`, and `AsMut` over ad-hoc conversion methods.
- Avoid boolean or ambiguous optional parameters that hide call-site meaning.
- Use enums, builders, or newtypes when arguments need stronger meaning.
- Keep structs future-proof with private fields unless field-level stability is intentional.
- Only smart pointers should implement `Deref` or `DerefMut`.

## Review Checklist

- Is static dispatch sufficient, or is runtime polymorphism truly needed?
- Are trait methods object-safe where the type should support `dyn Trait`?
- Does the error channel match the real failure mode?
- Are Cargo features additive and documented?
- Are tests placed at the right boundary?
- Is unsafe code narrowly scoped and fully documented?
- Does the public API lean on standard Rust conventions?

## Official Sources

- https://doc.rust-lang.org/reference/types/impl-trait.html
- https://doc.rust-lang.org/reference/items/implementations.html
- https://doc.rust-lang.org/book/ch18-02-trait-objects.html
- https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html
- https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html
- https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html
- https://doc.rust-lang.org/book/ch11-03-test-organization.html
- https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html
- https://doc.rust-lang.org/cargo/reference/workspaces.html
- https://doc.rust-lang.org/stable/cargo/reference/features.html
- https://doc.rust-lang.org/edition-guide/rust-2024/index.html
- https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-op-in-unsafe-fn.html
- https://rust-lang.github.io/api-guidelines/checklist.html
