---
title: Documentation validation
description: Build the docs site and keep examples aligned with QuantFlow.
---

# Documentation validation

The documentation is authored as Markdown under
[`src/content/docs/`](https://github.com/LivTorgEx/program-docs/tree/main/src/content/docs).
Starlight turns those files into pages, generates navigation from the folder
structure, and builds a local full-text search index.

## Preview and build

From the `program-docs` repository:

```sh
pnpm install
pnpm dev
```

Build the static site before publishing:

```sh
pnpm build
```

The output is written to `dist/`. The GitHub Pages workflow builds and deploys
the site when changes reach `main`.

## Validate against the runtime

The docs repository builds the site whenever documentation changes. The Rust
repository runs the QuantFlow compiler checks because its source is private:
it checks every fenced `quantflow` example and compares the documented
built-in names with the Rust function registry. It runs when QuantFlow changes
and once a day, so docs-only changes are picked up by the next scheduled run.

To check a documentation change immediately, dispatch the
`Validate QuantFlow documentation` workflow in `LivTorgEx/trading-platform-rust`.

When changing syntax or a built-in, update the relevant page in the same
change. The validator expects the built-in list to be enclosed by the
`QUANTFLOW_BUILTINS_START` and `QUANTFLOW_BUILTINS_END` markers in
[`language/built-ins.md`](../language/built-ins/).
