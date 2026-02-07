module.exports = grammar({
  name: 'kraken',

  extras: $ => [
    /\s/,
    $.doc_comment,
    $.module_doc_comment,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$._pattern, $._expression],
    [$.literal_pattern, $._expression],
    [$.range_pattern, $.range_expression],
    [$.struct_pattern, $.struct_expression],
    [$.field_pattern, $.field_initializer],
    [$.enum_variant_pattern, $.enum_variant_expression],
  ],

  rules: {
    source_file: $ => repeat($._top_level_item),

    _top_level_item: $ => choice(
      $.module_declaration,
      $.import_declaration,
      $.static_assert,
      $._statement,
    ),

    _statement: $ => choice(
      $.function_declaration,
      $.const_function_declaration,
      $.struct_declaration,
      $.enum_declaration,
      $.union_declaration,
      $.class_declaration,
      $.interface_declaration,
      $.trait_declaration,
      $.impl_block,
      $.type_alias,
      $.let_statement,
      $.const_statement,
      $.assignment_statement,
      $.expression_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.defer_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.unsafe_block,
      $.block,
    ),

    // ---------------------------------------------------------------
    // Module system
    // ---------------------------------------------------------------

    module_declaration: $ => seq('module', $.module_path, ';'),

    import_declaration: $ => seq('import', $.module_path, ';'),

    module_path: $ => seq(
      $.identifier,
      repeat(seq('.', $.identifier)),
    ),

    // ---------------------------------------------------------------
    // Attributes
    // ---------------------------------------------------------------

    attribute: $ => seq(
      '#',
      '[',
      field('name', $.identifier),
      optional(seq('(', $.attribute_arguments, ')')),
      ']',
    ),

    attribute_arguments: $ => seq(
      $._attribute_arg,
      repeat(seq(',', $._attribute_arg)),
    ),

    _attribute_arg: $ => choice(
      $.identifier,
      $.integer_literal,
      seq($.identifier, '(', $.integer_literal, ')'),
    ),

    // ---------------------------------------------------------------
    // Declarations
    // ---------------------------------------------------------------

    function_declaration: $ => seq(
      optional('pub'),
      optional('async'),
      optional('unsafe'),
      'fn',
      field('name', $.identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      field('parameters', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      optional($.where_clause),
      field('body', $.block),
    ),

    const_function_declaration: $ => seq(
      optional('pub'),
      'const',
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      field('body', $.block),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.parameter,
        repeat(seq(',', $.parameter)),
        optional(seq(',', '...')),
        optional(','),
      )),
      ')',
    ),

    parameter: $ => seq(
      optional('&'),
      choice(
        seq(field('name', $.identifier), ':', field('type', $._type)),
        field('pattern', $.tuple_pattern),
        field('pattern', $.struct_pattern),
      ),
    ),

    struct_declaration: $ => seq(
      optional($.attribute),
      optional('pub'),
      'struct',
      field('name', $.type_identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      optional($.where_clause),
      '{',
      repeat(seq($.field_declaration, ';')),
      '}',
    ),

    field_declaration: $ => seq(
      optional('pub'),
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    enum_declaration: $ => seq(
      optional('pub'),
      'enum',
      field('name', $.type_identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      optional($.where_clause),
      '{',
      optional(seq(
        $.enum_variant,
        repeat(seq(',', $.enum_variant)),
        optional(','),
      )),
      '}',
    ),

    enum_variant: $ => seq(
      field('name', $.type_identifier),
      optional(choice(
        seq('(', optional(seq($._type, repeat(seq(',', $._type)), optional(','))), ')'),
        seq('{', repeat(seq($.field_declaration, ';')), '}'),
      )),
    ),

    union_declaration: $ => seq(
      optional('pub'),
      'union',
      field('name', $.type_identifier),
      '{',
      repeat(seq($.field_declaration, ';')),
      '}',
    ),

    class_declaration: $ => seq(
      optional('pub'),
      'class',
      field('name', $.type_identifier),
      '{',
      repeat(choice(
        seq($.field_declaration, ';'),
        $.function_declaration,
      )),
      '}',
    ),

    interface_declaration: $ => seq(
      'interface',
      field('name', $.type_identifier),
      '{',
      repeat($.function_signature),
      '}',
    ),

    function_signature: $ => seq(
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      ';',
    ),

    trait_declaration: $ => seq(
      optional('pub'),
      'trait',
      field('name', $.type_identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      optional(seq(':', $.trait_bounds)),
      '{',
      repeat($.trait_item),
      '}',
    ),

    trait_item: $ => choice(
      $.trait_method,
      $.associated_type,
    ),

    trait_method: $ => seq(
      optional('async'),
      'fn',
      field('name', $.identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      field('parameters', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      choice(';', field('body', $.block)),
    ),

    associated_type: $ => seq(
      'type',
      field('name', $.type_identifier),
      optional(seq(':', $.trait_bounds)),
      ';',
    ),

    impl_block: $ => seq(
      'impl',
      optional(field('type_parameters', $.type_parameter_list)),
      choice(
        seq(
          field('trait', $.type_identifier),
          'for',
          field('type', $._type),
        ),
        field('type', $._type),
      ),
      optional($.where_clause),
      '{',
      repeat($.impl_item),
      '}',
    ),

    impl_item: $ => choice(
      $.function_declaration,
      $.associated_type_definition,
    ),

    associated_type_definition: $ => seq(
      'type',
      field('name', $.type_identifier),
      '=',
      field('type', $._type),
      ';',
    ),

    type_alias: $ => seq(
      optional('pub'),
      'type',
      field('name', $.type_identifier),
      optional(field('type_parameters', $.type_parameter_list)),
      '=',
      field('type', $._type),
      ';',
    ),

    static_assert: $ => seq(
      'static_assert',
      '!',
      '(',
      field('condition', $._expression),
      ',',
      field('message', $.string_literal),
      ')',
      ';',
    ),

    // ---------------------------------------------------------------
    // Generics & where clauses
    // ---------------------------------------------------------------

    type_parameter_list: $ => seq(
      '<',
      seq(
        $.type_parameter,
        repeat(seq(',', $.type_parameter)),
        optional(','),
      ),
      '>',
    ),

    type_parameter: $ => seq(
      field('name', $.type_identifier),
      optional(seq(':', $.trait_bounds)),
    ),

    generic_arguments: $ => seq(
      '<',
      seq(
        $._type,
        repeat(seq(',', $._type)),
        optional(','),
      ),
      '>',
    ),

    trait_bounds: $ => seq(
      $.type_identifier,
      repeat(seq('+', $.type_identifier)),
    ),

    where_clause: $ => seq(
      'where',
      seq(
        $.where_predicate,
        repeat(seq(',', $.where_predicate)),
        optional(','),
      ),
    ),

    where_predicate: $ => seq(
      $._type,
      ':',
      $.trait_bounds,
    ),

    // ---------------------------------------------------------------
    // Statements
    // ---------------------------------------------------------------

    let_statement: $ => seq(
      'let',
      optional('mut'),
      field('pattern', $._pattern),
      optional(seq(':', field('type', $._type))),
      optional(seq('=', field('value', $._expression))),
      ';',
    ),

    const_statement: $ => seq(
      'const',
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
      '=',
      field('value', $._expression),
      ';',
    ),

    assignment_statement: $ => prec.right(10, seq(
      field('left', $._expression),
      field('operator', choice('=', '+=', '-=', '*=', '/=', '%=')),
      field('right', $._expression),
      ';',
    )),

    expression_statement: $ => seq($._expression, ';'),

    return_statement: $ => seq('return', optional($._expression), ';'),

    break_statement: $ => seq('break', ';'),

    continue_statement: $ => seq('continue', ';'),

    defer_statement: $ => seq('defer', $._statement),

    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.block, $.if_statement)))),
    ),

    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block),
    ),

    for_statement: $ => seq(
      'for',
      '(',
      choice(
        seq(
          field('pattern', $._pattern),
          'in',
          field('iterator', $._expression),
        ),
        seq(
          field('initializer', choice($.let_statement, $.expression_statement)),
          field('condition', $._expression),
          ';',
          field('update', $._expression),
        ),
      ),
      ')',
      field('body', $.block),
    ),

    match_arm: $ => seq(
      field('pattern', $._pattern),
      optional(seq('if', field('guard', $._expression))),
      '->',
      field('value', choice($.block, seq($._expression, ','))),
    ),

    unsafe_block: $ => seq('unsafe', $.block),

    block: $ => seq('{', repeat($._statement), '}'),

    // ---------------------------------------------------------------
    // Patterns
    // ---------------------------------------------------------------

    _pattern: $ => choice(
      $.identifier,
      $.wildcard_pattern,
      $.literal_pattern,
      $.tuple_pattern,
      $.struct_pattern,
      $.enum_pattern,
      $.enum_variant_pattern,
      $.or_pattern,
      $.range_pattern,
    ),

    wildcard_pattern: $ => '_',

    literal_pattern: $ => $._literal,

    tuple_pattern: $ => seq(
      '(',
      optional(seq(
        $._pattern,
        repeat(seq(',', $._pattern)),
        optional(','),
      )),
      ')',
    ),

    struct_pattern: $ => seq(
      field('type', $.type_identifier),
      '{',
      optional(seq(
        $.field_pattern,
        repeat(seq(',', $.field_pattern)),
        optional(','),
      )),
      optional('..'),
      '}',
    ),

    field_pattern: $ => choice(
      seq(field('name', $.identifier), ':', field('pattern', $._pattern)),
      field('name', $.identifier),
    ),

    enum_pattern: $ => seq(
      field('type', $.type_identifier),
      optional(choice(
        seq('(', optional(seq($._pattern, repeat(seq(',', $._pattern)), optional(','))), ')'),
        $.struct_pattern,
      )),
    ),

    enum_variant_pattern: $ => seq(
      field('type', $.type_identifier),
      '::',
      field('variant', $.type_identifier),
      optional(seq('(', optional(seq($._pattern, repeat(seq(',', $._pattern)), optional(','))), ')')),
    ),

    or_pattern: $ => prec.left(seq($._pattern, '|', $._pattern)),

    range_pattern: $ => choice(
      seq($._expression, '..', $._expression),
      seq($._expression, '..=', $._expression),
    ),

    // ---------------------------------------------------------------
    // Expressions
    // ---------------------------------------------------------------

    _expression: $ => choice(
      $.identifier,
      $._literal,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.field_expression,
      $.index_expression,
      $.array_expression,
      $.tuple_expression,
      $.struct_expression,
      $.closure_expression,
      $.range_expression,
      $.try_expression,
      $.await_expression,
      $.spawn_expression,
      $.match_expression,
      $.enum_variant_expression,
      $.parenthesized_expression,
    ),

    binary_expression: $ => {
      const table = [
        [prec.left, 1, '||'],
        [prec.left, 2, '&&'],
        [prec.left, 3, choice('==', '!=', '<', '>', '<=', '>=')],
        [prec.left, 4, '|'],
        [prec.left, 5, '^'],
        [prec.left, 6, '&'],
        [prec.left, 7, choice('<<', '>>')],
        [prec.left, 8, choice('+', '-')],
        [prec.left, 9, choice('*', '/', '%')],
      ];

      return choice(...table.map(([fn, precedence, operator]) =>
        fn(precedence, seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression),
        ))
      ));
    },

    unary_expression: $ => prec(11, seq(
      field('operator', choice('-', '!', '~', '*', '&', '&mut')),
      field('operand', $._expression),
    )),

    call_expression: $ => prec(12, seq(
      field('function', $._expression),
      optional($.turbofish),
      field('arguments', $.argument_list),
    )),

    turbofish: $ => seq('::', $.generic_arguments),

    argument_list: $ => seq(
      '(',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ')',
    ),

    field_expression: $ => prec(12, seq(
      field('object', $._expression),
      '.',
      field('field', choice($.identifier, $.integer_literal)),
    )),

    index_expression: $ => prec(12, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      optional(seq(':', field('end', $._expression))),
      ']',
    )),

    array_expression: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ']',
    ),

    tuple_expression: $ => seq(
      '(',
      $._expression,
      ',',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ')',
    ),

    struct_expression: $ => seq(
      field('type', $.type_identifier),
      '{',
      optional(seq(
        $.field_initializer,
        repeat(seq(',', $.field_initializer)),
        optional(','),
      )),
      '}',
    ),

    field_initializer: $ => choice(
      seq(field('name', $.identifier), ':', field('value', $._expression)),
      field('name', $.identifier),
    ),

    closure_expression: $ => seq(
      optional('move'),
      '|',
      optional(seq(
        $.closure_parameter,
        repeat(seq(',', $.closure_parameter)),
        optional(','),
      )),
      '|',
      optional(seq('->', $._type)),
      choice(
        $._expression,
        $.block,
      ),
    ),

    closure_parameter: $ => seq(
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
    ),

    range_expression: $ => choice(
      prec.left(2, seq($._expression, '..', $._expression)),
      prec.left(2, seq($._expression, '..=', $._expression)),
      prec.left(1, seq($._expression, '..')),
      prec.left(1, seq('..', $._expression)),
      prec(0, '..'),
    ),

    try_expression: $ => prec(12, seq($._expression, '?')),

    await_expression: $ => prec.right(1, seq('await', $._expression)),

    spawn_expression: $ => seq('spawn', $.block),

    match_expression: $ => seq(
      'match',
      field('value', $._expression),
      '{',
      repeat($.match_arm),
      '}',
    ),

    enum_variant_expression: $ => seq(
      field('type', $.type_identifier),
      '::',
      field('variant', $.type_identifier),
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    // ---------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------

    _type: $ => choice(
      $.primitive_type,
      $.container_type,
      $.slice_type,
      $.type_identifier,
      $.generic_type,
      $.tuple_type,
      $.array_type,
      $.function_type,
      $.reference_type,
      $.pointer_type,
      $.trait_object_type,
    ),

    primitive_type: $ => choice(
      'int',
      'float',
      'bool',
      'string',
      'str',
      'bytes',
      'void',
    ),

    container_type: $ => choice(
      'VecInt',
      'VecString',
      'VecBytes',
      'MapStringInt',
      'MapStringString',
    ),

    slice_type: $ => choice(
      'SliceInt',
      'SliceString',
      'SliceBytes',
    ),

    type_identifier: $ => /[A-Z][a-zA-Z0-9_]*/,

    generic_type: $ => seq(
      field('type', $.type_identifier),
      $.generic_arguments,
    ),

    tuple_type: $ => seq(
      '(',
      optional(seq(
        $._type,
        ',',
        optional(seq(
          $._type,
          repeat(seq(',', $._type)),
          optional(','),
        )),
      )),
      ')',
    ),

    array_type: $ => seq(
      '[',
      field('element_type', $._type),
      optional(seq(';', field('size', $.integer_literal))),
      ']',
    ),

    function_type: $ => seq(
      'fn',
      '(',
      optional(seq(
        $._type,
        repeat(seq(',', $._type)),
        optional(','),
      )),
      ')',
      optional(seq('->', $._type)),
    ),

    reference_type: $ => seq(
      '&',
      optional('mut'),
      $._type,
    ),

    pointer_type: $ => seq(
      choice('*const', '*mut'),
      $._type,
    ),

    trait_object_type: $ => seq(
      'dyn',
      $.trait_bounds,
    ),

    // ---------------------------------------------------------------
    // Literals
    // ---------------------------------------------------------------

    _literal: $ => choice(
      $.integer_literal,
      $.float_literal,
      $.boolean_literal,
      $.string_literal,
      $.null_literal,
    ),

    integer_literal: $ => token(choice(
      /[0-9][0-9_]*/,
      /0x[0-9a-fA-F][0-9a-fA-F_]*/,
      /0b[01][01_]*/,
      /0o[0-7][0-7_]*/,
    )),

    float_literal: $ => token(seq(
      /[0-9][0-9_]*/,
      '.',
      /[0-9][0-9_]*/,
      optional(seq(/[eE]/, optional(/[+-]/), /[0-9]+/)),
    )),

    boolean_literal: $ => choice('true', 'false'),

    null_literal: $ => 'null',

    string_literal: $ => seq(
      '"',
      repeat(choice(
        token.immediate(/[^"\\]+/),
        $.escape_sequence,
      )),
      '"',
    ),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[nrt\\'"0]/,
        /x[0-9a-fA-F]{2}/,
        /u\{[0-9a-fA-F]+\}/,
      ),
    )),

    // ---------------------------------------------------------------
    // Identifiers & comments
    // ---------------------------------------------------------------

    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    doc_comment: $ => token(seq('///', /.*/)),

    module_doc_comment: $ => token(seq('//!', /.*/)),

    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/',
    )),
  },
});
