# Macros and Metaprogramming

## Scope

Load this file for `macro_rules!`, declarative macros, proc macros, derives, attribute macros, and compile-time code generation tradeoffs.
See also [performance-and-validation.md](performance-and-validation.md) for compile-time cost and `cargo expand`.
See also [diagnostics-and-type-errors.md](diagnostics-and-type-errors.md) for macro-generated compiler-error triage.

## `macro_rules!`

- Prefer `macro_rules!` for local syntactic repetition or API sugar that does not require parsing Rust semantics.
- Keep matchers narrow and expansions simple enough that generated code is still debuggable.
- Favor helper functions, traits, and generics before macros when ordinary Rust can express the pattern.

## Procedural Macros

- Use proc macros when you need syntax-aware code generation: custom derives, attributes, or function-like macros.
- Proc macros must live in a `proc-macro` crate and operate on token streams, not arbitrary AST internals.
- Report errors with `compile_error!`-style output or precise spans; a panic is a last resort.
- Remember that proc macros run during compilation and carry the same security and environment concerns as build scripts.

## Design Rules

- Choose the smallest metaprogramming tool that solves the problem: function, trait, `macro_rules!`, then proc macro.
- Generated code is part of your public ergonomics. Error messages and spans matter as much as the generated implementation.
- Treat proc macros as compile-time dependencies with real build-time cost.

## Review Checklist

- Could a function, trait, or generic implementation replace this macro cleanly?
- Is `macro_rules!` enough, or is a proc macro truly required?
- Do generated errors point users at the right source spans?
- Is the macro hiding too much control flow or allocation behavior?
- Has the expansion been inspected with `cargo expand` when behavior is surprising?

## Sources

- https://doc.rust-lang.org/reference/macros.html
- https://doc.rust-lang.org/stable/reference/procedural-macros.html
- https://doc.rust-lang.org/book/ch20-05-macros.html

