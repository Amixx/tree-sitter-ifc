#!/usr/bin/env sh
set -eu

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <ifc-file> [more files...]" >&2
  exit 1
fi

if ! command -v tree-sitter >/dev/null 2>&1; then
  echo "Error: tree-sitter CLI is required." >&2
  exit 2
fi

if ! command -v rg >/dev/null 2>&1; then
  echo "Error: ripgrep (rg) is required." >&2
  exit 2
fi

for file in "$@"; do
  if [ ! -f "$file" ]; then
    echo "== $file =="
    echo "  file not found"
    echo
    continue
  fi

  echo "== $file =="

  cache_dir="${XDG_CACHE_HOME:-$(pwd)/.tree-sitter-cache}"
  mkdir -p "$cache_dir"

  parse_output="$(XDG_CACHE_HOME="$cache_dir" tree-sitter parse "$file" 2>&1)" || {
    echo "  parse command failed:"
    printf '%s\n' "$parse_output" | sed 's/^/    /'
    echo
    continue
  }

  matches=$(
    printf '%s\n' "$parse_output" \
      | rg -o 'ERROR \[[0-9]+, [0-9]+\] - \[[0-9]+, [0-9]+\]' \
      | sort -u || true
  )

  if [ -z "$matches" ]; then
    echo "  no ERROR nodes"
    echo
    continue
  fi

  echo "$matches" | while IFS= read -r m; do
    [ -z "$m" ] && continue
    nums=$(printf '%s\n' "$m" | rg -o '[0-9]+' | tr '\n' ' ')
    # shellcheck disable=SC2086
    set -- $nums
    sr=$1
    sc=$2
    er=$3
    ec=$4

    line_no=$((sr + 1))
    col_no=$((sc + 1))
    end_line_no=$((er + 1))
    end_col_no=$((ec + 1))

    line_text=$(sed -n "${line_no}p" "$file")
    width=$((ec - sc))
    if [ "$width" -lt 1 ]; then
      width=1
    fi

    pad=$(printf '%*s' "$sc" '')
    carets=$(printf '%*s' "$width" '' | tr ' ' '^')

    echo "  ERROR at ${line_no}:${col_no} -> ${end_line_no}:${end_col_no}"
    echo "    $line_text"
    echo "    $pad$carets"
  done

  echo
done
