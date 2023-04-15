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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xaZbYTA7YjA7YzA7eDt5xarFlVvDkFvFqsOFW8WUWyJiZyI7MMK3MzvFj1tkMDvFkFt1O8WfW8WnW3XFqiJweCLFqU47MTc7ZTA7MTtyO8WbW047ZTDFqmjEC3LEF8WaMcWqZjA7TjtnxAVoMMQaZzA7ZjDFqmkwO8WTW8WqasVaeDt5O8WBW8QVnVvFmVt4xyp5xalo5QCEazA75ACfkeoAn3ciO2QwWzM4MMK3NDtsxUbFlVvCqVsiYnQixarCo1siKiLFqsOCW2vFQm3FI3QwO3UwO8OFxAnERmMiOyJ0ciI7ImIiOyJzMnTECmciO8WgW3UwOyIjZmZm5QEFNDtuxT%2FkAKGkW8StW%2BQAzJBbdsUPxaBbxaFbxZ3ED2YwxanFhltoO3LFqcWm5ADYxarFj8RNwrJbMDsxxap3ygt45QDVbDBbcsWqbTBbMcWp5gCWY%2BUApWIwO3cwO2EwO3gwxanEucR8dDDCtzY7b%2BgAi3nGf49beeYBa8WRxBbmAOZpxRulxBug5ACcaTtnMMWqeTvFhlt55wHVeOQBbWnlAY50MDtqMOUArql5MMQ%2FeDt5xGtw5gGmlFt4OzA7eeQAtMUMMTt5OzDHDMWazA7EJuYAjMgoyg7GKs4ezhwxxalx5QDBWDtZ5wDbejDFXJFb5ACLkFtB6ADz5gCyxZlbWDvFgMQXeMWpxZlbWccOeeQBtMWlxD%2FFmcUGoMQzxYDEBmMwxarlAUp6MMWpcsVYbzDqATvlAo3FZXXMMkIwO3HnASTkAVONxR6jW0IwOzLFqcS1xCdi5gCtyR6ixB4z1B7FoVt1xA2J0CIxwrc4O3PxAJTyAJCpxZVbxg1hMOUCP3XkAifFR2PIJ2Iwwrc3O27ESMWqwqxb5AMkpFtyMFvFqnMwW%2BQCBzEwMMWq)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)

