# HLP

~\* Hyper Link Program

<p align="center">
<img width="100" src="./editor/assets/images/icon-512.png"/>
</p>
a programming language for writting ultra compressed code that fits in a link

here is an example program:

```rs
"Hello World"
```

I know that doesn't explain much ;)
here is a more complex example

## Game of Life

```rs
   ;; window
' [view; next; alive; x; y];
:= [
    px; -> [u; ~[`[u]; "px"]];
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];
    cells_container; |> [dom::get_root []; dom::set_style [::["w"; px [340]]]];

    make_button; -> [x; : [:= [b; |> [dom::create_element["bt"];
                                      dom::set_text_content["*"]]];
                                      dom::add_to[cells_container; b]; b]];
    fill; -> [cell; is_alive; dom::set_style [cell; :: ["c"; "tr"; "b"; "s1b"; "bg"; ? [is_alive; "#000"; "#fff"]]]];

  make_grid; -> [cells; : [

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]];
  ' [x; y];
  := [is_alive; math::random_int [0; 1];
      next_is_alive;math::random_int [0; 1];
      rect;|> [make_button [r]; fill [1]];
      cell; :: [alive; is_alive;
                next; next_is_alive;
                view; rect]];
  .: >= [cells; cell]]]]]];

iterate_cells; -> [cells; callback; : [
:= [y; -1];
>> [cells; -> [cell; i; cells; : [
  = [y; ? [% [i; rows];
  y; += [y]]];
  := [x; % [i; cols];
      cell; get_cell [x; y]];
  callback [cell; x; y]]]]]];
directions; .: [
  :: [x; 0; y; 1];
  :: [x; 1; y; 0];
  :: [x; -1; y; 0];
  :: [x; 0; y; -1];
  :: [x; 1; y; -1];
  :: [x; -1; y; -1];
  :: [x; 1; y; 1];
  :: [x; -1; y; 1]];

adjacent; -> [X; Y; : [
:= [sum; 0];
>> [directions; -> [dir; : [
  := [cell; get_cell [
    + [X; :: . [dir; x]];
    + [Y; :: . [dir; y]]]];
  = [sum; + [sum; ? [cell; :: . [cell; alive]; 0]]]]]]; sum]];

update_state; -> [iterate_cells [cells; -> [cell; x; y; : [
  := [is_alive; :: . [cell; alive];
  neighbors; adjacent [x; y]];
  ? [&& [is_alive; < [neighbors; 2]];
    :: . = [cell; next; 0];
      ? [&& [is_alive; > [neighbors; 3]];
        :: . = [cell; next; 0];
            ? [&& [! [is_alive];
              == [neighbors; 3]];
  :: . = [cell; next; 1]]]]]]]];

render; -> [iterate_cells [cells; -> [cell; x; y; : [
  := [is_alive; :: . [cell; alive]];
  |> [:: . [cell; view]; fill [is_alive]];
  :: . = [cell; alive; :: . [cell; next]]]]]]];

  make_grid [cells];
time::set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp/?l=xY5hMDtiMDtjMDt4O3nFksS4czA7xLl1O8WHxY91xZIicHgixZFOOzE3O2QwOzE7cjvFg047ZDDFkmg7xYNyxBUtMcWSZTA7TjtmxAVnMDvFg2YwO2XEIzA7xLzFkmnEUng7eTvEqmgwO8WFxYF4xiR5xZFnMCczO2owO8S%2Bw4TFksK8xL0idyI7czBbMzQwJzQ7a8Y7xYzEuGI7xL7CqCJidCLFksKjIioiJzM7w5pqMDtixZJixZFsxCp0MDt1MDvCvHQwO8S9ImMiOyJ0ciI7ImIiOyJzMcQGYmciO8WIdTA7IiMwMDAiOyIjZmZmIic0O23EP%2BQAnozEmmfEDHbEDMWIxYnFhXblAM6RxK9oO3LFkcWO5wEpxGqwMDsxxZJ3yQp45ADKazBbcsWSbDBbMcWR5QCKY%2BUAl2IwO3cwO2EwO3jETaRoMDt0MCc2O27HennFfbh55QFQxLrkATzkANBpO%2BUAlsWNeTvFiMWFaTtmMMWSeTvEr3knMzvEuHg7xBTkAW3ELDBb5ACckXkwW3TlAdAnNjtv5AGExL14OzA7eeQAosQLMTt5OzDGCy3LDMQixX3HI8gMxSTMGcwYMcWRcOQAq1g7WeUAwHowxU%2B6xHi5QeYA1OYAm8WBWDvEqUEwO3jFkcWBWcYMeSc0O8WNejA7xYHEBYjkATCpdOQCkMWS5AEeejDFkXHES24wW%2BgBE%2BQCS8RXdcssQjA7cOcA%2FsWIxLZ1MDvFi0IwOzLFkcSgdOUBfDDFksgaikIwOzPRGsWJdeQAurLOHTEnODty%2FwCBY%2BQB0b7FC2Ew5QH6dcQSxEJjxyNiMCc3O23EQ8WSwqrEucWMcTBbxZJyMFsnMzsxMDDFkg%3D%3D)
