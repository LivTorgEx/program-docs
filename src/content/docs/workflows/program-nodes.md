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

## Using screener results

A workflow `market_data` node can run `screener_query` against public market
data. Its input is the screener request (`expression`, optional indicator
columns and sort, and pagination); its output contains `page`, `page_size`,
`total_matches`, and a `matches` array. The query does not need provider
credentials.

Workflow Program nodes do not automatically receive the bot runtime's `ta`
context. The market-data node evaluates the screener expression and passes its
response to the next node.

Use `expression` to filter symbols and `indicators` to include calculated
values in each match. Indicator names, parameters, and output fields are listed
in the [built-in TA indicator reference](../indicators/built-in-indicators/).
Screener filters are sent as a typed `ScreenerExpression` AST. For example,
this request selects symbols where the 60-second RSI is above 50, and includes
that RSI value in each result:

```json
{
  "expression": {
    "type": "Operation",
    "operation": ">",
    "left": {
      "type": "Indicator",
      "name": "rsi",
      "parameters": [{ "type": "Number", "value": 14 }],
      "output": "value",
      "timeframe": 60
    },
    "right": { "type": "Number", "value": 50 }
  },
  "indicators": [
    { "name": "rsi", "parameters": [14], "output": "value", "timeframe": 60 }
  ],
  "page": 1,
  "page_size": 10
}
```

Each match contains its exact `symbol_key`, requested indicator values, and
`ntp_5s`, which is `null` when unavailable. An indicator value includes its
`name`, `parameters`, `output`, `timeframe` in seconds, and `value`, which can
be `null` when unavailable:

```json
{
  "page": 1,
  "page_size": 10,
  "total_matches": 1,
  "matches": [
    {
      "symbol_key": "<exact symbol key>",
      "indicators": [
        {
          "name": "rsi",
          "parameters": [14],
          "output": "value",
          "timeframe": 60,
          "value": 54.2
        }
      ],
      "ntp_5s": null
    }
  ]
}
```

The screener response is not injected into a global variable. Connect the
screener node to a Program node; the raw response becomes that node's
`arguments`, so the program can read matches with `$.arguments.matches`.
Alternatively, use the edge's `input_mapping` to select the `matches` field
while preserving a named argument:

```json
{
  "input_mapping": [
    { "source": "matches", "target": "matches" }
  ]
}
```

The Program can then read each returned record from `$.arguments.matches`.
`page` and `page_size` return one page only; issue another screener node
request with the next page number to fetch more matches.

## Host-specific functions

The standard QuantFlow built-ins are available to workflow programs. A host may
also register additional functions. Those calls are available only in that
host and are not portable unless another host provides the same function and
contract.

See [syntax](../language/syntax/) and [built-ins](../language/built-ins/) for
language-level details.
