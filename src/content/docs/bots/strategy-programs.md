---
title: Bot strategy programs
description: Run QuantFlow source directly in a strategy bot, with optional WASM modules.
---

# Bot strategy programs

Strategy-version legs accept `quantflow_bot_v1` programs. The bot worker runs
QuantFlow source directly, so a leg does not need a Rust build or WASM module.
WASM modules are optional extensions. Attach one only when the program declares
its alias with `module.start("alias")` and the leg pins that alias to a
successful module build.

The [QuantFlow-only example](#quantflow-only-example) below emits a grid action
without attaching a module. The MCP strategy guide includes the same source so
connector users can read it without an MCP resource reader.

## QuantFlow-only example

This complete source uses the `quantflow_bot_v1` runtime directly and emits a
grid action that the native backtest runtime can process:

```quantflow
fn main(signal):
    algo.grid.long(90, 110, 4, 0, $.bot.config.max_amount)
```

Pass the source inside the leg's program settings and omit `modules`:

```json
{
  "program": {
    "schema": "quantflow_bot_v1",
    "program": "<paste the QuantFlow source above>"
  }
}
```

## Indicators

Live bot programs can read indicators from the worker's local TA context. Use
an indicator call and select one of its outputs, for example:

```quantflow
// @program(timeframe=60)
fn main(signal):
    rsi = ta.rsi(14).value
    return rsi
```

See the [built-in TA indicator reference](../indicators/built-in-indicators/)
for every supported call, parameter shape, and output field.

The program timeframe is in seconds and selects the context for direct calls
such as `ta.rsi(14).value`. The worker prepares the required candle history and
calculates the current values locally; a property read does not call the
Market Data API. The native backtest path currently does not provide this live
TA context to QuantFlow programs.

Use an indicator handler to respond when a timeframe advances:

```quantflow
// @program(timeframe=60)
fn main(signal):
    return None

@on_indicator(60)
fn on_minute_candle():
    return ta.rsi(14).value
```

The annotation takes one positional timeframe in seconds. Direct indicator
calls in the handler use the program's declared default timeframe. Use
`ta.secure(...)` to select another available timeframe. The native backtest
path does not currently dispatch `@on_indicator` handlers.

## Events and entry points

Every bot program has an unannotated `fn main()` entry point. The worker
evaluates it when the bot initializes, with a null value if it declares one
parameter. It can also receive a strategy signal as that optional parameter.
Use annotated handlers for recurring live bot events; they are dispatched
when the matching event arrives:

| Handler | Parameters | Event |
| --- | --- | --- |
| `@on_market_decision` | none | A new market decision is available. |
| `@on_indicator(seconds)` | none | The selected candle timeframe has advanced. |
| `@on_position_opened` | `position` | A position opened. |
| `@on_position_closed` | `position` | A position closed. |
| `@on_position_update` | none | Position state changed. |
| `@on_order_update` | `order` | An order changed. |
| `@on_action("code")` | `values` | A configured leg action was requested. |

`@on_action("code")` codes correspond to the bot action definitions in that
leg's `actions` array. These definitions are separate from the strategy
version's `signal_settings`. The native backtest path currently invokes
`main(signal)` from its configured backtest action; it does not dispatch the
annotated event handlers above.

## Order and position functions

The live bot host provides these QuantFlow functions. They collect typed
actions for the worker to apply after the handler finishes:

- `position.get("long" | "short" | "both")` reads the current matching position.
- `position.open(direction, quantity[, price, order_type, note, mark])` opens a
  position. Direction is `long` or `short`; order type is `market`, `limit`, or
  `stop_market`.
- `position.close(direction[, reason])`, `position.cancel(direction)`, and
  `position.update_entry_price(direction, price)` manage positions.
- `position.set_stop_loss(direction, price)`,
  `position.set_take_profit(direction, price)`,
  `position.set_stop_loss_prc(direction, percent)`, and
  `position.set_take_profit_prc(direction, percent)` set protection values.
- `order.place(direction, side, quantity, price, mark[, reduce_only, note])`
  places an order. Side is `buy` or `sell`; `mark` identifies the order for
  later management.
- `order.cancel(mark)` cancels an order by its mark. `bot.stop()` stops the bot.

The native backtest path currently processes `algo.grid` outputs. It does not
process QuantFlow `position.*` or `order.*` action effects. See the
[QuantFlow-only example](#quantflow-only-example) above for a backtest-compatible
bot program.

## Create and backtest a version

Pass each leg's program as an object with the exact schema and source fields:

```json
{
  "program": {
    "schema": "quantflow_bot_v1",
    "program": "<complete QuantFlow source>"
  }
}
```

The leg's `modules` field may be omitted or set to `[]` for a QuantFlow-only
program. No `module.start` call is needed in that case.

To invoke `main(signal)` in a native backtest, define a version-level signal
action, for example `{"code":"grid_entry","name":"Grid entry"}`, and pass
the same code as `action_config.signal_action_code`. These action definitions
belong to version `signal_settings`; they are separate from leg `actions`.
KaraCat can run an unreleased pre-release version with
`run_lead_strategy_backtest`. Find the owned leader's ID with
`strategy_lead_list` (filter by `strategy_id`), then supply that
`strategy_leader_id`, the exact `strategy_version_id` returned when creating
the version, one to five exact symbol keys, start/end Unix timestamps in
milliseconds, and `action_config`:

```json
{
  "strategy_leader_id": 7,
  "strategy_version_id": 123,
  "start_time": 1760000000000,
  "end_time": 1760600000000,
  "symbols": [{ "symbol_key": "<exact symbol key>" }],
  "action_config": {
    "signal_action_code": "grid_entry",
    "action_params": {},
    "trigger": { "type": "AtTime", "time_ms": 1760000000000 },
    "direction": "long",
    "leverage": 20,
    "margin": 100
  }
}
```

Use the backtest call's returned `version_id` as `backtest_version_id` in
`list_backtest_runs`; use a returned run ID with `get_backtest_run` to inspect
that run. The native path invokes the bot's QuantFlow program but currently
executes only its supported grid effects.
