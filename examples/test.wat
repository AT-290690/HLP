;; app
' [element; text; append];
aliases = [<-; ::.];
:= [dom; :: [element; dom_create_element; text; dom_set_text_content; append; dom_append_to]];
|> [
  <- [dom; element] ["bt"];
  <- [dom; text] ["hello"];
  <- [dom; append] [dom_get_root[]]
]
