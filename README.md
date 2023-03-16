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

      get_cell; -> [x; y; ^ [cells; % [+ [x; * [rows; y]]; bound]]];

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
      + [X; . [dir; x]];
      + [Y; . [dir; y]]]];
    = [sum; + [sum; ? [cell; . [cell; alive]; 0]]]]]]; sum]];

  update_state; -> [iterate_cells [cells; -> [cell; x; y; : [
    := [is_alive; . [cell; alive];
    neighbors; adjacent [x; y]];
    ? [&& [is_alive; < [neighbors; 2]];
      .= [cell; next; 0];
        ? [&& [is_alive; > [neighbors; 3]];
          .= [cell; next; 0];
             ? [&& [! [is_alive];
               == [neighbors; 3]];
    .= [cell; next; 1]]]]]]]];

  render; -> [iterate_cells [cells; -> [cell; x; y; : [
    := [is_alive; . [cell; alive]];
    |> [. [cell; view]; opacity [is_alive]];
    .= [cell; alive; . [cell; next]]]]]]];

  sketch [W; H; "#666"; "white"];
|>[rectangle [10; 10; - [W; 20]; -[H; 20]]; fill ["white"]; fill_style [fill_styles[3]]; draw []];
   |> [cells;
      make_grid [];
      move [10; 10]];
clear_intervals [];
set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/sketch/?l=w4HFtzvDvDvFqzvFh8OXw5rDmcOBxJLDl8O8xArFrTvFr8OXxavFDYjDl8WHxQq4O8W5O8W7O8akO8aUO8W6O8W9O8W%2BO8ahO8aeO8SGO8agO8aAO8aBO8aTxCHGojvGmDvGmjvGmzvGnMOXxbfDmcOUYTA7YjA7YzA7eDt5w5nCuFc7MzE1O0jFBk47MTc7ZDA7MTtyO8OITjtkMMOZaDvDiHLEFS0xw5llMDtOO2bEBWcwO8OIZjA7ZcQjMDvCvMOZaTA7xpRbMcOZajA7wrl4O3k7w5VoMDvDisOGeMYtecOYZzAnMztrxCHEG5HCuHEwO8aeW8OYwqVnxBZyxBbDjcOOw4pyxV6Ywq9oO3LDmMOU5wCxczA7xJJbMDsxw5l0ygt1MDvDgsW6W8OKw4hyMDtyw5nkALfEQGg7csQPxoBbImJsYWNrIsOZxpNbaTDDmcaiW8OZxpxbczDDmHYwO8K9YzA7c%2BUBH3QwO2EwO3Uww5jEhltxxQqZwo5oMDt2MCc0O3Eww5hs5wDDd%2BYAxnnlAR%2FCuuQBC7l2MDtpO%2BUA38OSeTvDjcOKaTtmMMOZeTvCr3knMzvCuHg7xBTkATx2MDtqMFvkANuYdzBbduUBlyc2O23kAVPCvXg7MDt55ADfxAsxO3k75ACIvXg7LcsMxCLFfccjyAzFJMwZzBgxw5hu5ACrWDtZ5QDAeDDFT7rEeLl55gDU5gCbw4ZYO8OTeTA7eMOYw4ZZxgx5JzQ7w5J4MDvDhsQFjXYwO8OTduQCV8OZMCc2O3gww5hvxEtsMFvoARPlAhGR5QHAySx6MDtu5wD%2Bw43CtsQbkHowOzLDmMK%2FduUBijDDmcgaj3owOzPRGsOOc%2BQAurLOHTEnODtw%2FwCBYzDDmMOCxQth5AIO5gIJxUJjxyNiMCc3O8W4W1c7SDsiIzY2NiI7IndoaXRlIsOZ5QJvMTA7MTA7w4dXOzLkAJCHSMQImOQCbMgnxpNbxpRbM8OY5AJumMOCaDA7azDkAniYxj3DmMWvW8OZxa1bwrnDkW%2FEG3AwWyczOzEwMMOZ)
