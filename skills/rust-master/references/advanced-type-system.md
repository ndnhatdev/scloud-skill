# Advanced Type System

## Scope

Load this file for associated types, generic associated types (GATs), higher-ranked trait bounds (HRTBs), const generics, and advanced generic API design.
See also [design-and-tooling.md](design-and-tooling.md) for baseline trait design and object-safety choices.
See also [diagnostics-and-type-errors.md](diagnostics-and-type-errors.md) for the compiler errors these features often trigger.

## Associated Types

- Prefer associated types when an implementation should choose one logical output type once.
- Prefer generic trait parameters when the same trait should be implementable multiple times for different type arguments.
- Associated types usually make call sites and trait bounds shorter than threading extra generic parameters everywhere.

## GATs

- Use GATs when an associated type family must depend on a lifetime, type, or const parameter.
- GATs are especially useful for lending or borrowing APIs where the yielded type borrows from `self`.
- Do not reach for GATs just because they are expressive; many APIs are clearer with owned outputs or simple iterators.

## HRTBs

- Use higher-ranked trait bounds like `for<'a>` when a closure, function, or trait bound must work for any borrow lifetime.
- HRTBs are common around callback-style APIs and traits over references.
- If the bound becomes hard to explain, reconsider whether the API boundary should own data instead.

## Const Generics

- Use const generics when a value is part of the type-level contract, such as array length, protocol width, or fixed buffer size.
- Keep public const-generic APIs simple; the syntactic and inference edges are real.
- Prefer runtime values when the constant does not materially improve safety or specialization.

## Review Checklist

- Is the advanced generic feature expressing a real invariant, or only showing off type-level cleverness?
- Would an associated type simplify repeated generic arguments?
- Is a GAT really needed, or would an owned output or simpler iterator remove complexity?
- Does a `for<'a>` bound model "works for any borrow" rather than one specific borrow?
- Does a const-generic parameter belong in the type, or should it stay a runtime value?

## Sources

- https://doc.rust-lang.org/book/ch20-02-advanced-traits.html
- https://doc.rust-lang.org/reference/items/associated-items.html
- https://doc.rust-lang.org/reference/trait-bounds.html
- https://doc.rust-lang.org/reference/items/generics.html
- https://doc.rust-lang.org/nomicon/hrtb.html

