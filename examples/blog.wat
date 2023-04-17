;; app
dom_load_bulma [0; 9; 4]; 
:= [
    ;; aliases=
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
~*
["https://gist.githubusercontent.com/AT-290690/a06c8c5c5726e40ce7a1f24fba8cd601/raw/3a4bfbd7b842ab9eff33288bce47e6bfb4eba6cd/article.txt";
 -> [crates; : [
  <- .: [intro; exposition; goal; explanation; math; source; conclusion; _; .: . [crates; 0]];
  <- .: [title; subtitle; author; git; _; intro];
  |> [.: [
  |> [element ["h1"]; 
      text [title]; 
      class ["title"]];
  |> [element ["h2"]; 
      text [subtitle]];
  |> [element ["h3"]; 
      text [author]];
  |> [element ["a"]; 
      text [git]; 
      set ["href"; "https://github.com/AT-290690"]; 
      attach [element ["nav"]]];
  |> [exposition; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  |> [goal; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  |> [explanation; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  |> [math; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  |> [source; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  |> [conclusion; 
      .: map >> [-> [t; 
                     |> [element ["p"]; 
                         text [t]; 
                         style [:: ["txal"; "l"]]]]]; 
      box []; 
      class ["m-2"]];
  ]; 
  box []; 
  attach [root]]]]]