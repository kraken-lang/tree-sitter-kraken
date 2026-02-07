use tree_sitter::Language;

extern "C" {
    fn tree_sitter_kraken() -> Language;
}

pub fn language() -> Language {
    unsafe { tree_sitter_kraken() }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_can_load_grammar() {
        let language = language();
        assert_ne!(language.node_kind_count(), 0);
    }
}
