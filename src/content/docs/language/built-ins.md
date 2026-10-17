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

`math.abs`, `math.min`, `math.max`, `math.negate`, `math.round`, `math.floor`,
`math.ceil`, `math.modulo`, and `math.clamp`.

- `math.abs(value)`, `math.negate(value)`, `math.round(value)`,
  `math.floor(value)`, and `math.ceil(value)` accept a number or decimal and
  preserve its type.
- `math.min(value, ...)` and `math.max(value, ...)` accept one or more values
  of the same numeric type.
- `math.modulo(dividend, divisor)` takes two values of the same numeric type
  and rejects a zero divisor.
- `math.clamp(value, minimum, maximum)` takes three values of the same numeric
  type and errors when `minimum` is greater than `maximum`.

## `number`

`number.from(value)` accepts a number, decimal, or numeric string and returns
a number.

## `decimal`

`decimal.from(value)` accepts a number, decimal, or numeric string and returns
a decimal.

- `decimal.step_from_places(places)` accepts an integer from 0 through 28 as a
  number, decimal, or numeric string and returns the corresponding step as text.

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

`symbol.key`, `symbol.provider`, `symbol.exchange_symbol`,
`symbol.instrument_type`, `symbol.round_price`, `symbol.round_qty`, and
`symbol.contract_to_quantity`.

- `symbol.key(provider, exchange_symbol, instrument_type)` lowercases all three
  non-empty components and combines them as
  `provider#exchange_symbol#instrument_type`. It rejects `#` inside a component.
- `symbol.provider(symbol_key)`, `symbol.exchange_symbol(symbol_key)`, and
  `symbol.instrument_type(symbol_key)` return one component of that canonical
  key. The key must contain exactly three non-empty components separated by
  `#`.
- `symbol.round_price(value, symbol_key)` rounds to the nearest positive
  `price_tick_size`; midpoint values round away from zero.
- `symbol.round_qty(value, symbol_key)` rounds toward zero to the symbol's
  `qty_step_size`.
- `symbol.contract_to_quantity(contracts, symbol_key)` multiplies the contract
  count by the symbol's positive `contract_size`.

The three metadata functions accept a number or decimal and preserve that
numeric type in the result. They require a symbol metadata resolver in the
runtime context and fail if the symbol or required metadata is unavailable.
The resolver reads the host's existing symbol metadata cache; it should not
query an exchange or database for each function call. `symbol.key` is the
canonicalization boundary for newly constructed keys; extraction helpers
preserve the spelling already present in a key. Do not use these helpers to
format provider API requests: apply any documented provider wire-format
conversion only in the outbound consumer mapping.

## `symbols`

`symbols.get_from_base(symbol_key, provider_code, inst_type)` looks up a
cross-exchange symbol using the source symbol's `base_asset`. The workflow host
provides the symbol catalog at `$.symbols`; each record contains `symbol_key`
and `base_asset`. Provider code and instrument type comparisons are exact.
The function returns the matching symbol key, `null` when no match exists, and
fails when more than one target matches. The target provider must differ from
the source provider.

<!-- QUANTFLOW_BUILTINS_END -->
