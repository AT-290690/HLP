;; app
:= [counter; 0];
|> [
  dom_create_element ["bt"];
  dom_set_text_content [counter];
  dom_append_to[dom_get_root[]];
  dom_click [-> [e; key; dom_set_text_content[::.[e; "el"]; += [counter]]]]
];
