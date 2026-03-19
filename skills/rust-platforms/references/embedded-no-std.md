# Embedded no_std

## Scope

Load this file for embedded Rust without the standard runtime: `#![no_std]`, startup and linker layout, interrupts, critical sections, PAC/HAL/BSP layering, and memory-mapped peripherals.
Use `rust-master` for general unsafe and ownership rules underneath these patterns.
See also [tooling-and-debugging.md](tooling-and-debugging.md) for probe-based flashing, logging, and target validation.
See also [platform-lessons.md](platform-lessons.md) for testing and critical-section heuristics from the community.

## Core Rules

- `#![no_std]` means you are building against `core`, not the full standard runtime.
- Treat the target's memory map, startup path, and linker configuration as part of the program design.
- Keep hardware access behind PAC/HAL/BSP or other narrow abstractions rather than scattered register writes.
- In interrupt-driven code, model concurrency explicitly; interrupt handlers and main code are concurrent actors.
- Keep critical sections short and justified; they trade safety for latency and jitter.
- Distinguish between "logic that can stay platform-agnostic" and "platform glue that must know about hardware."

## Layering Rules

- PAC: register-level peripheral access
- HAL: safer peripheral operations
- BSP: board-specific pin and device wiring
- Application: behavior and orchestration

## Review Checklist

- Is the crate truly `no_std`, or are `std` assumptions sneaking in through dependencies or examples?
- Is the linker or memory layout explicit where the target needs it?
- Are interrupt-shared resources synchronized with the right primitive or abstraction?
- Is unsafe register or startup code isolated and documented?
- Are PAC/HAL/BSP boundaries clear, or is application logic tangled with hardware details?

## Sources

- https://docs.rust-embedded.org/book/
- https://docs.rust-embedded.org/book/intro/no-std.html
- https://docs.rust-embedded.org/book/peripherals/index.html
- https://docs.rust-embedded.org/book/start/interrupts.html
- https://docs.rust-embedded.org/book/concurrency/
- https://docs.rust-embedded.org/embedonomicon/
- https://docs.rust-embedded.org/embedonomicon/memory-layout.html
