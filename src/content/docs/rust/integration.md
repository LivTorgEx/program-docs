---
title: Rust integration
description: Compile and execute QuantFlow with the Rust library.
---

# Rust integration

The `quantflow` Rust crate compiles source once and executes the resulting
program against an input value and a host-controlled function registry.

```rust
use api_schema::{ApiValue, Decimal};
use quantflow::{compile, FunctionRegistry};
use std::str::FromStr;

let program = compile("return $.price * 2")?;
let functions = FunctionRegistry::with_builtins();
let mut context = ApiValue::object([(
    "price",
    ApiValue::from(Decimal::from_str("10").expect("valid decimal")),
)]);
let value = program.execute(&mut context, &functions)?;
assert_eq!(value, ApiValue::from(Decimal::from(20)));
# Ok::<(), quantflow::QuantflowError>(())
```

The code uses Rust's decimal type for numeric operations. Convert JSON values at
the integration boundary. The QuantFlow language itself has no provider,
database, or indicator-library dependency.

Hosts can register additional functions with `FunctionRegistry::register`.
Keep those functions narrow and validate their arguments; only the functions
registered by the host are callable by a program.
