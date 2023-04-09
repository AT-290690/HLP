;; app
:= [content; |> [.: matrix [25; 25]; 
    .: map >> [-> [x; i;
   |> [x; .: map >> [-> [y; j; ? [== [% [+ [i; j]; 2]; 0]; " "; "*"]]];
       .: to_string [" "]]]];
   .: to_string ["\n"]]];
|> [dom_create_element["pre"]; 
    dom_set_style[::["c"; "#ff0"]];
    dom_append_to [dom_get_root[]]; 
    dom_set_text_content [content]]
