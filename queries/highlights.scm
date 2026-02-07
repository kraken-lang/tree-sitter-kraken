; Keywords
[
  "fn"
  "let"
  "mut"
  "const"
  "if"
  "else"
  "while"
  "for"
  "in"
  "match"
  "return"
  "break"
  "continue"
  "defer"
  "struct"
  "enum"
  "union"
  "class"
  "interface"
  "impl"
  "trait"
  "type"
  "unsafe"
  "move"
  "async"
  "await"
  "spawn"
  "dyn"
  "pub"
  "import"
  "module"
  "where"
  "static_assert"
] @keyword

; Types
(primitive_type) @type.builtin
(container_type) @type.builtin
(slice_type) @type.builtin
(type_identifier) @type

; Functions
(function_declaration
  name: (identifier) @function)

(const_function_declaration
  name: (identifier) @function)

(function_signature
  name: (identifier) @function)

(trait_method
  name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

; Variables
(identifier) @variable

(parameter
  name: (identifier) @variable.parameter)

(closure_parameter
  name: (identifier) @variable.parameter)

(field_declaration
  name: (identifier) @variable.member)

(field_expression
  field: (identifier) @variable.member)

(field_initializer
  name: (identifier) @variable.member)

; Literals
(integer_literal) @number
(float_literal) @number.float
(boolean_literal) @boolean
(string_literal) @string
(escape_sequence) @string.escape
(null_literal) @constant.builtin

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
  "~"
  "&"
  "|"
  "^"
  "<<"
  ">>"
  ".."
  "..="
  "?"
  "->"
  "::"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ";"
  ":"
  "."
  "#"
] @punctuation.delimiter

; Comments
(doc_comment) @comment.documentation
(module_doc_comment) @comment.documentation
(line_comment) @comment
(block_comment) @comment

; Attributes
(attribute
  name: (identifier) @attribute)

; Module paths
(module_path) @module

; Special
(wildcard_pattern) @constant.builtin
