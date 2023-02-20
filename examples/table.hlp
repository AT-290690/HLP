;; window
<- [DOM; EVENT; STYLE; STRING] [LIBRARY];
<- [make_input; make_css_link; set_style; replace_children; insert_into_container; make_table_from; set_attribute; get_body; add_class; make_element; get_value; set_text_content; make_paragraph; make_user_interface; make_container] [DOM];
<- [on_input_change] [EVENT];
<- [add_class; background_color; make_style; make_class; text_align] [STYLE];
<- [trim] [STRING];
 |> [get _body []; set_style [text_align ["l"]]];

:= [transform; -> [value;|> [value; 
  .: from_string [","];
  .: map >> [-> [x; trim [x]]];
  .: chunks [2]]]];

make_user_interface [];
;; make_style [.: ["td"; "color: red"]; .: [""]];
:= [table_container; make_container []];
make_container[
    set_text_content [make_paragraph []; "Generate Table"];
  |> [make_input [];
  on_input_change [-> [value; : [|> [
    table_container;
    replace_children [|>[
     |> [transform [value]; make_table_from [value]]
    ]]]]]]];
  table_container];
0
;; name, age, power, Antony, 32, 9001, John, 44, -1, Mer, 33, 0