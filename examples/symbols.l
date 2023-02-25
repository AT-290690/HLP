;; window
<- [SKETCH; MATH] [LIBRARY];
<- [make_sketch; set_opacity;set_line_width; set_fill; no_stroke; set_rotation; set_scale; UTILS; no_fill; set_stroke; set_position; make_group; make_rectangle; width; height; make_circle; set_screen_size] [SKETCH];
<- [make_grid; make_frame] [UTILS];
<- [PI] [MATH];
:= [make_symbol; -> [
  make_group [  
  |> [
    make_circle [width [0.5]; height [0.5]; 50];
    set_opacity [0.5];
    no_stroke [];
    set_fill ["orange"];
  ];
  |> [
    make_rectangle [width [0.5]; height [0.5]; 120; 120];
    no_fill [];
    set_line_width [2];
    set_stroke ["orange"];
    set_rotation [* [PI; 0.25]];
  ];
  |> [
    make_rectangle [width [0.5]; height [0.5]; 120; 120];
    no_fill [];
    set_line_width [2];
    set_stroke ["orange"];
  ]]
]];
make_sketch [200; 200; -> [: [
  make_frame[2];
  make_grid[8];
  |> [make_symbol []; set_scale [0.5]; set_position [0; 0]];
  |> [make_symbol []; set_scale [0.5]; set_position [100; 0]];
  |> [make_symbol []; set_scale [0.5]; set_position [0; 100]];
  |> [make_symbol []; set_scale [0.5]; set_position [100; 100]];
]]];
