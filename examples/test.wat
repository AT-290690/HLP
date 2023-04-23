;; app
 dom_load_milligram [1; 4; 1]; 
;; dom_load_bulma [0; 9; 4]; 
aliases = [
    element; dom_create_element; 
    value; dom_get_value;
    set; dom_set_attribute;
    get; dom_get_attribute;
    class; dom_add_class; 
    attribute; dom_set_attributes;
    style; dom_set_style;
    text; dom_set_text_content;
    attach; dom_append_to;
    detach; dom_detach;
    insert; dom_insert;
    clear; dom_clear;
    add; dom_add_to_box;
    box; dom_box;
    click; dom_click;
    mouse_down; dom_mouse_down;
    mouse_up; dom_mouse_up;
    key_down; dom_key_down;
    key_up; dom_key_up;
    get_root; dom_get_root;
];

|> [get_root[]; insert [
  |> [element["bt"]; text [: [
:=[mult;->[x;y;z;*[x;y;z]]];:=[cap;->[B;ay;sdz;+[B;ay;sdz]]];:=[mult2;->[x2;y3;z3;*[x2;y3;z3]]];:=[cap2;->[B2;ay2;sdz2;+[B2;ay2;sdz2]]];:=[mult4;->[x4;y4;z4;*[x4;y4;z4]]];:=[cap4;->[B4;ay4;sdz4;+[B4;ay4;sdz4]]];:=[mult24;->[x24;y34;z34;*[x24;y34;z34]]];:=[cap24;->[B24;ay24;sdz24;+[B24;ay24;sdz24]]];:=[mult44;->[x44;y44;z44;*[x44;y44;z44]]];:=[cap44;->[B44;ay44;sdz44;+[B44;ay44;sdz44]]];:=[mult24;->[x2444;y3444;z3444;*[x2444;y3444;z3444]]];:=[cap24;->[B24444;ay24444;sdz24444;+[B24444;ay24444;sdz24444]]];:=[xmult;->[xx;xy;xz;*[xx;xy;xz]]];:=[xcap;->[xB;xay;xsdz;+[xB;xay;xsdz]]];:=[xmult2;->[xx2;xy3;xz3;*[xx2;xy3;xz3]]];:=[xcap2;->[xB2;xay2;xsdz2;+[xB2;xay2;xsdz2]]];:=[xmult4;->[xx4;xy4;xz4;*[xx4;xy4;xz4]]];:=[xcap4;->[xB4;xay4;xsdz4;+[xB4;xay4;xsdz4]]];:=[xmult24;->[xx24;xy34;xz34;*[xx24;xy34;xz34]]];:=[xcap24;->[xB24;xay24;xsdz24;+[xB24;xay24;xsdz24]]];:=[xmult44;->[xx44;xy44;xz44;*[xx44;xy44;xz44]]];:=[xcap44;->[xB44;xay44;xsdz44;+[xB44;xay44;xsdz44]]];:=[xmult24;->[xx2444;xy3444;xz3444;*[xx2444;xy3444;xz3444]]];:=[xcap242;->[xB24444;xay24444;xsdz24444;+[xB24444;xay24444;xsdz24444]]];mult[cap[2;4;xmult24[xmult44[3;2;11];cap24[3;4;5];xcap242[1;2;3]]];5;6] 
  ]]]
]]