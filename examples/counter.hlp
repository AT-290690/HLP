<- [DOM; EVENT] [LIBRARY];
<- [make_button; make_container; make_user_interface; set_text_content] [DOM];
<- [on_mouse_click] [EVENT];
make_user_interface [1];
:= [counter; 0];
make_container[|> [
  make_button [];
  set_text_content [counter];
  on_mouse_click [-> [button; set_text_content[button; += [counter]]]]]];
"Counter"