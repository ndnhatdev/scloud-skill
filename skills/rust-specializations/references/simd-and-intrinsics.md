# SIMD and Intrinsics

## Scope

Load this file for architecture-specific intrinsics, target-feature detection, runtime dispatch, and the current status of portable SIMD.
Use `rust-master` for general performance methodology before going this low-level.

## Core Rules

- Prefer ordinary algorithms and data-layout improvements before intrinsics.
- Use `std::arch` when you need stable architecture-specific intrinsics.
- Gate code with compile-time `target_feature` or runtime feature detection where the CPU set is not fixed.
- Keep a correct scalar fallback unless the deployment target is tightly controlled.
- `std::simd` or portable SIMD remains a nightly-only experimental API as checked on 2026-03-19; treat it as evolving.

## Review Checklist

- Was the hotspot measured before introducing intrinsics?
- Is the target feature requirement explicit?
- Is there a safe fallback path where runtime dispatch is needed?
- Is architecture-specific code isolated and documented?
- Is nightly-only SIMD status being acknowledged instead of assumed stable?

## Sources

- https://doc.rust-lang.org/std/arch/index.html
- https://doc.rust-lang.org/std/macro.is_x86_feature_detected.html
- https://doc.rust-lang.org/core/arch/index.html
- https://doc.rust-lang.org/beta/std/simd/struct.Simd.html

