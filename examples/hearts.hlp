<- [SKETCH; MATH] [LIBRARY];
<- [make_scene; make_group; set_position_x; insert_into_group; make_rectangle; width; height; no_stroke; close_path; set_fill; set_screen_size; set_position; update; set_line_width; make_path] [SKETCH];
<- [sin; cos; pow] [MATH];

:= [RESOLUTION; 50;
   COLOR; "red";
   r; 2;
   brush; 3;
   pos x; -> [t; + [40; * [r; 16; pow [sin [t]; 3]]]];
   pos y; -> [t; 
                                      + [35; * [r; -1; 
                                  + [* [13; cos [t]]; 
                              * [-4; cos [* [2; t]]]; 
                              * [-2; cos [* [3; t]]];
                          * [-1; cos [* [4; t]]]]]]];
    
   make_heart_part; -> [i; |> [make_rectangle [
            pos x [i]; pos y [i]; brush; brush]; no_stroke []; set_fill [COLOR]]]];

:= [make_heart; -> [: [
  := [g; make_group []];
  ~= [loop; -> [i; : [
  insert_into_group [g; make_heart_part [i]]; 
  ? [> [i; 0]; loop [-= [i]]]]]][RESOLUTION]; g]]];

make_scene [880; 400; -> [: [
  ~= [loop; -> [i; bounds; : [
    |> [make_heart []; set_position_x [* [i; 100]]];
  ? [> [bounds; i]; loop [+= [i]; bounds]]]]][0; 10];
  ;; set_screen_size [880; 80];
  update[];
]]];
