# HLP 
~* Hyper Link Program

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

Game of Life
```rs
;; window
<- [SKETCH; MATH; DOM; EVENT; STYLE] [LIBRARY]; 
<- [make_scene; make_group; make_rectangle; update; play; draw; 
    insert_into_group; background; width; height; set_position;
    set_fill; set_stroke; no_fill; no_stroke] [SKETCH]; 
<- [random_int] [MATH];
<- [set_style; make_user_interface; make_button; make_container; set_text_content] [DOM];
<- [on_mouse_click] [EVENT];
<- [cursor_pointer; padding; text_color; units_pixel; background_color; border] [STYLE];

' [view; next; alive; x; y];

:= [W; 415; H; 415;
    N; 20; 
    factor; 1; 
    r; * [N; factor];
    h; * [r; factor; -1];
    COLORS; .: [ "#ccc"; 0]; 
    cols; N; rows; N; cells; .: []; 
    bound; - [* [rows; cols]; 1];
    get_cell; -> [x; y; ^ [cells; + [x; * [rows; y]]]]; 

  make_grid; -> [cells; : [
:= [cells_container; make_group []]; 

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]]; 
  := [is_alive; random_int [0; 1];
      next_is_alive; random_int [0; 1]; 
      rect; |> [make_rectangle [% [* [count; r]; * [r; cols]]; h; r; r]; 
        set_fill [^ [COLORS; is_alive]];
        no_stroke []];
      cell; :: [alive; is_alive;
                next; next_is_alive;
                view; rect]]; 
  insert_into_group [cells_container; rect]; 
  .:append [cells; cell]; 
  ]]]; cells_container]];

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

adjacent; -> [x1; y1; : [
:= [sum; 0]; 
>> [directions; -> [dir; : [
  := [cell; get_cell [
    + [x1; . [dir; x]]; 
    + [y1; . [dir; y]]]]; 
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

 trottle; -> [delta; value; callback; 
             ? [! [% [delta; value]]; 
                       callback []]];

render; -> [iterate_cells [cells; -> [cell; x; y; : [
  := [is_alive; . [cell; alive]]; 
  set_fill [. [cell; view]; ^ [COLORS; is_alive]]; 
  .= [cell; alive; . [cell; next]]]]]]]; 

make_scene [W; H; -> [: [
 |> [cells; 
    make_grid []; 
    set_position [N; N]];
  draw [0; -> [delta; fps; trottle [delta; 8; -> [: [
    update_state []; 
    render []]]]]]; 
  play []]]];

make_user_interface [];
make_container [|> [
  make_button [];
  set_text_content["RESTART"];
  set_style [cursor_pointer []; 
  background_color ["#000"]; 
  text_color ["#fff"]];
  on_mouse_click [-> [
    >> [cells;  -> [current; : [
    .= [current; alive; random_int [0; 1]];
    .= [current; next; random_int [0; 1]]]]]]]]];
```
click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=w4HHlTvEgTvFsDvHjjvGs8OXw5rDmcOByIo7yJ07yKQ7yLU7yK07yLg7yIs7yIU7yJE7yJI7yYA7yLs7yLw7yLY7yLfDl8eVxDTEl8OXxIHECsaoO8W6O8aQO8asO8anw5fFsMQWx5DDl8eOxQqAO8a6O8eFO8a9O8a%2FO8a4w5fGs8OZw5RhMDtiMDtjMDt4O3nDmcK4Vzs0MTU7SMUGTjsyMDtkMDsxO3I7w4hOO2Qww5loO8OIcsQVLTHDmWUwO8K8IiNjY2MiOzDDmWYwO047Z8QFaMQZw5lpMDvDh8OIZzA7ZjDDmTHDmWowO8K5eDt5O8OVaDA7w4Z4O8UeeSc0O2vEG8QVkcK4cjA7yJ1bw5jCpWnEFnPEFsONw47DinPFS5jCr2g7csOYwrh0MDvEl1swOzHDmXXKC3YwO8OCyKRbw4rDiHMwO3LDmeQAtcQ5aDtyxA%2FIu1vDlWUwO3Qww5jIt1vDmHcwO8K9Y8QR5AEPdTA7YTA7dsQdi1tyxQqZwo5oMDt3MCc0O3Iww5hs5wCueOYAsXnlAQ%2FCuuQA%2BLl3MDtp5AECw5HDknk7w43Dimk7ZzDDmXk7wq95JzM7wrh4O8QU5AEUdzA7ajBb5AF8mHgwW3flAYcnNjtt5AFAwr14OzA7eeQA0cQLMTt55AFlxAstywzEIsV9xyPIDMUkzBnMGDHDmG7kAKt5MDt65gDCQTDFUbrEerlCxhTmAJ3DhnkwO8OTQjA7eMOYw4bEMMQN5AG0w5JB5AHGxAWNd8QYd%2BQCS8OZMCc2O0Eww5hvxE1sMFvoARflAfqR5QG2ySxDMDtu5wECw43CtsQbkEMwOzLDmMK%2Fd%2BUBjjDDmcgaj0MwOzPRGsOOdOQAvLLOHTEnODtwxHlEMDtF5gGq5QJDxQ%2FlAW8nMztx%2FwCiY%2BQCBLtbxQxhxG%2FoAjbFZmPHJmIwJzc7yIpbVztIO8K5w5HDgmgwO2swW8OZyYBbTjtOw5jIuFvnAItGMDtwMFtEMDs4xStvxCZxMFsnNjvIrVsnNDvFulvDmcasW8OCxpDECqdbIlJFU1RBUlQiw5nGqFvHgMQWv1siIzAwMCLDmceFWyIjZmZmIsOYx5BbwrnnAoVH5QHDv0flAKXnAxiYxRBiyBAnOTs%3D)

or try it in the [editor](https://at-290690.github.io/hlp/editor/) 
