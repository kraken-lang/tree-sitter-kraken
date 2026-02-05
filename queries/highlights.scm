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
  "struct"
  "enum"
  "impl"
  "trait"
  "type"
  "unsafe"
  "move"
  "async"
  "dyn"
] @keyword

; Types
(primitive_type) @type.builtin
(type_identifier) @type

; Functions
(function_declaration
  name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

; Variables
(identifier) @variable

(parameter
  name: (identifier) @variable.parameter)

(field_declaration
  name: (identifier) @variable.member)

(field_expression
  field: (identifier) @variable.member)

; Literals
(integer_literal) @number
(float_literal) @number.float
(boolean_literal) @boolean
(string_literal) @string
(escape_sequence) @string.escape

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
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
] @punctuation.delimiter

; Comments
(line_comment) @comment
(block_comment) @comment

; Special
(wildcard_pattern) @constant.builtin
