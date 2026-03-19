# Verification Strategy

## Scope

Load this file when the main question is which verification layer to use or how to combine several of them without redundancy.
This file connects ordinary tests, property tests, fuzzing, loom, and Kani into one decision model.

## Tool Selection Rules

- Use ordinary example and regression tests for known edge cases and bug fixes that already have concrete reproductions.
- Use `proptest` when the bug model is "many structured inputs can violate an invariant".
- Use fuzzing when the bug model is "unstructured or adversarial byte streams should reach a parser or unsafe boundary".
- Use `loom` when the bug model is "a bad schedule or memory-order interleaving can break correctness".
- Use Kani when the bug model is "a bounded state space should satisfy a safety or correctness property for all cases".

## Combination Patterns

- Regression tests plus proptest: keep known examples explicit and let proptest search for new ones.
- Proptest plus fuzzing: use proptest for semantic structure and fuzzing for hostile boundary exploration.
- Loom plus ordinary tests: keep the production API tested normally and isolate only the concurrency core under loom.
- Kani plus regression tests: turn proof counterexamples into normal tests when possible.
- Do not expect one tool to replace the rest; each covers a different failure surface.

## Classic Mistakes

- Replacing hand-written regression tests with generated tests and losing readable examples.
- Using `proptest` for concurrency bugs that actually need schedule exploration.
- Pointing Kani at a large async or concurrent subsystem it does not model well.
- Treating fuzzing as proof, or treating proof as a substitute for integration tests.
- Building verification into CI without bounding runtime or choosing a stable subset of checks.

## Suggested Rollout

1. Keep normal unit and integration tests healthy.
2. Add proptest where functional invariants are obvious and bugs are input-shaped.
3. Add loom around the smallest risky synchronization core.
4. Add Kani around narrow critical logic, especially unsafe or arithmetic-heavy invariants.
5. Add scheduled or selective CI jobs rather than running every expensive verification layer on every change.

## Sources

- https://altsysrq.github.io/proptest-book/
- https://docs.rs/loom/latest/loom/
- https://model-checking.github.io/kani/
- https://rust-fuzz.github.io/book/

