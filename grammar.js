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
const ATOM = `(?:${STRING}|${NUMBER}|#[0-9]+|\\.[A-Z0-9_]+\\.|\\$|\\*)`;
const ITEM = `(?:${ATOM}|[A-Z][A-Z0-9_]*${WS}\\(${WS}${ATOM}${WS}\\))`;
const sequence = item => `\\(${WS}(?:${item}(?:${WS},${WS}${item})*)?${WS}\\)`;
const PARAMETER = `(?:${ITEM}|${sequence(`(?:${ITEM}|${sequence(ITEM)})`)})`;

// Valid documents parse with these single-token shortcuts. A document with any syntax error is
// reparsed with `structured`, whose error recovery is unaffected by them.
module.exports = grammar(structured, {
  name: 'ifc',

  rules: {
    entity_instance: $ =>
      seq(
        $.instance_id,
        '=',
        $.entity_name,
        choice($.parameter_list, $.compact_parameter_list),
        ';'
      ),

    compact_parameter_list: $ => token(new RegExp(sequence(PARAMETER))),

    parameter: ($, original) => choice(original, alias($._quoted_string, $.string)),

    string: $ => token(new RegExp(STRING)),

    _quoted_string: ($, _) => structured.grammar.rules.string,
  }
});
