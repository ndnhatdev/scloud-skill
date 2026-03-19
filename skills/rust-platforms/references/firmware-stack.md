# Firmware Stack

## Scope

Load this file when the real problem is the whole firmware shape: board bring-up, app layering, logging or flashing workflow, Embassy integration, and ownership of hardware resources across tasks and interrupts.

## Canonical Shape

- Start from target and board reality first: target triple, linker script, chip support, probe or flashing path.
- Put startup and board initialization in one explicit bootstrap path.
- Keep hardware ownership in one layer and pass narrow handles downward.
- Separate PAC/HAL/BSP concerns from application behavior.
- Use Embassy only where async helps coordination or power behavior; not every peripheral interaction must become a task.
- Make logging, panic behavior, and flashing/debug workflow part of the architecture, not afterthoughts.

## Bootstrap Order

1. Select target and target-specific toolchain support.
2. Define memory and linker expectations where the platform requires them.
3. Initialize board or chip peripherals.
4. Set up logging, panic strategy, and runner or flashing workflow.
5. Start executor or main loop.
6. Spawn or enter long-lived tasks with explicit ownership of resources.

## Review Checklist

- Is the target, chip, and memory configuration explicit and reproducible?
- Is the firmware layered cleanly across HAL/BSP/application boundaries?
- Are task and interrupt ownership rules obvious?
- Is the flashing/debug/logging path documented in code or config, not tribal knowledge?
- Is async used where it helps, not sprayed across all hardware interaction?

## Sources

- https://docs.rust-embedded.org/book/
- https://docs.rust-embedded.org/book/intro/no-std.html
- https://docs.rust-embedded.org/embedonomicon/memory-layout.html
- https://embassy.dev/book/

