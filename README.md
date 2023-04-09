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

    make_button; -> [x; |> [dom_create_element["bt"];
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
time_set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xaBbYTA7YjA7YzA7eDt5xaTFj1vDjVvFpMOCW8WOWyJiZyI7MMK3MzvFiVtkMDvFilt1O8WZW8WhW3XFpCJweCLFo047MTc7ZTA7MTtyO8WVW047ZTDFpGjEC3LEF8WUMcWkZjA7TjtnxAVoMMQaZzA7ZjDFpGkwO8XEbWrFWng7eTvEu1vEFZdbxZNbeMcqecWjaOUAhGswO%2BQAn47qAJ93IjtkMFszODDCtzQ7bMdGxY9bwqhbImJ0IsWkwqNbIirECL9ba8VEbcUldDA7dTA7w4LECcRIYyI7InRyIjsiYiI7InMydMQKZyI7xZpbdTA7IiNmZmblAQc0O27FP%2BQAo55bxKdb5ADOilt2xQ%2FFmlvFm1vFl8QPZjDFo8WAW2g7csWjxaDkANrFpMWJxE3CsFswOzHFpHfKC3jlANdsMFtyxaRtMFsxxaPmAJZj5QClYjA7dzA7YTA7eDDFo8SzxHx0MMK3Njtv6ACLecZ%2FiVt55gFtxYvEFuYA5mk7xAueW8WfxB6a5ACfaTtnMMWkeTvFgFt55wHaeOQBcmnlAZN0MDtqMOUAsaN5MMRCeDt5xG5w5gGrjlt4OzA7eeQAt8UMMTt5OzDHDMWUzA7EJuYAj8goyg7GKs4ezhwxxaNx5QDEWDtZ5wDeejDFXItb5ACLiltB6AD25gCyxZNbWDvEusQXeMWjxZNbWccOeeQBt8WfxD%2FFk8UGmsQzxLrEBmMwxaTlAU16MMWjcsVYbzDqAT7kApLGZXXMMkIwO3HnASTkAVOHxB7FnVtCMDsyxaPEr8QnYuYArckenMQeM9QexZtbdcQNg9AiMcK3ODtz%2FwCU6ACUo8WPW8YNYTDlAkZ15AIuxUtjyCdiMMK3NztuxEzFpMKqW8WKW8WeW3IwW8WkczBb5AILMTAwxaQ%3D)
