# Kernel and Drivers

## Scope

Load this file for Rust for Linux, kernel-driver architecture, kernel constraints, and the special rules that apply when Rust lives inside the Linux kernel.
Use `rust-platforms` for generic embedded or firmware concerns that are not Linux-kernel specific.

## Core Rules

- Kernel Rust is a specialized environment with its own policy, abstraction layers, and unstable-feature constraints.
- Keep unsafe details inside kernel abstractions; drivers should prefer the safe APIs exposed by the `kernel` crate where possible.
- Driver design must respect context rules such as sleeping versus non-sleeping code, locking rules, and kernel object lifetimes.
- Treat Rust for Linux as a moving target with an explicit version and unstable-feature policy.
- Read reference drivers and project policy before designing out-of-tree abstractions that fight the direction of the project.

## Review Checklist

- Is the code using kernel abstractions instead of re-creating unsafe bindings ad hoc?
- Are unstable features or kernel-specific constraints clearly localized?
- Does the design respect locking, sleep, and context rules?
- Is the driver surface narrow and aligned with existing subsystem expectations?
- Is the investigation grounded in Rust for Linux policy and reference drivers?

## Sources

- https://rust-for-linux.com/
- https://rust-for-linux.com/unstable-features
- https://rust-for-linux.com/asix-phy-driver
- https://rust-for-linux.com/contact
- https://rust-for-linux.com/klint

