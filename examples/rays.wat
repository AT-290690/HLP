aliases= [cos; math_cos; sin; math_sin; PI; math_PI; insert; dom_insert; canvas; dom_canvas; get_context; canvas_get_context; stroke; canvas_stroke; stroke_style; canvas_stroke_style; begin_path; canvas_begin_path; move_to; canvas_move_to; line_to; canvas_line_to; line_width; canvas_line_width; attributes; dom_set_attributes]; 
:= [width; 500; 
	height; 350]; 
|> [:= [root; dom_get_root []]; 
	insert [:= [my_canvas; |> [canvas []; 
				attributes [:: ["w"; width; "h"; height]]]]]]; 
:= [ctx; get_context [my_canvas; "2d"]]; 
:= [line; -> [x1; y1; x2; y2; 
		|> [ctx; 
			begin_path []; 
			stroke_style ["#fff"]; 
			line_width [1.7]; 
			move_to [x1; y1]; 
			line_to [x2; y2]; 
			stroke []]]]; 

canvas_translate [ctx; * [width; 0.5]; * [height; 0.5]];

* loop [44; -> [
  i; line [0; 0; * [cos [i]; 100]; * [sin [i]; 100]];
]];
