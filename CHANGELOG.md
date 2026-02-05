<div align="center">
    <img width="auto" height="118" alt="Kraken Language" src="https://raw.githubusercontent.com/kraken-lang/.github/refs/heads/main/images/kraken-logo.png">
    <h1><sub><sup>KRAKEN LANGUAGE</sup></sub><br>TREE SITTER CHANGELOG</h1>
</div>

All notable changes to the Kraken Tree-sitter grammar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.42] - 2026-02-05

### Added
- **Initial Tree-sitter Grammar Implementation**
  - Complete grammar definition for Kraken v0.8.42
  - Support for all core language features
  - Function declarations with generic parameters
  - Struct and enum declarations with variants
  - Trait declarations and implementations
  - Pattern matching with comprehensive patterns
  - Closure expressions with move semantics
  - Type system including primitives, generics, tuples, arrays
  - Operator support: arithmetic, logical, bitwise, comparison
  - Control flow: if, while, for, match statements
  - Unsafe blocks and raw pointer types
  - Range expressions (.. and ..=)
  - Try operator (?) support
  - Turbofish syntax (::<T>)
  - Comments: line and block

- **Project Infrastructure**
  - Node.js package configuration
  - Rust bindings with Cargo.toml
  - Build system with binding.gyp
  - MIT and Apache-2.0 dual licensing

### Language Features Supported
- **Declarations**: Functions, structs, enums, traits, impl blocks, type aliases
- **Patterns**: Literal, tuple, struct, enum, or-patterns, range patterns, wildcards
- **Expressions**: Binary, unary, call, field access, indexing, closures, ranges
- **Types**: Primitives, generics, tuples, arrays, function types, pointers, trait objects
- **Statements**: Let, const, return, if, while, for, match, unsafe blocks
- **Advanced**: Generic parameters, where clauses, trait bounds, associated types

[Unreleased]: https://github.com/kraken-lang/tree-sitter-kraken/compare/v0.8.42...HEAD
[0.8.42]: https://github.com/kraken-lang/tree-sitter-kraken/releases/tag/v0.8.42
