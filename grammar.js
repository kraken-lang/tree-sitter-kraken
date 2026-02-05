module.exports = grammar({
  name: 'kraken',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.type_identifier, $.identifier],
    [$.generic_type, $.binary_expression],
    [$.range_expression],
    [$._statement, $._expression],
    [$._pattern, $._expression],
    [$.literal_pattern, $._expression],
    [$.range_pattern, $.range_expression],
    [$._expression, $.closure_expression],
    [$.struct_pattern, $.struct_expression],
    [$.field_pattern, $.field_initializer],
    [$.match_arm, $._expression],
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.function_declaration,
      $.struct_declaration,
      $.enum_declaration,
      $.trait_declaration,
      $.impl_block,
      $.type_alias,
      $.let_statement,
      $.const_statement,
      $.expression_statement,
      $.return_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.match_statement,
      $.unsafe_block,
      $.block,
    ),

    function_declaration: $ => seq(
      optional('unsafe'),
      'fn',
      field('name', $.identifier),
      optional($.generic_parameters),
      field('parameters', $.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      field('body', $.block),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.parameter,
        repeat(seq(',', $.parameter)),
        optional(','),
      )),
      ')',
    ),

    parameter: $ => seq(
      choice(
        seq(field('name', $.identifier), ':', field('type', $._type)),
        field('pattern', $.tuple_pattern),
        field('pattern', $.struct_pattern),
      ),
    ),

    struct_declaration: $ => seq(
      'struct',
      field('name', $.type_identifier),
      optional($.generic_parameters),
      '{',
      repeat(seq($.field_declaration, ';')),
      '}',
    ),

    field_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    enum_declaration: $ => seq(
      'enum',
      field('name', $.type_identifier),
      optional($.generic_parameters),
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

    trait_declaration: $ => seq(
      'trait',
      field('name', $.type_identifier),
      optional($.generic_parameters),
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
      optional($.generic_parameters),
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
      optional($.generic_parameters),
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
      'type',
      field('name', $.type_identifier),
      optional($.generic_parameters),
      '=',
      field('type', $._type),
      ';',
    ),

    generic_parameters: $ => seq(
      '<',
      seq(
        $.generic_parameter,
        repeat(seq(',', $.generic_parameter)),
        optional(','),
      ),
      '>',
    ),

    generic_parameter: $ => seq(
      field('name', $.type_identifier),
      optional(seq(':', $.trait_bounds)),
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
      ':',
      field('type', $._type),
      '=',
      field('value', $._expression),
      ';',
    ),

    expression_statement: $ => seq($._expression, ';'),

    return_statement: $ => seq('return', optional($._expression), ';'),

    if_statement: $ => seq(
      'if',
      '(',
      field('condition', $._expression),
      ')',
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.block, $.if_statement)))),
    ),

    while_statement: $ => seq(
      'while',
      '(',
      field('condition', $._expression),
      ')',
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

    match_statement: $ => seq(
      'match',
      '(',
      field('value', $._expression),
      ')',
      '{',
      repeat($.match_arm),
      '}',
    ),

    match_arm: $ => seq(
      field('pattern', $._pattern),
      optional(seq('if', field('guard', $._expression))),
      '->',
      field('body', choice($.block, seq($._expression, ','))),
    ),

    unsafe_block: $ => seq('unsafe', $.block),

    block: $ => seq('{', repeat($._statement), '}'),

    _pattern: $ => choice(
      $.identifier,
      $.wildcard_pattern,
      $.literal_pattern,
      $.tuple_pattern,
      $.struct_pattern,
      $.enum_pattern,
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

    or_pattern: $ => prec.left(seq($._pattern, '|', $._pattern)),

    range_pattern: $ => choice(
      seq($._expression, '..', $._expression),
      seq($._expression, '..=', $._expression),
    ),

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
      $.parenthesized_expression,
      $.block,
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
        [prec.right, 10, '='],
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
      field('operator', choice('-', '!', '*', '&', '&mut')),
      field('operand', $._expression),
    )),

    call_expression: $ => prec(12, seq(
      field('function', $._expression),
      optional($.turbofish),
      field('arguments', $.argument_list),
    )),

    turbofish: $ => seq('::', $.generic_arguments),

    generic_arguments: $ => seq(
      '<',
      seq(
        $._type,
        repeat(seq(',', $._type)),
        optional(','),
      ),
      '>',
    ),

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
      field('field', $.identifier),
    )),

    index_expression: $ => prec(12, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
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

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    _type: $ => choice(
      $.primitive_type,
      $.type_identifier,
      $.generic_type,
      $.tuple_type,
      $.array_type,
      $.function_type,
      $.pointer_type,
      $.trait_object_type,
    ),

    primitive_type: $ => choice(
      'int',
      'float',
      'bool',
      'string',
      'void',
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

    array_type: $ => seq('[', $._type, ']'),

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

    pointer_type: $ => seq(
      choice('*const', '*mut'),
      $._type,
    ),

    trait_object_type: $ => seq(
      'dyn',
      $.trait_bounds,
    ),

    _literal: $ => choice(
      $.integer_literal,
      $.float_literal,
      $.boolean_literal,
      $.string_literal,
    ),

    integer_literal: $ => /\d+/,

    float_literal: $ => /\d+\.\d+/,

    boolean_literal: $ => choice('true', 'false'),

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
        /[nrt\\'"]/,
        /x[0-9a-fA-F]{2}/,
        /u\{[0-9a-fA-F]+\}/,
      ),
    )),

    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/',
    )),
  },
});
