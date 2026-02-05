<div align="center">
    <img width="auto" height="118" alt="Kraken Language" src="https://raw.githubusercontent.com/kraken-lang/.github/refs/heads/main/images/kraken-logo.png">
    <h1><sub><sup>KRAKEN LANGUAGE</sup></sub><br>TREE SITTER</h1>
</div>

Tree-sitter grammar for the Kraken programming language. Provides fast, incremental parsing for syntax highlighting, code navigation, and editor integration.

Current version: `v0.8.42`

## Features

This grammar supports all Kraken language features including:

- Function declarations with generics and type parameters
- Struct and enum definitions with pattern matching
- Trait declarations and implementations
- Closure expressions with capture semantics
- Advanced pattern matching (tuples, structs, enums, ranges, guards)
- Type system (primitives, generics, tuples, arrays, function types, pointers)
- Control flow (if, while, for, match)
- Operators (arithmetic, logical, bitwise, comparison)
- Unsafe blocks and raw pointers
- Range expressions and try operator
- Turbofish syntax for explicit type arguments

## Installation

### Node.js

```bash
npm install tree-sitter-kraken
```

### Rust

Add to your `Cargo.toml`:

```toml
[dependencies]
tree-sitter-kraken = "0.8.42"
```

## Usage

### Node.js

```javascript
const Parser = require('tree-sitter');
const Kraken = require('tree-sitter-kraken');

const parser = new Parser();
parser.setLanguage(Kraken);

const sourceCode = `
fn main() -> int {
    let x = 42;
    return x;
}
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

### Rust

```rust
use tree_sitter::Parser;

fn main() {
    let mut parser = Parser::new();
    parser.set_language(tree_sitter_kraken::language()).unwrap();
    
    let source_code = r#"
        fn main() -> int {
            let x = 42;
            return x;
        }
    "#;
    
    let tree = parser.parse(source_code, None).unwrap();
    println!("{}", tree.root_node().to_sexp());
}
```

## Editor Integration

### Neovim

Using `nvim-treesitter`:

```lua
require('nvim-treesitter.configs').setup {
  ensure_installed = { "kraken" },
  highlight = { enable = true },
}
```

### Helix

Add to `languages.toml`:

```toml
[[language]]
name = "kraken"
scope = "source.kraken"
file-types = ["kr"]
roots = ["Cargo.toml"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "kraken"
source = { git = "https://github.com/kraken-lang/tree-sitter-kraken", rev = "main" }
```

## Development

### Building

Generate the parser from grammar:

```bash
npm install
npm run build
```

### Testing

Run the test suite:

```bash
npm test
```

Parse a specific file:

```bash
npm run parse examples/hello.kr
```

### Grammar Structure

The grammar is defined in `grammar.js` and covers:

- **Declarations**: Functions, structs, enums, traits, impl blocks
- **Statements**: Let bindings, control flow, expressions
- **Expressions**: Literals, operators, calls, closures
- **Patterns**: Comprehensive pattern matching support
- **Types**: Full type system including generics and trait objects

## Syntax Highlighting

Syntax highlighting queries are provided in `queries/highlights.scm`. The grammar supports semantic highlighting for:

- Keywords and operators
- Function and type names
- Variables and parameters
- String literals and escape sequences
- Comments
- Attributes and macros

## Performance

Tree-sitter provides incremental parsing, making it efficient for real-time editor use. The parser can handle large Kraken files with minimal latency.

## Compatibility

This grammar tracks the Kraken language compiler version. Version 0.8.42 supports all language features up to Kraken v0.8.42.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
