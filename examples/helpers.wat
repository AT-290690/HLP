;; app
dom_load_bulma [0; 9; 4]; 
:= [
    ;; aliases
    element; dom_create_element; 
    value; dom_get_value;
    attribute; dom_set_attribute;
    class; dom_add_class; 
    style; dom_set_style;
    text; dom_set_text_content;
    detach; dom_detach;
    append; dom_append_to;
    ;; helpers
    clear; -> [e; dom_set_value [e; ""]];
    add; -> [c; a; : [>> [a; -> [x; append [x; c]]]; c]];
    box; -> [a; : [:= [c; element ["d"]]; >> [a; -> [x; append [x; c]]]; c]];
    click; -> [e; c; dom_event [e; "cl"; c]]
];
:= [root; dom_get_root[]];
|> [.: [|> [element ["bt"]; class[ "button"]; text ["Hello"]]]; box []; append [root]]