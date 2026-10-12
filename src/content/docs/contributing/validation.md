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

CI checks every fenced `quantflow` example with the current compiler and checks
that the documented built-in names match the Rust function registry. The
validation runs from both repositories:

- A docs change checks out `LivTorgEx/trading-platform-rust` and validates this
  content against its current QuantFlow crate.
- A QuantFlow implementation change checks out this repository and validates
  the public reference against the changed crate.

When changing syntax or a built-in, update the relevant page in the same
change. The validator expects the built-in list to be enclosed by the
`QUANTFLOW_BUILTINS_START` and `QUANTFLOW_BUILTINS_END` markers in
[`language/built-ins.md`](../language/built-ins/).
