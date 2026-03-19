# Serde

## Scope

Load this file for Serde payload design, derive attributes, enum representations, defaults, flattening, rename strategy, and custom serialize or deserialize hooks.
Use `rust-master` for generic trait-system reasoning or lifetime-heavy zero-copy discussions.

## Core Rules

- Model the wire format first, then choose Serde attributes that make the Rust type match it clearly.
- Prefer derive plus attributes before writing manual `Serialize` or `Deserialize`.
- Use `rename_all`, `rename`, `alias`, `default`, and `skip_serializing_if` to preserve compatibility without hiding meaning.
- Choose enum representation deliberately:
  - externally tagged for Rust-first or strongly typed formats
  - internally or adjacently tagged for many JSON APIs
  - untagged only when you truly need shape-based matching and can tolerate worse errors and extra cost
- Be careful with `flatten`; it changes payload shape and does not combine with `deny_unknown_fields`.
- Use `try_from`, `from`, or custom deserialize hooks when validation belongs at the type boundary.

## Review Checklist

- Is the selected enum representation explicit and stable for the API?
- Are defaults and aliases being used for real compatibility, not to mask a broken contract?
- Does `flatten` make the payload clearer, or just blur boundaries?
- Would a dedicated wire type plus conversion be clearer than stuffing validation into Serde attributes?
- Is `untagged` being used despite weak errors or measurable parse cost?

## Sources

- https://serde.rs/container-attrs.html
- https://serde.rs/field-attrs.html
- https://serde.rs/enum-representations.html
- https://serde.rs/custom-serialization.html

