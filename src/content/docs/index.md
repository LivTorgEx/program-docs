---
title: QuantFlow programs
description: Write bounded programs for LivTorgEx integrations and analysis.
---

# QuantFlow programs

QuantFlow is a small, restricted language for writing programs that run inside
LivTorgEx. A host compiles the source into a program and controls the input,
available functions, and execution:

```text
source text → QuantFlow compiler → program → host-controlled execution
```

Programs are designed for focused transformations and decisions. They can read
the value supplied by their host, use registered functions, and return a
result. They cannot import modules, run loops, define classes, or execute
arbitrary code.

## Choose a guide

- [Get started](getting-started/) with a small analysis program.
- Learn [QuantFlow syntax](language/syntax/) and the [built-in functions](language/built-ins/).
- See the input contract for [workflow Program nodes](workflows/program-nodes/).
- Read the current direction for [signal programs](signals/overview/).
- Embed the compiler and runtime with the [Rust integration guide](rust/integration/).

## Where it is used

QuantFlow is currently used by API mappings and workflow **Program** nodes.
For signal and bot logic, the planned authoring interface is QuantFlow. We do
not plan a separate declarative rule format for those programs.

## Signal analysis status

The signal service is not implemented yet. The first version is intended to
calculate supported indicators in the Rust host with `ta-rs`, then pass the
needed values to QuantFlow for a small decision such as detecting a price
crossing an indicator line. The language and runtime currently have no
indicator-service input contract, signal-emission API, or MRC host integration.

See [Signal programs](signals/overview/) for the boundary between the current
runtime and that planned service.
