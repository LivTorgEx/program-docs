---
title: Syntax
description: Expressions, paths, assignments, loops, conditionals, and errors.
---

# Syntax

QuantFlow is not Python. It uses a deliberately small syntax that the host can
validate and execute with a restricted function registry.

## Expressions

A single expression is an implicit return:

```quantflow
math.abs($.price - $.reference)
```

Expressions support `null`, `true`, `false`, decimal numbers, quoted strings,
object paths, registered function calls, and parentheses.

| Operators | Meaning |
| --- | --- |
| `!`, unary `-` | Logical and numeric negation |
| `*`, `/` | Multiplication and division |
| `+`, `-` | Addition and subtraction |
| `>`, `>=`, `<`, `<=` | Ordering |
| `==`, `!=` | Equality |
| `&&`, `||` | Short-circuit boolean operations |

Runtime numbers use decimal arithmetic. The compiler does not silently convert
between strings, booleans, and numbers for arithmetic.

## Read input values

Use `$.` to read from the value supplied by the host. Dotted paths traverse
objects, and zero-based numeric path segments traverse arrays:

```quantflow
symbol = $.run_input.symbol
last_price = $.arguments.data.0.last
return last_price
```

If a path cannot be resolved, execution reports the requested path, the missing
segment, and the deepest path that was resolved.

## Assignments and programs

A multiline program supports assignments, dotted object-path assignments,
indented `if`/`else` blocks, `for` loops over arrays, conditional expressions,
and `return`. Every program must return a value.

```quantflow
price = $.price
risk = math.abs(price - $.reference)

if risk > $.max_risk:
    return None

return risk
```

Use `for name in expression:` to visit each item in an array. The loop body must
be indented with spaces; tabs are not supported. The expression is evaluated
once before iteration, and a non-array value produces a runtime error:

```quantflow
total = 0
for position in $.positions:
    total = total + position.notional
return total
```

All loops in one Program execution share a limit of 10,000 total iterations,
including iterations in nested loops. A loop over an array with more than
10,000 items fails immediately, and nested loops can reach the shared limit
even when each individual array is smaller. Exceeding the limit produces a
runtime error.

The loop variable is temporarily bound for the loop. If a variable with the
same name already existed, its previous value is restored afterward; otherwise
the loop variable is removed. Other assignments made in the loop body remain
in the Program's shared variable scope after the loop. A `return` in the body
returns from the Program.

A variable can refer to the current input with `$`. Dotted assignments update
the local program value:

```quantflow
value = $
value.signal.direction = $.run_input.direction
return value
```

Conditional expressions use Python-like order:

```quantflow
target = requested if requested != "auto" else default_target
return target
```

Function names can include a namespace, but calls are not object methods. Use
`str.upper(value)`, not `value.upper()`.

## Return an explicit error

Use `return Err("message")` to stop execution with an explicit error:

```quantflow
if $.arguments.quantity <= 0:
    return Err("quantity must be positive")

return $.arguments.quantity
```

`Err` takes exactly one string. The Rust caller receives a
`QuantflowError::Raised` and can propagate it with `?` or handle it.

## Deliberate limits

QuantFlow does not support imports, `while` loops, classes, function
definitions, or arbitrary code execution. `for` loops are limited to arrays
and the per-execution iteration budget described above. Programs can call only
functions registered by their host. Hosts may provide different inputs and
additional functions, so a program is portable only when its input and
registered-function contract is portable.

See [Built-in functions](built-ins/) for functions registered by the standard
QuantFlow runtime.
