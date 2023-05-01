  ;; app
  dom_load_bulma [0; 9; 4]; 
  aliases = [element; dom_create_element; value; dom_get_value; set; dom_set_attribute; get; dom_get_attribute; class; dom_add_class; attribute; dom_set_attributes; style; dom_set_style; text; dom_set_text_content; attach; dom_append_to; detach; dom_detach; insert; dom_insert; clear; dom_clear; click; dom_click; root; dom_get_root;
  px; units_pixels; vh; units_viewport_height];
  := [counter; 0];
  |> [
    := [r; |> [root []; style [:: ["bg"; "#000"; "h"; vh [100]]]]]; 
    insert [
  |> [
    element ["bt"];
    class ["button"];
    class ["is-primary"];
    class ["m-2"];
    style [:: ["w"; px [100]]];
    text [counter];
    click [-> [e; key; dom_set_text_content[::.[e; "el"]; += [counter]]]]
  ]]]

