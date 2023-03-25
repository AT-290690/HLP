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
 <- [SKETCH; MATH; TIME; CONSOLE] [LIBRARY];
<- [random_int] [MATH];
<- [set_interval; clear_intervals] [TIME];
<- [console_log] [CONSOLE];
<- [sketch; line; circle; animate; fill_styles; rectangle; polygon; text; write; group; add; add_to; fill; stroke; fill_style; fill_styles; draw; move; scale; rotate; opacity] [SKETCH];
' [view; next; alive; x; y];
:= [W; 315; H; 315;
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    style; fill_styles[1];

    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];

  make_grid; -> [cells; : [
:= [cells_container; group []];

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]];
  ' [x; y];
  := [is_alive; random_int [0; 1];
      next_is_alive; random_int [0; 1];
      rect; |> [rectangle [% [* [count; r]; * [r; cols]]; h; r; r];
      fill ["black"];
      fill_style [style];
      draw [];   opacity [is_alive]];
      cell; :: [alive; is_alive;
                next; next_is_alive;
                view; rect]];
  add [cells_container; rect];
  .: >= [cells; cell]]]]; cells_container]];

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
  |> [:: . [cell; view]; opacity [is_alive]];
  :: . = [cell; alive; :: . [cell; next]]]]]]];

sketch [W; H; "#666"; "white"];
|>[rectangle [10; 10; - [W; 20]; -[H; 20]]; fill ["white"]; fill_style [fill_styles[3]]; draw []];
  |> [cells;
    make_grid [];
    move [10; 10]];
clear_intervals [];
set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/sketch/?l=w67GiTvEpzvGhDvFrMSCxIXEhMOuxL3EgsSnxArGhjvGiMSCxoTEDcWtxILFrMUXijvGizvGjTvHgzvGqzvGjDvGjzvGkDvHgDvGvTvEsTvGvzvGlzvGmDvGqsQhx4E7xq87xrY7xrc7xrjEgsaJxITEgGEwO2IwO2MwO3g7ecSEw6hXOzMxNTtIxQZOOzE3O2QwOzE7cjvDtU47ZDDEhGg7w7VyxBUtMcSEZTA7TjtmxAVnMDvDtWYwO2XEIzA7w6zEhGkwO8arWzHEhGowO8OpeDt5O8OaxBu3w7N4xi15xINnMCczO2vEIcQbvsOocTA7xr1bxIPDisRTqXLFFrrDu8O3csVeg8OfaDtyxIPEgOcAsXMwO8S9WzA7McSEdMoLdTA7w6%2FGjFvDt8O1cjA7csSE5AC3xEBoO3LED8aXWyJibGFjayLEhMaqW2kwxITHgVvEhMa4W3MwxIN2MDvDrWMwO3PlAR90MDthMDt1MMSDxLFbccUKhMOUaDA7djAnNDtxMMSDbOcAw3fmAMZ55QEfw6rkANWpdjA7aTvECr7Dv3k7w7rDt2k7ZjDEhHk7w595JzM7w6h4O8QU5AE8djA7ajBb5ADbg3cwW3blAZcnNjtt5AFTw614OzA7eeQA38QLMTt5O%2BQAiK14Oy3LDMQixX3HI8gMxSTMGcwYMcSDbuQAq1g7WeUAwHgwxU%2BqxHipeeYA1OYAm8OzWDvDmXkwO3jEg8OzWcYMeSc0O8O%2FeDA7w7PEBbrkAT6ZduQCV8SEMCc2O3gwxINvxEtsMFvoARPlAhG%2B5QHAySx6MDtu5wD%2Bw7rDpsQbvXowOzLEg8OQduUBiuQAlscavHowOzPRGsO7c8QKos4dMSc4O3D%2FAIFj5AJdr8ULYTDpAgnFQmPHI2IwJzc7xopbVztIOyIjNjY2Ijsid2hpdGUixITlAm8xMDsxMDvDtFc7MuQAhrRIxAiD5AJsyCfGqlvGq1szxIPkAm6Dw69oMDtrMOQCeK%2FGPcSDxojED4Zbw6nDvm%2FEG3AwWyczOzEwMMSE)
