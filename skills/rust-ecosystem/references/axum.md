# Axum

## Scope

Load this file for Axum router composition, state flow, extractor rules, middleware placement, and response or rejection design.
Use `rust-master` for compiler diagnostics or ownership questions hiding behind handler signatures.
See also [service-stack.md](service-stack.md) for startup order, app state, and end-to-end request flow.

## Core Rules

- Keep handlers thin; business logic should live in services, not in the extractor list.
- Treat `Router<S>` state as an architecture boundary. Keep one top-level app state and derive substates with `FromRef` when needed.
- Remember extractor order: body-consuming extractors must be last, and the body cannot be consumed twice.
- Map domain errors into `IntoResponse` at the HTTP boundary instead of leaking HTTP concerns through core logic.
- Use middleware and layers for cross-cutting concerns such as auth, tracing, request IDs, and timeouts.
- Be careful with shared mutable state in handlers; sync mutexes held across `.await` produce `!Send` futures that Axum cannot run.

## Integration Notes

- Put tracing request spans and correlation IDs at the router or middleware boundary, not ad hoc inside every handler.
- Inject SQLx pools or services through app state, not by recreating resources inside handlers.
- Convert domain errors to HTTP in one place so repository and domain code stay protocol-agnostic.
- When composing routers, make state types explicit early if modules live in separate scopes.

## Review Checklist

- Is the handler doing orchestration only, or is too much domain logic embedded in it?
- Are extractors ordered correctly, with body consumers last?
- Is router state explicit and consistent across nested or merged routers?
- Are errors mapped consistently into status codes and response bodies?
- Would a substate reduce cloning and improve module boundaries?
- Is the body extracted only once, with `State` and other parts-based extractors placed before it as Axum requires?

## Sources

- https://docs.rs/axum/latest/axum/struct.Router.html
- https://docs.rs/axum/latest/axum/extract/index.html
- https://docs.rs/axum/latest/axum/extract/struct.State.html
- https://docs.rs/axum/latest/axum/response/trait.IntoResponse.html
