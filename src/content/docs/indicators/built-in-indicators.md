---
title: Built-in TA indicators
description: Indicator calls and outputs available to QuantFlow bot programs.
---

# Built-in TA indicators

This page lists the built-in indicators available through the bot runtime's
host-specific `ta` namespace. Direct indicator calls need a program timeframe
in seconds and read the worker's local candle history:

```quantflow
// @program(timeframe=60)
fn main(signal):
    return ta.rsi(14).value
```

The same built-in indicator calculator is used by workflow screener queries.
Workflow nodes use a typed `ScreenerExpression` for filters and can request
indicator values as columns; see
[screener results in workflow programs](../workflows/program-nodes/#using-screener-results).

## Indicators

All indicator parameters must be positive finite numbers. Integer period
parameters must be whole numbers from 1 through 2000. Output names below are
the properties selected after the indicator call.

The Market Data screener server currently seeds these baseline parameter
combinations:

| Indicator | Baseline parameters |
| --- | --- |
| `ema` | `9`, `20`, `21`, `26`, `200` |
| `natr` | `14`, `30` |
| `rsi` | `14` |
| `mfi` | `14` |
| `cci` | `20` |
| `mrc` | `200` |
| `volume` | `50` |
| `sar` | No baseline preset |
| `chandelierexit` | No parameters |
| `bollingerbands` | `20` |
| `stoch` | `14`, `1`, `3` |
| `emacross` | `9`, `26` |

These are screener baseline configurations, not implicit QuantFlow arguments.
Pass the parameters explicitly in a bot call or workflow screener request;
for example, `ta.rsi(14).value`. `sar` supports one positive integer parameter
or three parameters: a positive integer followed by positive acceleration and
maximum-acceleration values.

| Indicator call | Outputs |
| --- | --- |
| `ta.ema(period)` | `value` |
| `ta.natr(period)` | `value`, `atr` |
| `ta.rsi(period)` | `value` |
| `ta.mfi(period)` | `value` |
| `ta.cci(period)` | `value` |
| `ta.mrc(period)` | `value`, `middle`, `meanline`, `upsmall`, `downsmall`, `upinner`, `downinner`, `upouter`, `downouter`, `upbig`, `downbig` |
| `ta.volume(period)` | `value`, `average` |
| `ta.sar(period)` or `ta.sar(period, acceleration, max_acceleration)` | `value`, `long`, `short`, `uptrend`, `direction`, `next_sar`, `extreme_price` |
| `ta.chandelierexit()` | `value`, `long`, `short` |
| `ta.bollingerbands(period)` | `value`, `average`, `upper`, `lower` |
| `ta.stoch(period, k_period, d_period)` | `value`, `k`, `d` |
| `ta.emacross(fast_period, slow_period)` | `value`, `fast`, `slow` |

For `ta.volume`, `value` is the current candle's total volume and `average` is
the moving average of total volume. `ta.sar`'s `long` and `short` outputs may
be `null` when that side has no value. The `value` output is an alias for
`average` in `ta.bollingerbands`, `d` in `ta.stoch`, the middle line in
`ta.mrc`, and `long` in `ta.chandelierexit`.

## Candle and NTPS values

The same namespace exposes the current candle fields and the current NTPS
value:

```quantflow
close = ta.candle().close
prior_close = ta.candle()[1].close
ntps = ta.ntps().value
```

`ta.candle()` outputs `time`, `open`, `high`, `low`, `close`, `value`,
`volume`, `qty_buy`, and `qty_sell`; `value` is an alias for `close`. Candle
history uses zero-based offsets, so `[1]` selects the previous candle.
`ta.ntps().value` is available only for the current candle when NTPS is
present in the runtime context; it has no historical offsets.

## Timeframes and runtime scope

Direct `ta.*` calls use the timeframe declared by
`// @program(timeframe=<seconds>)`. When the worker provides more than one TA
timeframe, `ta.secure` selects a specific one:

```quantflow
five_minute_rsi = ta.secure(300, ta.rsi(14)).value
```

The selected timeframe must be available in the worker context. The live bot
runtime provides this TA context; native backtests do not currently provide
it. See [bot strategy programs](../bots/strategy-programs/) for indicator
event handlers and the native backtest limits.
