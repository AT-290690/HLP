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
|> [dom_get_body []; dom_set_style [:: ["bg"; "#000"]]];
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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=J1thO2I7YztkO2VdO8aiW8SCW8SRW107xqFbImJnIjsiIzAwMCLCtzM7xpxbZjvGnVt5O35bYFt5XTsicHgiXV07ZzsxNztoOzE7aTsqW2c7aF07ajsqW2k7aDstMV07aztnO2w7ZzttOypbbDtrXTtuO8agW107b8RLZDtlO8aOW247JVsrW2TFImVdXTttxG9w6ACOkucAjnciO2ZbMzgwwrc0O3HEPsaiW8O%2FW8OKW8OUWyJidCJdOyIqIl07cMQ%2BcsQhejtBO8SCW3rFP2MiOyJ0ciI7ImIiOyJzMnTECmciOz9bQTsiI2ZmZiI7xVpzxDluOzpbxbxbbcQMQjs6Wz9bIVslW0I7a11dO8aTW2o7aV1dOyfkAL9d5AEXQTvDqlswOzFdO0PJCkTkAL9yW3FbaV07MV1dO%2BUAhWM7QTtiO0M7YTtExEqGW247esK3Njt0xnVFOzpbxpxbZeUBOcaeW27EF3o7Rjs6Wz1bZTs%2FWyVbRjtsXeQBNZNbZecBlGQ7xBZrxGJv5QCSXTtFW3rkAdDEWnXkAW7GoVtkOzA7ZeQAmMUMMTtlOzDHDC3MDcQlxX3IJskNxSfNG80a5ADjduQAr0c7SOYAxknFVZ5bdcQWSsYU5ACjK1tHO8aNW0o7ZF1dOytbSMYNZeQBfD1bSTsrW0k7P%2BQBs41bejtjXeQBlTY7SV1dO3fESHToARTkAjrFU0HJKks7ducBAD9bxppbQTs8W0s7MuQBaIRbejti5ACPxxk%2BW0s7M9IZIVtBXTvGls4dMcK3ODt4zXzOeOUDNnJbxQ5hXTtByDtjxiFiwrc3O3Nbbl07w5hbxp1bOlt3W107eFvkAb4xMDBdOw%3D%3D)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)
