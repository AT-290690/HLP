;; window
<- [SKETCH; MATH] [LIBRARY]; 
<- [make_scene; make_group; make_rectangle; update; play; draw; 
    insert_into_group; background; width; height; set_position;
    set_fill; set_stroke; make_circle; no_fill; no_stroke; set_rotation] [SKETCH]; 
<- [random_int; sin; cos; PI] [MATH];
:= [make_propeler; -> [x; y; freq; amp; offset; : [
  := [propeler; |> [make_circle [x; y; 3]]];
   draw [0; -> [f; a; : [
     set_position [propeler; 
                   + [x; * [sin [+ [offset; * [f; freq]]]; amp]]; 
                   + [y; * [cos [+ [offset; * [f; freq]]]; amp]]]]]]]]];

make_scene [400; 400; -> [: [
make_propeler[width[0.5]; height[0.5]; 0.35; 30; 4];
make_propeler[width[0.5]; height[0.5]; 0.35; 30; 2];
make_propeler[width[0.5]; height[0.5]; 0.35; 30; 0]]]]