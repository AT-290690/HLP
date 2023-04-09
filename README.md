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

[game_of_life.hlp](https://at-290690.github.io/hlp/?l=xaRbYTA7YjA7YzA7eDt5xajFk1vDjlvFqMODW8WSWyJiZyI7IiMwMDAiwrczO8WNW2QwO8WOW3U7xZ1bxaVbdcWoInB4IsWnTjsxNztlMDsxO3I7xZlbTjtlMMWoaMQLcsQXxZgxxahmMDtOO2fEBWgwxBpnMDtmMMWoaTA7xZFbxahqxVp4O3k7xL9bxBWbW8WXW3jHKnnFp2gw5ACEazA75ACkj%2BoApHciO2QwWzM4MMK3NDtsx0bFk1vCqFsiYnQixajCo1siKiLFqMOAW2vFRG3FJXQwO3UwO8ODxAnESGMiOyJ0ciI7ImIiOyJzMnTECmciO8WeW3UwOyIjZmZmIjvFZG7FP%2BQAo6JbxKtb5ADOjlt2xQ%2FFnlvFn1vFm8QPZjDFp8WEW2g7csWnxaTkANrFqMWNxE3CsFswOzHFqHfKC3jlANdsMFtyxahtMFsxxafmAJZj5QClYjA7dzA7YTA7eDDFp8S3xHx0MMK3Njtv6ACLecZ%2FjVt55gFtxY%2FEFuYA5mk7xAuiW8WjxB6e5ACfaTtnMMWoeTvFhFt55wHaeOQBcmnlAZN0MDtqMOUAsad5MMRCeDt5xG5w5gGrklt4OzA7eeQAt8UMMTt5OzDHDMWYzA7EJuYAj8goyg7GKs4ezhwxxadx5QDEWDtZ5wDeejDFXI9b5ACLjltB6AD25gCyxZdbWDvEvsQXeMWnxZdbWccOeeQBt8WjxD%2FFl8UGnsQzxL7EBmMwxajlAU16MMWncsVYbzDqAT7kApLGZXXMMkIwO3HnASTkAVOLxB7FoVtCMDsyxafEs8QnYuYArckeoMQeM9QexZ9bdcQNh9AiMcK3ODtz%2FwCU6ACUp8WTW8YNYTDlAkZ15AIuxUtjyCdiMMK3NztuxEzFqMKqW8WOW8WiW3IwW8WoczBb5AILMTAwxag%3D)

try the [editor](https://github.com/AT-290690/hlp/editor)
(type **spec** for language manual)

