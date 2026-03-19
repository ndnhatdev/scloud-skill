# Systems Interop

## Scope

Load this file for pinning, `Pin` and `Unpin`, `Future::poll`, FFI, ABI/layout, `repr` attributes, `CStr`/`CString`, and `no_std`.
See also [concurrency.md](concurrency.md) for async design above the pinning layer.
See also [design-and-tooling.md](design-and-tooling.md) for unsafe boundaries and API encapsulation.

## Pinning

- `Pin<Ptr>` matters only for address-sensitive values.
- Most types are `Unpin`; pinning is mainly relevant when implementing futures, self-referential machinery, or intrusive data structures.
- `Future::poll` takes `Pin<&mut Self>` because some futures rely on stable location for soundness.
- Do not expose pinning in public APIs unless the invariants actually require it.

## FFI and ABI

- Use `unsafe extern "C"` for C ABI boundaries and keep raw FFI surfaces narrow.
- Wrap raw pointers, lengths, and return codes in safe Rust APIs as quickly as possible.
- `CStr` and `CString` are the standard boundary types for nul-terminated strings.
- Treat ABI declarations as unsafe contracts; Rust cannot verify that your signatures match the foreign library.

## Layout and `repr`

- `repr(C)` is for interoperable layout, not for general performance folklore.
- `repr(transparent)` is the right tool for ABI-compatible newtype wrappers.
- Be cautious with `repr(packed)`: creating references to packed fields is dangerous; copy values out instead.
- Do not assume Rust’s default layout is stable for FFI or serialization.

## `no_std`

- `#![no_std]` links against `core` instead of `std`.
- Use `alloc` only when a suitable allocator exists for the target.
- `no_std` is the default direction for firmware, kernels, bootloaders, and other environments without the standard runtime.
- Prefer keeping reusable core logic `std`-light even if the final binary is not `no_std`.

## Review Checklist

- Is pinning being used because a value is truly address-sensitive?
- Is the raw FFI surface minimal and wrapped by a safe boundary?
- Is the chosen `repr` attribute solving a real ABI or layout requirement?
- Are packed-field references or invalid layout assumptions sneaking into unsafe code?
- Is code advertised as `no_std` actually free of hidden `std` assumptions?

## Sources

- https://doc.rust-lang.org/std/pin/
- https://doc.rust-lang.org/std/future/trait.Future.html
- https://doc.rust-lang.org/nomicon/ffi.html
- https://doc.rust-lang.org/reference/type-layout.html
- https://doc.rust-lang.org/beta/std/ffi/struct.CString.html
- https://doc.rust-lang.org/std/ffi/struct.CStr.html
- https://docs.rust-embedded.org/book/intro/no-std.html
