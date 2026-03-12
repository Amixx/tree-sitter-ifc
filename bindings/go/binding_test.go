package tree_sitter_ifc_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ifc "github.com/tree-sitter/tree-sitter-ifc/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ifc.Language())
	if language == nil {
		t.Errorf("Error loading Ifc grammar")
	}
}
