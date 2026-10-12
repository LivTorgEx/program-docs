---
title: Workflow Program nodes
description: Inputs, outputs, and host contracts for workflow programs.
---

# Workflow Program nodes

Workflow **Program** nodes run QuantFlow against the input supplied by the
workflow engine. The exact value shape is part of the workflow contract; it is
not a global QuantFlow variable schema.

## Available context

The workflow host provides these top-level values:

- `run_input`: data passed into the workflow run.
- `run_context`: data shared by the workflow run.
- `cursor_context`: data associated with the current cursor.
- `arguments`: the current node's input value.

For example, read a value mapped into the node's arguments with:

```quantflow
quantity = $.arguments.quantity
return quantity
```

## Input and output schemas

The optional `input_schema` validates the node arguments before execution.
The optional `output_schema` validates the program's returned value. Programs
should return the output shape expected by the next workflow node.

See the
[workflow format and node schemas](https://github.com/LivTorgEx/trading-platform-rust/blob/main/api_mcp/resources/strategy_workflow_format.md)
for the current workflow contract, mappings, and schemas.

## Host-specific functions

The standard QuantFlow built-ins are available to workflow programs. A host may
also register additional functions. Those calls are available only in that
host and are not portable unless another host provides the same function and
contract.

See [syntax](../language/syntax/) and [built-ins](../language/built-ins/) for
language-level details.
