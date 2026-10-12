---
title: Get started
description: Understand the shape and limits of a QuantFlow program.
---

# Get started

QuantFlow source is compiled by the host that runs it. The host supplies an
input value and a function registry; a program returns one value or raises an
explicit error.

## Your first program

This expression calculates the distance between a price and a reference:

```quantflow
math.abs($.price - $.reference)
```

The host must provide an input object with `price` and `reference` fields and
register the `math.abs` built-in. `$.` means “the current program input.”

## A small decision

Programs can also use assignments and return a boolean:

```quantflow
distance = math.abs($.price - $.reference)
return distance >= $.minimum_move
```

The code expresses a decision; the host decides what to do with the returned
value. In the planned signal service, for example, the host would decide how a
true result becomes a signal.

## Compile and run

The Rust API compiles source and executes it against an input value and
registered functions. See [Rust integration](rust/integration/) for a complete
example.

## What the language supports

QuantFlow supports scalar and object-path expressions, assignments, conditional
expressions, indented `if`/`else` blocks, function calls, and `return`. It does
not support general-purpose Python features such as imports, loops, classes, or
function definitions. See [Syntax](language/syntax/) for the full reference.
