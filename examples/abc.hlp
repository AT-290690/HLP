;; app
<- [SKETCH; STRING] [LIBRARY];
<- [make_scene; make_rectangle; no_stroke; no_fill; 
    set_fill; set_stroke; set_position; update;
    set_scale; insert_into_group; make_group; 
    set_position_x; set_position_y] [SKETCH];
<- [trim] [STRING];
:= [fonts; :: []];
:= [make_abc; -> [raw; cols; rows; : [
 |> [raw; ::entries []; .:map>> [-> [entry; : [
    := [key; .:first [entry]];
    := [value; .:last [entry]];
    .= [fonts; key; |> [value; 
               trim [];
               .:from_string [" "];
               .:filter [-> [x; != [x; ""]]];
               .:map>> [-> [item;  == [item; "*"]]]]]]]]];
  -> [glyph; : [
    
  := [letter; . [fonts; glyph]];
  := [group; |> [make_group []; 
                set_position [20; 50]]];
  := [y; 0];
  ~= [loop; -> [i; bounds; : [
    := [x; % [i; cols]];
    ? [== [x; 0]; += [y]];
    ? [^ [letter; i];
         insert_into_group [group; 
         |> [make_rectangle [* [x; 10]; * [y; 10]; 10; 10];
            no_stroke []]]];
  ? [> [bounds; i]; loop [+= [i]; bounds]]]]];
  loop[0; - [* [rows; cols]; 1]]; 
  group]]]]];

:= [make_glyph; make_abc [:: [
"a"; 
"
    .  *  *  .
    .  .  .  *
    .  *  *  *
    *  .  .  *
    .  *  *  *
"; 
"b"; 
"
    *  .  .  .
    *  .  .  .
    *  *  *  . 
    *  .  .  * 
    *  *  *  .
";
"c"; 
"
    .  *  *  .
    *  .  .  *
    *  .  .  . 
    *  .  .  * 
    .  *  *  .
";
    "d"; 
"
    .  .  .  *
    .  .  .  *
    .  *  *  * 
    *  .  .  * 
    .  *  *  *
";
"e"; 
"
    .  *  *  .
    *  .  .  *
    *  *  *  * 
    *  .  .  . 
    .  *  *  .
";
"f"; 
"
    .  .  * *
    .  *  .  .
    *  *  *  * 
    .  *  .  . 
    .  *  .  .
";
"o"; 
"
    .  *  *  .
    *  .  .  *
    *  .  .  * 
    *  .  .  * 
    .  *  *  .
";
"z"; 
"
    *  *  *  *
    .  .  .  *
    .  *  *  . 
    *  .  .  . 
    *  *  *  *
";
" "; 
"
    .  .  .  .
    .  .  .  .
    .  .  .  . 
    .  .  .  . 
    .  .  .  .
";
  "0"; 
"
    .  *  *  .
    *  *  .  *
    *  .  .  * 
    *  .  *  * 
    .  *  *  .
";
"1"; 
"
    .  *  *  .
    .  .  *  .
    .  .  *  . 
    .  .  *  . 
    .  .  *  .
";
"2"; 
"
    .  *  *  *
    .  .  .  *
    .  .  *  . 
    .  *  .  . 
    .  *  *  *
"
]; 4; 5]];

make_scene [500; 500; -> [: [
  |> [make_glyph ["a"]; set_position_x [10]];
  |> [make_glyph ["b"]; set_position_x [60]];
  |> [make_glyph ["c"]; set_position_x [110]];
  |> [make_glyph ["2"]; set_position_x [160]];
  update [];
]]];