;; window
|> [.: matrix [25; 25]; 
    .: map >> [-> [x; i;
   |> [x; .: map >> [-> [y; j; ? [== [% [+ [i; j]; 2]; 0]; " "; "*"]]];
       .: to_string [" "]]]];
   .: to_string ["\n"]]