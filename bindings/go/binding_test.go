package tree_sitter_kraken_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-kraken"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_kraken.Language())
	if language == nil {
		t.Errorf("Error loading Kraken grammar")
	}
}
