# Packaging and Release

## Scope

Load this file for `dist` workflow, generated release CI, installers, GitHub Releases, and artifact planning.
Use this file once the build matrix is mostly known and the question is about repeatable shipping rather than just building.

## Core Rules

- Treat `dist` as a release pipeline generator and packaging layer, not as a substitute for understanding how each target is built.
- Stabilize the target and artifact matrix before auto-generating CI and installers.
- Keep release inputs explicit: tag format, changelog source, artifact naming, supported platforms, and installer types.
- Separate versioning policy from artifact production, even if the tools can cooperate.
- Review generated CI as source code; do not treat it as opaque magic.

## Review Checklist

- Is the project actually ready for automated release generation?
- Are supported targets and installers explicitly declared?
- Is there a clear tag-triggered release story?
- Does the repo own changelog and release-note inputs in a stable way?
- Are platform-native follow-up steps like signing or notarization modeled somewhere?

## Senior Heuristics

- `dist` is most valuable once the build plan is stable enough that generated CI reduces toil instead of hiding confusion.
- Let the release system generate artifacts, but keep human-readable release policy in the repo.
- Start with the fewest supported targets that you can realistically test and support.
- Artifact names, archive structure, and installer behavior are part of your public API once users automate around them.
- Generated CI should still be understandable by the team that owns releases.

## Sources

- https://github.com/axodotdev/cargo-dist
- https://axodotdev.github.io/cargo-dist/book/
- https://axodotdev.github.io/cargo-dist/book/workspaces/simple-guide.html
- https://axodotdev.github.io/cargo-dist/book/reference/config.html

