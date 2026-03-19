# Foundations

## Scope

Load this file for ownership, borrowing, lifetimes, and smart-pointer selection.

## Ownership and Borrowing

- Start by identifying who owns each value and how long it must live.
- Prefer borrowed inputs like `&str`, `&[T]`, and `&Path` unless the callee must keep ownership.
- Use `&T` for shared reads and `&mut T` for exclusive mutation.
- Use `clone()` only when another owned copy is genuinely needed and the cost is acceptable.
- Replace index-heavy designs with slices, iterators, or scoped borrows where possible.

### Reject Early

- adding `clone()` only to silence the borrow checker
- returning references to local temporaries
- keeping mutable and immutable borrows alive longer than needed

## Lifetimes

- Lifetimes describe relationships between borrows. They do not extend value lifetime.
- Add explicit lifetime parameters only when input-output borrow relations are not obvious.
- If the signature becomes lifetime-heavy, reconsider the API and ask whether owned output is clearer.
- Avoid long-lived borrowed fields in application state unless zero-copy is a measured requirement.
- Treat self-referential structures as advanced; prefer owned storage plus handles or indices.

### Useful Heuristic

- If the caller needs independence, return an owned value.
- If the output is just a view into existing input, return a borrow.

## Smart Pointers and Interior Mutability

### `Box<T>`

- Use for heap indirection.
- Use for recursive types.
- Use for owned trait objects.

### `Rc<T>`

- Use for shared ownership in single-threaded graphs or trees.
- Do not use across threads.

### `Arc<T>`

- Use for shared ownership across threads or async tasks.
- Add `Mutex<T>`, `RwLock<T>`, or atomics only if mutation is required.

### `Cell<T>` and `RefCell<T>`

- Prefer `Cell<T>` for small replaceable values.
- Use `RefCell<T>` only for single-threaded runtime borrow checking.
- Do not use `RefCell<T>` as a default escape hatch when a design can be restructured.

### `Weak<T>`

- Use to break `Rc<T>` or `Arc<T>` cycles.

## Selection Rules

- Pick `Box<T>` for ownership plus indirection.
- Pick `Rc<T>` for single-thread shared ownership.
- Pick `Arc<T>` for cross-thread shared ownership.
- Pick `Cell<T>` for simple interior replacement.
- Pick `RefCell<T>` for single-thread runtime borrow enforcement.

## Review Checklist

- Is ownership clear without relying on comments?
- Is borrowing sufficient where ownership is currently taken?
- Is a smart pointer solving a real problem or hiding an unclear model?
- Is `RefCell<T>` replacing a design that should be refactored instead?
- Is there any cycle risk that needs `Weak<T>`?

## Official Sources

- https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html
- https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
- https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html
- https://doc.rust-lang.org/book/ch15-01-box.html
- https://doc.rust-lang.org/book/ch15-04-rc.html
- https://doc.rust-lang.org/book/ch15-05-interior-mutability.html
- https://doc.rust-lang.org/stable/std/cell/index.html
- https://doc.rust-lang.org/std/sync/struct.Arc.html
