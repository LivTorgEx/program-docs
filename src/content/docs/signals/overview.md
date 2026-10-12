---
title: Signal programs
description: Current QuantFlow support and the intended first signal-service design.
---

# Signal programs

The signal service is not implemented yet. This page describes the intended
first version and marks the boundary between that plan and the current runtime.

## Intended first version

The Rust host will calculate supported indicators with `ta-rs` and provide the
resulting values to a QuantFlow program. QuantFlow will handle the bounded
analysis decision, such as checking whether price crossed a supplied line.
The service will own market data, indicator inputs, scheduling, and signal
emission; the user program will return a decision for the host to interpret.

Declarative rules are not planned as a second way to write signal or bot logic.
The intended user-authored logic is a QuantFlow program.

## Example: price crosses an MRC line

For an upward crossing, the input needs the previous and current close and the
previous and current MRC line value. The program compares the two bars:

```quantflow
previous_close = $.previous.close
previous_mrc = $.previous.mrc_middle
current_close = $.current.close
current_mrc = $.current.mrc_middle

crossed_up = previous_close <= previous_mrc && current_close > current_mrc
return crossed_up
```

In this example, the host calculates and supplies `mrc_middle`. It is not a
QuantFlow indicator built-in. The program returns a boolean; the signal service
would decide whether and how that result becomes a signal.

## Current limitations

The first signal-service contract is not implemented. The current runtime does
not provide the signal input shape, signal emission, or MRC calculations as
built-ins. `ta-rs` integration with this service is still planned.

User-defined indicator functions written in QuantFlow and a TA-Lib C backend
are possible later extensions. WASM may suit high-load or broader-language
workloads, such as AI models. None of these extensions is part of the current
QuantFlow runtime contract.
