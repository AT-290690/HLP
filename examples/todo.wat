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
    box; -> [a; : [:= [c; element ["div"]]; >> [a; -> [x; append [x; c]]]; c]];
    click; -> [e; c; dom_event [e; "click"; c]]
];

:= [root; |> [dom_get_root []]];
:= [add_todo; -> [e; : [append [add [|> [:= [component; element ["li"]]; class ["panel-block"]]; .: [
        add [|> [element ["span"]; class ["panel-icon"]]; .: [
          |> [element ["span"]; text ["✔"]]]]; 
       |> [element ["span"]; text [value [todo_input]]; class ["mr-2"]]; 
            |> [element ["button"]; class ["delete"]; class ["is-pulled-right"]; 
                click [-> [dom_detach [component]]]
               ]]]; todo_root];  clear [todo_input]]]];
|> [box [.: [
  add [|> [element ["section"]; class ["section"]]; .: [
  box [.: [
    |> [element ["h1"]; class ["title"]; text ["To-Do List"]];
    |> [box [.: [
      |> [box [.: [
        := [todo_input; |> [element ["input"]; class ["input"]; attribute ["placeholder"; "Add a new task"]]]
      ]]; class ["control"]; class ["is-expanded"]];
      |> [box [.: [|> [element ["button"]; class ["button"]; class ["is-primary"]; text ["Add"];
                       click [add_todo]
                      ]]]; class ["control"]]
    ]]; class ["field"]; class ["has-addons"]];
   := [todo_root; |> [element ["ul"]; class ["panel"]]]]]]]]]; append [root]]