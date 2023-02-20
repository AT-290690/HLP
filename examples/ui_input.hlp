;; window
<- [DOM; EVENT] [LIBRARY];
<- [make_input; get_value; set_text_content; make_paragraph; make_user_interface; make_container] [DOM];
<- [on_input_change] [EVENT];

:= [transform; -> [value;|> [value; 
  .: from_string [""];
  .: map >> [-> [x; `[x]]];
  .: map >> [-> [x; * [x; 2]]];
  .: reduce >> [-> [acc; x; + [acc; x]]; 0];
  * [100]
]]];

make_user_interface [];
make_container[
    set_text_content [make_paragraph []; "Calculate something"];
  |> [make_input [];
  on_input_change [-> [value; set_text_content [par; transform [value]]]]
]; := [par; make_paragraph []]];