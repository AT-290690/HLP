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
;; app
' [view; next; alive; x; y];
|> [dom_get_body []; dom_set_style [:: ["bg"; 0]]];
:= [
    px; -> [u; ~ [` [u]; "px"]];
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];
    cells_container; |> [dom_get_root []; dom_set_style [:: ["w"; px [380]]]];

    make_button; -> [|> [dom_create_element["bt"];
                           dom_set_text_content["*"];
                    dom_append_to[cells_container]]];
    fill; -> [cell; is_alive; dom_set_style [cell; :: ["c"; "tr"; "b"; "s2t"; "bg"; ? [is_alive; "#fff"; 0]]]];

  make_grid; -> [cells; : [

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]];
  ' [x; y];
  := [is_alive; math_random_int [0; 1];
      next_is_alive;math_random_int [0; 1];
      rect;|> [make_button [r]; fill [1]];
      cell; :: [alive; is_alive;
                next; next_is_alive;
                view; rect]];
  .: >= [cells; cell]]]]]];

iterate_cells; -> [cells; callback; : [
:= [y; -1];
>> [cells; -> [cell; i; : [
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

render; -> [iterate_cells [cells; -> [cell; : [
  := [is_alive; :: . [cell; alive]];
  |> [:: . [cell; view]; fill [is_alive]];
  :: . = [cell; alive; :: . [cell; next]]]]]]];

  make_grid [cells];
time_set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=J1t2aWV3O25leHQ7YWxpdmU7eDt5XTvFllvDhVvDkFtdO8WVWyJiZyI7MMK3MzvFkFthMDvFkVt1O35bYFt1XTsicHgiXV07TjsxNztiMDsxO3I7KltOO2IwXTtoOypbcsQVLTFdO2MwO047ZMQFZTA7KltkMDtjMF07ZjA7xZRbXTtnxVV4O3k7xYJbZjA7JVsrW3jGJ3ldXTtlxX1oMOgAmJHnAJh3IjthMFszODDCtzQ7acVExCKCW8KjW8KpWyJidCJdOyIqIl07aMVCasUjdDA7cTA7w4XECcRGYyI7InRyIjsiYiI7InMydMQKZyI7P1txMDsiI2ZmZuUA%2FTQ7a8U%2BZjA7OlvErltlxQ5jb3VudDs6Wz9bIVslxw5jMF1dO8WHW2g7cl1dOyfkANdd5AE6cTA7wrJbMDsxXTtyygtz5QDWajBbaTBbcl07MV1dO%2BYAmOYBj3Ew5gGdcjA75QGqc8RdxLrkAId0MMK3Njts6ACWY2FsbGJhY2s7OlvFkFt55QF2xZLEGuYA9Gk7Ols9W3k7P1slW2k7ZDBd5AFuh1t55wHYeDvEF%2BQBlXQwO2cw5QC2XclVxEF4O3nEcW3lAbTFlVt4OzA7eeQAw8UMMTt5OzDHDC3MDcQl5QCMyCbJDcUnzRvNGuQBC27lAL5YO1nmANZ1MMVXklvkAIWRW2RpcsYY5gCzK1tYO8WBxRZ4XV07K1tZyA955AHAPcQ%2FK8QFP8QxxYHEBuUBZl3kAeE2O3XkAVxvxVpsMOoBOeQCl8Vmcc81djA7bugBKT9bxY7EITxbdjA7MuQBpLbEKuUBvDDKHz7EHzPWHyFbceQA3YrTIzHCtzg7cPEAmvQAluUDvWowW8YU5AI0XTtx5QI1xU%2FFJccxxFvCtzc7a8RTXTvCrFvFkVs6W28wW107cDBb5AIZMTAwXTs%3D)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)
