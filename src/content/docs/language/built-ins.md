---
title: Built-in functions
description: Functions registered by the standard QuantFlow runtime.
---

# Built-in functions

This reference lists functions in the standard QuantFlow registry. A host may
register additional functions; those are host-specific and are not language
built-ins.

<!-- QUANTFLOW_BUILTINS_START -->

## `math`

`math.abs`, `math.min`, `math.max`, `math.to_integer`, `math.to_decimal`,
`math.decimal_places_to_step`, `math.negate`, `math.round`, `math.floor`,
`math.ceil`, `math.modulo`, and `math.clamp`.

- `math.abs(value)` returns the absolute decimal value.
- `math.min(value, ...)` and `math.max(value, ...)` take one or more decimals.
- `math.to_integer(value)` accepts a decimal or decimal text and errors unless
  the value is a whole number.
- `math.to_decimal(value)` converts a decimal or decimal text to a decimal.
- `math.decimal_places_to_step(places)` takes an integer from 0 through 28 and
  returns the corresponding step as text.
- `math.negate(value)`, `math.round(value)`, `math.floor(value)`, and
  `math.ceil(value)` each take one decimal.
- `math.modulo(dividend, divisor)` takes two decimals and rejects a zero
  divisor.
- `math.clamp(value, minimum, maximum)` takes three decimals and errors when
  `minimum` is greater than `maximum`.

## `str`

`str.to_text`, `str.lower_ascii`, `str.trim`, `str.concat`, `str.upper`,
`str.lower`, `str.capitalize`, `str.strip`, `str.lstrip`, `str.rstrip`,
`str.replace`, `str.split`, `str.join`, `str.startswith`, `str.endswith`,
`str.contains`, `str.find`, `str.len`, and `str.is_empty`.

- `str.to_text(value)`, `str.lower_ascii(value)`, and `str.trim(value)` take a
  string, decimal, or boolean.
- `str.concat(value, ...)` joins zero or more scalar values as text.
- `str.upper(value)`, `str.lower(value)`, `str.capitalize(value)`,
  `str.len(value)`, and `str.is_empty(value)` each take one string.
- `str.strip(value[, characters])`, `str.lstrip(value[, characters])`, and
  `str.rstrip(value[, characters])` remove whitespace by default. When
  `characters` is provided, each removes any character in that set.
- `str.replace(value, old, new)` replaces all occurrences. Its three values
  may be strings, decimals, or booleans.
- `str.split(value[, separator])` returns an array of strings. An omitted or
  `null` separator splits on whitespace; an empty separator is an error.
- `str.join(separator, values)` joins an array of strings.
- `str.startswith(value, prefix)`, `str.endswith(value, suffix)`, and
  `str.contains(value, part)` return booleans.
- `str.find(value, part)` returns a zero-based character index or `-1`.

## `array`

`array.new`, `array.find`, `array.filter`, and `array.first_field`.

- `array.new(value, ...)` returns an array containing its arguments.
- `array.find(items, field, expected, ...)` returns the first item whose field
  paths match every expected value, or `null` if no item matches.
- `array.filter(items, field, expected, ...)` returns all items matching every
  field/value pair.
- `array.first_field(items, field)` returns the named field from the first
  item, or `null` if it is missing.

For `array.find` and `array.filter`, provide one or more field/value pairs.
Field paths may be dotted, such as `state.side`; matches use exact value
equality.

## `object`

`object.get`, `object.set`, and `object.values`.

- `object.get(value, key)` returns the value for a key, or `null` when absent.
- `object.set(value, key, new_value)` returns a copy with that key set.
- `object.values(value)` returns an array of the object's values.

## `boolean`

`boolean.to_boolean(value)` accepts a boolean or the strings `true` and
`false` (case-insensitive, surrounding whitespace ignored).

## `datetime`

`datetime.now`, `datetime.to_millis`, and `datetime.to_timestamp`.

- `datetime.now()` returns the current UTC time as milliseconds since the Unix
  epoch.
- `datetime.to_millis(value)` accepts RFC3339 text and returns milliseconds
  since the Unix epoch.
- `datetime.to_timestamp(value[, format])` accepts RFC3339 text or a whole
  millisecond timestamp. An optional format accepts Chrono/strftime syntax;
  `rfc3339` and `rfc3339_millis` select RFC3339 output.

## `symbol`

`symbol.key`, `symbol.provider`, `symbol.exchange_symbol`, and
`symbol.instrument_type`.

These are legacy format-conversion helpers. `symbol.key` trims and lowercases
its three inputs; the extraction helpers normalize case as well. Provider codes
and symbol keys are opaque identifiers in the trading system, so do not use
these helpers to prepare values for API calls, matching, persistence, or
display. Pass the original identifier through unchanged.

<!-- QUANTFLOW_BUILTINS_END -->
