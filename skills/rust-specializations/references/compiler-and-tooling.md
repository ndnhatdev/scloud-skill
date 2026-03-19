# Compiler and Tooling

## Scope

Load this file for rustc internals, compiler architecture, HIR or MIR reasoning, the query system, and contribution-style debugging of compiler behavior.
Use `rust-master` for ordinary type-system or API-level explanations that do not depend on compiler internals.

## Core Rules

- Start with the compiler pipeline at the right level: parsing, HIR, MIR, borrow checking, codegen, or diagnostics.
- MIR is often the right level for reasoning about borrow checking, drops, and many optimizations.
- rustc is query-driven; work is structured around on-demand computations rather than one giant linear pass.
- Compiler changes must respect diagnostics quality, incremental behavior, and existing abstractions as much as correctness.
- Prefer reading the dev guide's architecture and relevant subsystem chapter before trying to infer behavior from source layout alone.

## Review Checklist

- Is the problem really in parsing, lowering, HIR, MIR, or codegen?
- Is the query or pass boundary clear?
- Are diagnostics and spans part of the design, not an afterthought?
- Is the change aligned with existing rustc abstractions instead of bypassing them?
- Is the investigation grounded in the dev guide rather than guesswork from directory names?

## Sources

- https://rustc-dev-guide.rust-lang.org/overview.html
- https://rustc-dev-guide.rust-lang.org/compiler-src.html
- https://rustc-dev-guide.rust-lang.org/query.html
- https://rustc-dev-guide.rust-lang.org/mir/index.html
- https://rustc-dev-guide.rust-lang.org/diagnostics.html

