# tree-sitter-ifc

Tree-sitter grammar for IFC STEP files (`.ifc`).

## Status

This grammar is under active development and may change between versions.

## Requirements

- `tree-sitter` CLI (recommended: `0.26.x`)
- Node.js (used by the grammar DSL tooling)

## Development

Regenerate parser artifacts after editing [`grammar.js`](grammar.js):

```bash
tree-sitter generate
```

This updates generated files in `src/` (`parser.c`, `grammar.json`, `node-types.json`), which are intended to be committed.

## Parse Files With CLI

Parse a file and print the syntax tree:

```bash
tree-sitter parse samples/Building-Architecture-IFC4.ifc
```

Quiet parse mode (`-q` / `--quiet`):

```bash
tree-sitter parse -q samples/Building-Architecture-IFC4.ifc
```

In quiet mode, `tree-sitter` suppresses normal tree output and reports parse problems (for example `ERROR` nodes), which is useful for validation and scripting.

## Error Node Debugging

This repository includes a helper to print each `ERROR` node with source location and line context:

```bash
./scripts/debug-error-nodes.sh samples/*.ifc
```

Or through npm:

```bash
npm run debug:errors -- samples/Building-Architecture-IFC4.ifc
```

## Queries

- Highlights: `queries/highlights.scm`

## Bindings

This repository includes bindings for:

- C
- Go
- Node.js
- Python
- Rust
- Swift

Rust bindings compile parser sources during build (`bindings/rust/build.rs`), so there is no separate Rust binding generation step.

## License

MIT
