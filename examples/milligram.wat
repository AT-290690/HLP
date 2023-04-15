;; app
dom_load_milligram [1; 4; 1]; 
:= [
    ;; aliases
    element; dom_create_element; 
    value; dom_get_value;
    set; dom_set_attribute;
    get; dom_get_attribute;
    class; dom_add_class; 
    style; dom_set_style;
    text; dom_set_text_content;
    attach; dom_append_to;
    detach; dom_detach;
    clear; dom_clear;
    add; dom_add_to_box;
    box; dom_box;
    click; dom_click
];
:= [root; |> [dom_get_root []]];
:= [bq; |> [element ["blockquote"]; class ["pin"]; attach[root]]];
|> [
  element ["sp"];
  class ["pin"]; 
  text ["HLP is awesome"];
  attach [
    |> [element ["p"]; attach [|> [element ["em"]; attach [bq]]]]
  ]
]; 







;; app
dom_load_milligram [1; 4; 1]; 
:= [
    ;; aliases
    element; dom_create_element; 
    value; dom_get_value;
    set; dom_set_attribute;
    get; dom_get_attribute;
    class; dom_add_class; 
    style; dom_set_style;
    text; dom_set_text_content;
    attach; dom_append_to;
    detach; dom_detach;
    insert; dom_insert;
    clear; dom_clear;
    add; dom_add_to_box;
    box; dom_box;
    click; dom_click;
];
:= [root; |> [dom_get_root []]];
:= [bq; |> [element ["blockquote"]; class ["pin"]; attach[root]; insert [
  |> [element ["em"]; insert [
      |> [element ["p"]; insert [
        |> [
  element ["sp"];
  class ["pin"]; 
  text ["HLP is awesome as fuck!"]]]]]]]]];
 