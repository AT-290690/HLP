<- [DOM; STYLE] [LIBRARY];
<- [make_user_interface; make_container; insert_into_container; make_paragraph; set_text_content; set_style] [DOM];
<- [text_color] [STYLE];
make_user_interface[];
:= [container; make_container[]];
:= [flare; "https://gist.githubusercontent.com/";
    carrier; "AT-290690/"];

~* [~ [flare; carrier; "36cc81c2eada715e08c5db0c64f66296/raw/d0ddccfd277925c2d91d5e4f0673c645a0a3e66f/counter.bit"]; -> [crates; : [
   := [counter; ^ [crates; 0][]];
   * loop [10; -> [
      insert_into_container [container;
     |> [make_paragraph[]; set_text_content[counter []]; set_style[text_color ["#fff"]]]]
   ]]]]];