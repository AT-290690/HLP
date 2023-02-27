<- [SKETCH; COLOR] [LIBRARY];
<- [make_scene; set_stroke; no_fill;
    make_group; background; get_rotation;
    width; height; no_stroke; update;
    make_rectangle; set_fill; set_opacity;
    set_position; insert_into_group; set_scale;
    set_rotation; set_screen_size;
    make_group] [SKETCH];
<- [make_rgb_color] [COLOR];

make_scene [125; 180; -> [: [
  := [make_key; -> [x; y; scale; color; : [
  := [key_group; |> [
      make_group [];
      set_scale [scale];
      set_position [x; y]]];
  := [rect; -> [x; y; w; h; |> [
    make_rectangle [x; y; w; h];
    set_fill [color]; 
    no_stroke[]]]];
  insert_into_group [key_group; 
    rect[15; 0; 50; 20]; 
    rect[0; 20; 20; 50]; 
    rect[15; 50; 50; 20];
    rect[50; 35; 20; 50]; 
    rect[20; 85; 20; 80]; 
    rect[30; 95; 30; 20]; 
    rect[35; 130; 50; 20]]]]];
  ;; MAIN KEY
  make_key [width[0.4]; height[0.1];
            0.30; "#ffffff"];
  ;; GROUP KEYS
  := [cols; 4];
  := [rows; * [cols; 2]];
  := [offset_x; 1];
  := [offset_y; 0];
  ~= [loop; -> [i; bounds; : [
     = [offset_x; + [offset_x; 25]];
     ? [== [% [i; cols]; 0]; 
          : [= [offset_x;  1];
              = [offset_y; 
                + [offset_y; i; 45]];  
              ]];
     make_key [+ [15; offset_x]; 
               + [offset_y; 30];
     0.25; 
     make_rgb_color [215; 225; 180]];
  ? [> [bounds; i]; loop [= [i; 
    + [i; 1]]; bounds]]]]]
    [0; - [rows; 1]];
  set_screen_size [125; 180];
  update []]]];