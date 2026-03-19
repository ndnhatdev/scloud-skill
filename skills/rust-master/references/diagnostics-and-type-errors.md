# Diagnostics and Type Errors

## Scope

Load this file for Rust compiler-error triage: borrow-checker failures, type mismatches, trait-bound errors, object-safety and coherence failures, `Send`/`Sync` problems, and practical debug flow with `cargo check` and `rustc --explain`.
See also [foundations.md](foundations.md) for ownership and lifetime rules behind borrow errors.
See also [concurrency.md](concurrency.md) for `Send`/`Sync`, async, and lock-related diagnostics.
See also [design-and-tooling.md](design-and-tooling.md) for trait and API design that prevents many of these errors.

## Triage Workflow

1. Start with `cargo check` for the fastest feedback loop. It skips final codegen, so it is usually faster than `cargo build`, but remember that some diagnostics only appear during code generation.
2. Read the first hard error, not the last cascade. Later messages are often fallout.
3. Capture the error code if present and run `rustc --explain CODE`.
4. Separate the problem family before editing:
   - ownership or borrow conflict
   - lifetime relation or borrowed output
   - type mismatch or inference hole
   - missing trait bound or wrong receiver type
   - object-safety or coherence/orphan-rule issue
   - `Send` or `Sync` requirement failure in thread or async contexts
5. Fix the design at the boundary where the compiler is complaining, not by scattering `clone()`, `Box`, or annotations downstream.

## Common Compiler Error Families

### Ownership and Borrowing

- `E0382`: use after move
- `E0499`: cannot borrow as mutable more than once
- `E0502`: cannot borrow as mutable because it is also borrowed as immutable
- `E0507`: cannot move out of borrowed content
- `E0597`: borrowed value does not live long enough

Typical fix direction:
- shorten scopes
- split reads from writes
- borrow instead of move
- return owned data instead of borrowed data
- restructure state so one owner is obvious

### Type Mismatch and Inference

- `E0308`: mismatched types
- `E0282` / `E0283`: type annotations needed / type inference failure
- `E0107`: wrong number of generic arguments
- `E0412` / `E0433`: type or path not found

Typical fix direction:
- inspect the concrete type expected at the boundary
- annotate the smallest useful local binding, turbofish, or generic argument
- normalize conversions with `From`, `Into`, `AsRef`, `TryFrom`, or explicit constructors
- avoid mixing borrowed and owned string/path types casually

### Trait Bounds, Method Resolution, and Object Safety

- `E0277`: trait bound not satisfied
- `E0599`: no method found for this type
- `E0038`: trait is not dyn compatible
- `E0117` / `E0119` / `E0210`: orphan or overlapping impl problems

Typical fix direction:
- add the missing bound where the generic promise is made
- check whether the method exists on `T`, `&T`, `&mut T`, smart pointers, or an iterator item
- decide whether the API wants generics, `impl Trait`, `dyn Trait`, or an enum
- move impl ownership into the crate that owns either the trait or the type, or add a newtype

### Concurrency and Async Diagnostics

- future is not `Send`
- borrowed data escapes into `'static` task requirements
- lock guard held across `.await`
- `Rc<T>` or `RefCell<T>` appears in cross-thread or spawned async paths

Typical fix direction:
- isolate non-`Send` state from spawned work
- move to `Arc<T>` and thread-safe inner state only when sharing is truly needed
- keep guards scoped before `.await`
- use owned task inputs instead of capturing short-lived borrows

## Practical Debug Heuristics

- If many errors appear after a signature change, fix the signature first.
- If the compiler suggests a clone, treat that as one possible local repair, not as proof that cloning is architecturally right.
- If a lifetime annotation seems to multiply through the API, test whether an owned boundary is cheaper overall.
- If a method is "missing", check imports, trait scope, autoderef, and iterator item types before redesigning the type.
- If async code asks for `Send`, inspect everything captured into the future, not just the final line that fails.

## Review Checklist

- Is this the first real error, or a cascade error?
- Which family is this: ownership, lifetime, type, trait, object safety, coherence, or concurrency?
- Would a signature or ownership redesign remove multiple downstream errors at once?
- Is the current fix hiding the compiler message instead of solving the model mismatch?
- Should the workflow use `cargo check`, `rustc --explain`, or JSON diagnostics for tooling and editor integration?

## Official Sources

- https://doc.rust-lang.org/error_codes/error-index.html
- https://doc.rust-lang.org/rustc/command-line-arguments.html#--explain-opt-code
- https://doc.rust-lang.org/cargo/commands/cargo-check.html
- https://doc.rust-lang.org/reference/trait-bounds.html
- https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility
- https://doc.rust-lang.org/rustc/json.html#diagnostics
