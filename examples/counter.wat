;; app
:= [counter; 0];
|> [
  dom::create_element ["bt"];
  dom::set_text_content [counter];
  dom::append_to[dom::get_root[]];
  dom::event["click"; -> [e; key; dom::set_text_content[::.[e; "el"]; += [counter]]]]
];
