# LivTorgEx Program Docs

The public QuantFlow documentation is a multi-page Starlight site in
[`src/content/docs/`](src/content/docs/). It is built and published from this
repository to GitHub Pages.

## Work locally

```sh
pnpm install
pnpm dev
```

Run `pnpm build` to produce the static site in `dist/`. Starlight builds the
navigation and Pagefind search index from the documentation pages.

Rust-backed documentation validation is run in CI against
[`LivTorgEx/trading-platform-rust`](https://github.com/LivTorgEx/trading-platform-rust).
It checks QuantFlow code examples and verifies that the built-in function
reference matches the runtime registry.
