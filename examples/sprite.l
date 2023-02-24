<- [SKETCH; COLOR] [LIBRARY];
<- [make_scene; set_stroke; no_fill; make_group; background; get_rotation;width; height;
  no_stroke; update; make_rectangle; set_fill; set_opacity; set_position; insert_into_group;
  set_scale; sprite_play; make_sprite; set_rotation; set_screen_size; set_origin; make_group; UTILS] [SKETCH];
<- [make_rgb_color] [COLOR];
<- [make_grid; CANVAS] [UTILS];

:= [src; "./examples/game/ken-stance.png"];

make_scene [500; 500; -> [: [
:= [x; width [0.5]; y; height [0.5]; cols; 10; rows; 1; rate; 20];
:= [ken; |> [make_sprite [src; x; y; cols; rows; rate]]];
sprite_play[ken];
]]; CANVAS []];