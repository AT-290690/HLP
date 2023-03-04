;; app
<- [MATH; SKETCH] [LIBRARY];
<- [UTILS; make_scene; make_line; set_screen_size; make_rectangle; set_fill; make_text; no_stroke; update; width; height] [SKETCH];
<- [sin; cos; PI] [MATH];
<- [make_frame] [UTILS];
make_scene [40; 40; -> [: [
  := [mrsfns; -> [color; x; 
      |> [make_rectangle [x; 30; 9; 5]; 
          set_fill [color]; 
          no_stroke[]]]];
  |> ["AT29"; make_text[20; 15]; set_fill ["#fff"]];
  mrsfns["#f00"; 10];
  mrsfns["#0f0"; 20];
  mrsfns["#00f"; 30];
  make_frame[2];
  update []]]];