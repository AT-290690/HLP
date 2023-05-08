# HLP

~\* Hyper Link Program

<p align="center">
<img width="100" src="./editor/assets/images/icon-512.png"/>
</p>
a toy programming language for writting compressed code that fits in a link

here is an example program:

```rs
"Hello World"
```

I know that doesn't explain much ;)
here is a more complex example

## Game of Life

```rs
aliases= [element; dom_create_element; attribute; dom_set_attributes; text; dom_set_text_content; attach; dom_append_to; style; dom_set_style; click; dom_click; get_root; dom_get_root; canvas; dom_canvas; get_context; canvas_get_context; fill_style; canvas_fill_style; fill_rect; canvas_fill_rect];
' [x; y];
:= [N; 24;
	SIZE; 360;
	rec; 0;
	PLAY_ICON; "⏵";
	PAUSE_ICON; "⏸";
	ALIVE_COLOR; "#f12";
	DEAD_COLOR; "#222";
	CELL_SIZE; * [SIZE;
		/ [N]];
	r; N;
	h; * [N; -1];
	bounds; * [N; N];
	init; -> [N;
		|> [.:... [N];
			.:map>> [-> [0]]]];
	cells; init [bounds];
	next; init [bounds];
;; Moore neighborhood map
 directions;
	.: [:: [x; 0; y; 1];
		:: [x; 1; y; 0];
		:: [x; -1; y; 0];
		:: [x; 0; y; -1];
		:: [x; 1; y; -1];
		:: [x; -1; y; -1];
		:: [x; 1; y; 1];
		:: [x; -1; y; 1]];
	;; Single dimension iteration
	iterate_cells; -> [cells; callback;
		: [:= [Y; -1];
			>> [cells;
				-> [cell; i;
					: [= [Y;
							? [% [i; N]; Y;
								+= [Y]]];
						:= [X; % [i; N];
	cell; get_cell [cells; X; Y]];
						callback [cell; X; Y]]]]]];
;; getters and setters
 get_cell;
	-> [board; X; Y;
		.:. [board;
			% [+ [X;
					* [N; Y]]; bounds]]]; set_cell;
	-> [board; X; Y; val;
		.:.= [board;
			% [+ [X;
					* [N; Y]]; bounds]; val]];
  ;; Sum neighborhood
	adjacent; -> [X; Y;
		: [:= [sum; 0];
			>> [directions;
				-> [dir;
					: [+= [sum;
							get_cell [cells;
								+ [X;
									::. [dir; x]];
								+ [Y;
									::. [dir; y]]]]]]]; sum]];
	render; -> [board;
		iterate_cells [board;
			-> [is_alive; X; Y;
				: [|> [ctx;
						fill_style [? [is_alive; ALIVE_COLOR; DEAD_COLOR]];
						fill_rect [* [CELL_SIZE; X];
							* [CELL_SIZE; Y]; CELL_SIZE; CELL_SIZE]]]]]];
;; Game of Life logic
 update_state;
	-> [iterate_cells [cells;
			-> [is_alive; X; Y;
				: [:= [neighbors; adjacent [X; Y]];
					? [&& [is_alive;
							< [neighbors; 2]];
						set_cell [next; X; Y; 0];
						? [&& [is_alive;
								> [neighbors; 3]];
							set_cell [next; X; Y; 0];
							? [&& [! [is_alive];
									== [neighbors; 3]];
								set_cell [next; X; Y; 1];
								set_cell [next; X; Y; is_alive]]]]]]]]];
:= [root; get_root []];
|> [element ["p"];
	text ["Click on the canvas to draw cells"];
	attach [root]];
;; Drawing UI
:= [ctx; |> [canvas [];
		attach [root];
		attribute [:: ["w"; SIZE; "h"; SIZE]];
		click [-> [e;
				: [:= [X; math_floor [* [::. [e; "ox"];
								/ [CELL_SIZE]]]];
					:= [Y; math_floor [* [::. [e; "oy"];
								/ [CELL_SIZE]]]];
					= [rec; 0];
					text [control; PLAY_ICON];
					:= [is_alive; get_cell [cells; X; Y]];
					set_cell [cells; X; Y;
						? [is_alive; 0; 1]];
					render [cells]]]];
		get_context ["2d"]]];
;; Canvas
|> [ctx;
	fill_style [DEAD_COLOR];
	fill_rect [0; 0; SIZE; SIZE]];
;; Animation function
:= [step; -> [: [update_state [];
			render [next];
			= [cells; next];
			= [next;
				init [bounds]]]]];
:= [play; -> [time_set_timeout [-> [: [? [rec;
						: [step [];
							play []]]]]; 150]]];
;; Play / Pause UI
|> [:= [control; element ["bt"]];
	text [PLAY_ICON];
	click [-> [: [text [control;
					? [= [rec;
							! [rec]]; PAUSE_ICON; PLAY_ICON]];
				play []]]];
	attach [|> [element ["div"];
			attach [root]]]];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=J1thO2JdO8adW2M7MjQ7ZDszNjA7ZTswO2Y7IuKPtSI7Z8QIuCI7aDsiI2YxMiI7aTsiIzIyMiI7ajsqW2Q7L1tjXV07aztjO2w7KltjOy0xXTttxQpjXTtuO8aeW2M7xaBbxoBbY13EDjDCtzM7bztuW21dO3DGB3E7xqFbxqJbYTswO2I7MV07xQwxO2I7MMcMLcwNxCXEZskmyQ3FJ80bzRoxXV07cuQAhG87eDs6W8adW3nGLp9bb8QXejtBOzpbPVt5Oz9bJVtB5ADBeTvGlFt55ACzxp1bQjvHFno7c1tvO0I7eV1dO3hbesQKwrc2O3PERUPEDjvGj1tDOyVbK1tC5QELxCltxEZ0yiNEO8aG0iVdO0RdXTt1xCfEJeUApkXlAPufW3HEFkbEFJRbReUAg8Q7xo5bRjthXV07K1t5xg1iwrc3O0VdXTt2xm5yW0PECUfFdzpbw6Zbw51bSjs%2FW0c7aDtpXV07KltqO0LGB3ldO2o7asK3NTt3xDRy5gEayDvGnVtIO3XkAJpdXTs%2FW8abW0c7PFtIOzJdXTt0W3DFJjDJGj5bSDsz0xohW0ddO8aXzx4xygtHwrc55AFxSTvEkltdXTvDv1vDilvDlFsicCJdOyJDbGljayBvbiB0aGUgY2FudmFzIHRvIGRyYXcgY2VsbHMiXTtJ5QLUSjvDllvFilvDk1vDv1vEuVvGGaJbInciO2Q7ImgiO2Rd5QKXS%2BYA3kI7xKtbKlvGjltLOyJveCJdOy9basK3NMRNec0cecocPVtl5ADcw4pbTjtmxXhH6wIhdMYK5QFvMOUChHZbb8Q3IjJkIuQA3ecBj2ldOzA7MDtkO2TFQ0zkAJY6W3dbxDBwXTs9W287xQflAzXkAaHGnVtNxCXDpVvFKz9bZTs6W0xbXTtNW8QgMTXlA2zDv%2BUBAorkAN9OO%2BQBRWJ0xHjkAKrEN%2BUAtz9b5ADFIVtlXV07ZztmXcZENMQ9xDJkaXblAVRdOw%3D%3D)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)

## How it works

The above code is minified removing white space and turning user variables to a single character

```
'[a;b];:=[c;24;d;360;e;0;f;"⏵";g;"⏸";h;"#f12";i;"#222";j;*[d;/[c]];k;c;l;*[c;-1];m;*[c;c];n;->[c;.:map>>[.:...[c];->[0]]];o;n[m];p;n[m];q;.:[::[a;0;b;1];::[a;1;b;0];::[a;-1;b;0];::[a;0;b;-1];::[a;1;b;-1];::[a;-1;b;-1];::[a;1;b;1];::[a;-1;b;1]];r;->[o;x;:[:=[y;-1];>>[o;->[z;A;:[=[y;?[%[A;c];y;+=[y]]];:=[B;%[A;c];z;s[o;B;y]];x[z;B;y]]]]]];s;->[C;B;y;.:.[C;%[+[B;*[c;y]];m]]];t;->[C;B;y;D;.:.=[C;%[+[B;*[c;y]];m];D]];u;->[B;y;:[:=[E;0];>>[q;->[F;:[+=[E;s[o;+[B;::.[F;a]];+[y;::.[F;b]]]]]]];E]];v;->[C;r[C;->[G;B;y;:[canvas_fill_rect[canvas_fill_style[J;?[G;h;i]];*[j;B];*[j;y];j;j]]]]];w;->[r[o;->[G;B;y;:[:=[H;u[B;y]];?[&&[G;<[H;2]];t[p;B;y;0];?[&&[G;>[H;3]];t[p;B;y;0];?[&&[![G];==[H;3]];t[p;B;y;1];t[p;B;y;G]]]]]]]]];:=[I;dom_get_root[]];dom_append_to[dom_set_text_content[dom_create_element["p"];"Click on the canvas to draw cells"];I];:=[J;canvas_get_context[dom_click[dom_set_attributes[dom_append_to[dom_canvas[];I];::["w";d;"h";d]];->[K;:[:=[B;math_floor[*[::.[K;"ox"];/[j]]]];:=[y;math_floor[*[::.[K;"oy"];/[j]]]];=[e;0];dom_set_text_content[N;f];:=[G;s[o;B;y]];t[o;B;y;?[G;0;1]];v[o]]]];"2d"]];canvas_fill_rect[canvas_fill_style[J;i];0;0;d;d];:=[L;->[:[w[];v[p];=[o;p];=[p;n[m]]]]];:=[M;->[time_set_timeout[->[:[?[e;:[L[];M[]]]]];150]]];dom_append_to[dom_click[dom_set_text_content[:=[N;dom_create_element["bt"]];f];->[:[dom_set_text_content[N;?[=[e;![e]];g;f]];M[]]]];dom_append_to[dom_create_element["div"];I]];
```

Then mangled - remplacing build-ins with a single character and grouping closing parens ( ]]]] = ·4 )

```
'[a;b];Ɲ[c;24;d;360;e;0;f;"⏵";g;"⏸";h;"#f12";i;"#222";j;*[d;/[c]];k;c;l;*[c;-1];m;*[c;c];n;ƞ[c;Š[ƀ[c];ƞ[0·3;o;n[m];p;n[m];q;ơ[Ƣ[a;0;b;1];Ƣ[a;1;b;0];Ƣ[a;-1;b;0];Ƣ[a;0;b;-1];Ƣ[a;1;b;-1];Ƣ[a;-1;b;-1];Ƣ[a;1;b;1];Ƣ[a;-1;b;1]];r;ƞ[o;x;:[Ɲ[y;-1];Ɵ[o;ƞ[z;A;:[=[y;?[%[A;c];y;Ɣ[y·3;Ɲ[B;%[A;c];z;s[o;B;y]];x[z;B;y·6;s;ƞ[C;B;y;Ə[C;%[+[B;*[c;y]];m·3;t;ƞ[C;B;y;D;Ɔ[C;%[+[B;*[c;y]];m];D]];u;ƞ[B;y;:[Ɲ[E;0];Ɵ[q;ƞ[F;:[Ɣ[E;s[o;+[B;Ǝ[F;a]];+[y;Ǝ[F;b·7;E]];v;ƞ[C;r[C;ƞ[G;B;y;:[æ[Ý[J;?[G;h;i]];*[j;B];*[j;y];j;j·5;w;ƞ[r[o;ƞ[G;B;y;:[Ɲ[H;u[B;y]];?[ƛ[G;<[H;2]];t[p;B;y;0];?[ƛ[G;>[H;3]];t[p;B;y;0];?[ƛ[![G];Ɨ[H;3]];t[p;B;y;1];t[p;B;y;G·9;Ɲ[I;Ē[]];ÿ[Ê[Ô["p"];"Click on the canvas to draw cells"];I];Ɲ[J;Ö[Ŋ[Ó[ÿ[Ĺ[];I];Ƣ["w";d;"h";d]];ƞ[K;:[Ɲ[B;ī[*[Ǝ[K;"ox"];/[j·4;Ɲ[y;ī[*[Ǝ[K;"oy"];/[j·4;=[e;0];Ê[N;f];Ɲ[G;s[o;B;y]];t[o;B;y;?[G;0;1]];v[o·4;"2d"]];æ[Ý[J;i];0;0;d;d];Ɲ[L;ƞ[:[w[];v[p];=[o;p];=[p;n[m·5;Ɲ[M;ƞ[å[ƞ[:[?[e;:[L[];M[·5;150·3;ÿ[Ŋ[Ê[Ɲ[N;Ô["bt"]];f];ƞ[:[Ê[N;?[=[e;![e]];g;f]];M[·4;ÿ[Ô["div"];I]];
```

Then the mangled version gets base64 encoded with further LZW compression applied (see the link above)

## Local use:

```
npm run hlp -help
npm run hlp -file ./examples/hello.wat -run
```

Develop:

```
npm install --save-dev
npm run watch
```

Generate types used in compilation and compression

```
npm run hlp -types
```
