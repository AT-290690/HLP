;; app
 dom_load_milligram [1; 4; 1]; 
;; dom_load_bulma [0; 9; 4]; 
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
    click; dom_click
];

:= [root; |> [dom_get_root []]];
:= [add_todo; -> [e; : [
                   attach [add [
                    |> [:= [component; 
                            element ["li"]];
                            class ["panel-block"]; class ["pin"]]; .: [
                              add [|> [element ["sp"]; 
                                       class ["panel-icon"]]; .: [
                                         |> [element ["sp"]; 
                                             class ["pin"];
                                             text ["✔"]]]]; 
                                   |> [element ["sp"]; 
                                       text [value [todo_input]]; 
                                       class ["mr-2"]]; 
                                   |> [element ["bt"]; 
                                       text ["x"];
                                       style [:: ["margin-left"; "15px"]];
                                       click [-> [dom_detach [component]]]]]]; 
                            todo_root];  
                     clear [todo_input]]]];
|> [box [.: [
    add [|> [element ["sc"];
             class ["section"]]; .: [
            box [.: [
              |> [element ["h1"]; 
                  text ["To-Do List"]];
              |> [box [.: [
                |> [box [.: [
                    := [todo_input; |> [element ["ip"];
                                        style [:: ["c"; "#fff"]];
                                        class ["input"]; 
                                        set ["type"; "text"];
                                        set ["placeholder"; "Add a new task"]]]]]; 
                    class ["pin"]];
                |> [box [.: [
                    |> [element ["bt"]; 
                        class ["button"]; 
                        text ["Add"];
                        click [add_todo]]]];
                    class ["pin"]]
                  ]]; 
                  class ["pin"]];
             := [todo_root; |> [element ["ul"]; 
                                class ["pin"]]]]]]]]]; 
    attach [root]]