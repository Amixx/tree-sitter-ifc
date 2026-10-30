/**
 * @file tree-sitter parser for ifc
 * @author Nepomuk Wolf
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const structured = require('./structured/grammar');

const WS = '[ \\t\\r\\n]*';
const NUMBER = '-?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)(?:[Ee][+-]?[0-9]+)?';
const STRING = "'(?:[^'\\/]|''|\\/+(?:[^'\\/*]|''))*\\/*'";
const ATOM = `(?:${STRING}|${NUMBER}|#[0-9]+|\\.[A-Za-z0-9_]+\\.|\\$|\\*)`;
const ITEM = `(?:${ATOM}|[A-Za-z_][A-Za-z0-9_]*${WS}\\(${WS}${ATOM}${WS}\\))`;
const sequence = item => `\\(${WS}(?:${item}(?:${WS},${WS}${item})*)?${WS}\\)`;
const PARAMETER = `(?:${ITEM}|${sequence(`(?:${ITEM}|${sequence(ITEM)})`)})`;

// Valid documents parse with these single-token shortcuts. A document with any syntax error is
// reparsed with `structured`, whose error recovery is unaffected by them.
module.exports = grammar(structured, {
  name: 'ifc',

  rules: {
    data_section: $ =>
      seq(
        'DATA;',
        repeat(choice($.entity_instance, alias($.compact_entity_instance, $.entity_instance))),
        'ENDSEC;'
      ),

    entity_instance: $ =>
      seq(
        $.instance_id,
        '=',
        $.entity_name,
        choice($.parameter_list, $.compact_parameter_list),
        ';'
      ),

    compact_parameter_list: $ => token(new RegExp(sequence(PARAMETER))),

    compact_entity_instance: $ => token(new RegExp(`#[0-9]+${WS}=${WS}[A-Za-z_][A-Za-z0-9_]*${WS}${sequence(PARAMETER)}${WS};`)),

    parameter: ($, original) => choice(original, alias($._quoted_string, $.string)),

    string: $ => token(new RegExp(STRING)),

    _quoted_string: ($, _) => structured.grammar.rules.string,
  }
});
