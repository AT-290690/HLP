aliases= [canvas; dom_canvas; stroke_style; canvas_stroke_style; get_context; canvas_get_context; begin_path; canvas_begin_path; close_path; canvas_close_path; move_to; canvas_move_to; line_to; canvas_line_to; line_width; canvas_line_width; stroke; canvas_stroke]; 
:= [width; 400; 
	height; 200; 
	lines; 200; 
	frag; * [width; 
		/ [lines]]; 
	scale; * [height; 0.5]; 
	context; |> [canvas []; 
		dom_set_attributes [:: ["w"; width; "h"; height]]; 
		dom_append_to [dom_get_root []]; 
		get_context ["2d"]]]; 
|> [context; 
	stroke_style ["#fff"]; 
	move_to [0; scale]]; 
*loop [lines; 
	-> [i; 
		|> [context; 
			line_to [* [i; frag]; 
				* [math_sin [* [i; 
							/ [scale]]]; scale]]]]]; 
|> [context; 
	stroke []];