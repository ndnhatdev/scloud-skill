# Syntax and Idioms

## Scope

Load this file for idiomatic Rust syntax, expression-oriented patterns, iterator and collection style, and common signature refactors.
See also [foundations.md](foundations.md) for ownership and lifetime rules that justify these idioms.
See also [design-and-tooling.md](design-and-tooling.md) for trait and API-boundary design.
See also [diagnostics-and-type-errors.md](diagnostics-and-type-errors.md) when an idiom question is really a type-mismatch, inference, or receiver-resolution problem.

## Signature and Ownership Idioms

- Prefer borrowed inputs like `&str`, `&[T]`, `&Path`, and `&OsStr` when the callee only reads.
- Use owned inputs when the function must store, transform, or transfer ownership.
- Prefer `AsRef<Path>` or similar conversion traits at API boundaries only when they improve ergonomics without obscuring behavior.
- Return owned values when borrowed output would force awkward lifetime plumbing or leak storage details.
- Use newtypes or enums when a parameter needs stronger meaning than `bool`, `usize`, or `String`.

## Expression-Oriented Control Flow

- Use `match` when all variants matter and the exhaustiveness is part of the design.
- Use `if let`, `while let`, and `let-else` to flatten the "happy path" and keep error exits local.
- Prefer early returns over deeply nested blocks when handling parse or validation failures.
- Keep mutable state scoped as tightly as possible; many borrow issues disappear when temporaries are shorter-lived.

## Collections and Iterator Style

- Prefer iterator adapters when they express the transformation directly and stay readable.
- Prefer plain `for` loops when the logic is stateful, early-exit-heavy, or measurably clearer.
- Use collection entry APIs like `HashMap::entry` to avoid duplicate lookups and awkward branching.
- Use `collect::<Result<Vec<_>, _>>()` when mapping items into fallible transformations.
- Implement `IntoIterator` for collection-like newtypes; do not force callers through ad-hoc `iter_items()` APIs unless the semantics truly differ.

## Pattern-Based Refactors

- Closed set of variants: prefer `enum` over `dyn Trait`.
- One concrete hidden return type: prefer `-> impl Trait`.
- Heterogeneous runtime-selected behavior: use `Box<dyn Trait>` or `Arc<dyn Trait + Send + Sync>`.
- Shared read-mostly configuration: prefer owned immutable structs over pervasive interior mutability.
- Repeated string conversions at boundaries: normalize once, then pass borrowed views internally.

## Review Checklist

- Does the signature communicate ownership clearly?
- Is a loop or iterator chain optimized for clarity first?
- Are collection APIs using `entry`, `retain`, `drain`, slices, and iterators instead of manual index juggling?
- Are enums, newtypes, and builders used where raw flags or ambiguous strings would leak meaning?
- Is borrowed output worth the lifetime complexity?

## Official Sources

- https://doc.rust-lang.org/book/ch06-02-match.html
- https://doc.rust-lang.org/book/ch13-02-iterators.html
- https://doc.rust-lang.org/std/iter/trait.Iterator.html
- https://doc.rust-lang.org/std/collections/hash_map/enum.Entry.html
- https://doc.rust-lang.org/std/borrow/enum.Cow.html
