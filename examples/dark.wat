;; app
;; dom_load_milligram [1; 4; 1]; 
dom_load_bulma [0; 9; 4]; 
aliases = [element; dom_create_element; value; dom_get_value; change; dom_set_value; set; dom_set_attribute; get; dom_get_attribute; class; dom_add_class; attribute; dom_set_attributes; style; dom_set_style; text; dom_set_text_content; attach; dom_append_to; detach; dom_detach; insert; dom_insert; clear; dom_clear; click; dom_click; root; dom_get_root;  vh; units_viewport_height];
|> [
  := [r; |> [root []; style [:: ["bg"; "#000"; "h"; vh [100]]]]]; 
  insert [
    := [i; |> [element ["ip"]; class ["input"]; style [:: ["bg"; "#000"; "c"; "#fff"]]]];
    |> [element ["bt"]; text ["Hello"]; class ["button"]; class ["is-link"]; click [-> [
    |> [r; insert [: [
        := [v; value[i]];
        change [i; ""]; 
       |> [element ["p"]; text [~["Whaat is "; v; "?"]]; class ["sub-title"]; style [:: ["c"; "#fff"]]]]]]]]]]]