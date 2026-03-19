# Proptest

## Scope

Load this file for property-based testing with `proptest`: strategies, shrinking, generator design, and choosing properties that reveal real functional bugs.
Use `rust-master` for ordinary unit-test organization that does not depend on property testing.

## Core Rules

- Test semantic invariants, not just random inputs.
- Strategy quality matters more than raw case count.
- Prefer strategies that generate valid structured values directly instead of generating junk and filtering it out.
- Shrinking is part of the design: the failing case should become small enough to explain the bug.
- Turn minimized failing inputs into ordinary regression tests after a failure is found.

## Review Checklist

- Is the property stronger than the implementation details it is meant to protect?
- Does the strategy model valid input space directly?
- Is filtering hiding a bad generator design?
- Will the shrunk case still be interpretable by humans?
- Are discovered failures converted into stable regression coverage?

## Senior Heuristics

- Start from a simple algebraic property, round-trip property, or reference-implementation comparison.
- Use custom strategies when input structure carries business meaning; default arbitrary generation is often too weak.
- Avoid asserting multiple unrelated properties in one test if the failure would be ambiguous.
- Keep explicit example tests for important edge cases even when proptest exists.
- When proptest keeps finding enormous inputs, the generator or shrink story usually needs work.

## Sources

- https://altsysrq.github.io/proptest-book/
- https://docs.rs/proptest/latest/proptest/
- https://altsysrq.github.io/proptest-book/proptest/tutorial/shrinking-basics.html
- https://altsysrq.github.io/proptest-book/proptest/tutorial/transforming-strategies.html

