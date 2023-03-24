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
    .: append [cells; cell]]]]; cells_container]];

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

[game_of_life.hlp](https://at-290690.github.io/sketch/?l=w4jFozvEgTvFnjvFhsOcw5%2FDnsOIxJfDnMSBxArFoDvFosOcxZ7FDYfDnMWGxQqkO8WlO8WnO8adO8aFO8WmO8WpO8WqO8aaO8aXO8SLO8aZO8WxO8WyO8aExCHGmzvGiTvGkDvGkTvGksOcxaPDnsOaYTA7YjA7YzA7eDt5w57Dglc7MzE1O0jFBk47MTc7ZDA7MTtyO8OPTjtkMMOeaDvDj3LEFS0xw55lMDtOO2bEBWcwO8OPZjA7ZcQjMDvDhsOeaTA7xoVbMcOeajA7w4N4O3k7wrbEG5HDjXjGLXnDnWcwJzM7a8QhxBuYw4JxMDvGl1vDncKpxFODcsUWlMOVw5FyxV6dwrloO3LDncOa5wCxczA7xJdbMDsxw550ygt1MDvDicWmW8ORw49yMDtyw57kALfEQGg7csQPxbFbImJsYWNrIsOexoRbaTDDnsabW8OexpJbczDDnXYwO8OHYzA7c%2BUBH3QwO2EwO3Uww53Ei1txxQqewo5oMDt2MCc0O3Eww51s5wDDd%2BYAxnnlAR%2FDhOQA1YN2MDtpO8QKmMOZeTvDlMORaTtmMMOeeTvCuXknMzvDgng7xBTkATx2MDtqMFvkANuddzBbduUBlyc2O23lAVOHeDswO3nkAN%2FECzE7eTswxgstywzEIsV9xyPIDMUkzBnMGDHDnW7kAKtYO1nlAMB4MMVPhMR4g3nmANTmAJvDjVg7wrV5MDt4w53DjVnGDHknNDvDmXgwO8ONxAWUdjA7wrV25AJXw54wJzY7eDDDnW%2FES2wwW%2BgBE%2BQCEcRXc8ssejA7bucA%2FsOUw4BzMDvDl3owOzLDncKuduUBiuQAlscalnowOzPRGsOVc%2BQBnbzOHTEnODtw%2FwCBYzDDncOJxQth5AIO5gIJxUJjxyNiMCc3O8WkW1c7SDsiIzY2NiI7IndoaXRlIsOe5QJvMTA7MTA7w45XOzLkAJCOSMQIneQCbMgnxoRbxoVbM8Od5AJuncOJaDA7azDkAniJxj3DncWiW8OexaBbw4PDmG%2FEG3AwWyczOzEwMMOe)
