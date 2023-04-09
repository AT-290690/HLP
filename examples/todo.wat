;; app
dom_load_bulma [0; 9; 4]; 
:= [element; -> [e; dom_create_element[e]]; 
    clear; -> [e; dom_set_value [e; ""]];
    value; -> [e; dom_get_value [e]];
    attribute; -> [e; a; v; dom_set_attribute [e; a; v]];
    class; -> [e; c; dom_add_class [e; c]]; 
    style; -> [e; s; dom_set_style [e; s]];
    text; -> [e; t; dom_set_text_content [e; t]];
    detach; -> [e; dom_detach [e]];
    append; -> [e; c; dom_append_to [e; c]];
    add; -> [c; a; : [>> [a; -> [e; dom_insert [c; e]]]; c]];
    box; -> [a; : [:= [c; dom_create_element ["div"]]; >> [a; -> [e; dom_append_to [e; c]]]; c]];
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
   := [todo_root; |> [element ["ul"]; class ["panel"]]]]]]]]]; append [root]];
