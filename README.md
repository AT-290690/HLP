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
:= [
    px; -> [u; ~[`[u]; "px"]];
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];
    cells_container; |> [dom_get_root []; dom_set_style [::["w"; px [340]]]];

    make_button; -> [x; |> [dom_create_element["bt"];
                                      dom_set_text_content["*"];
                                      dom_append_to[cells_container]]];
    fill; -> [cell; is_alive; dom_set_style [cell; :: ["c"; "tr"; "b"; "s1b"; "bg"; ? [is_alive; "#000"; "#fff"]]]];

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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xaBbYTA7YjA7YzA7eDt5xaTFiVtkMDvFilt1O8WZW8WhW3XFpCJweCLFo047MTc7ZTA7MTtyO8WVW047ZTDFpGjEC3LEF8WUMcWkZjA7TjtnxAVoMMQaZzA7ZjDFpGkwO8WNW8WkasVaeDt5O8S7W8QVl1vFk1t4xyp5xaNoMMK3MztrMDvFj1vDjlvFpMOCW8WOWyJ3IjtkMFszNDDCtzQ7bMdGxY9bwqhbImJ0IsWkwqNbIirECL9ba8VEbcUldDA7dTA7w4LECcRIYyI7InRyIjsiYiI7InMxxAZiZyI7xZpbdTA7IiMwMDAiOyIjZmZmIsRpbsVE5AConlvEp1vkANOKW3bFD8WaW8WbW8WXxA9mMMWjxYBbaDtyxaPFoOQA3%2BUBR3UwO8KwWzA7McWkd8oLeOUA3GwwW3LFpG0wWzHFo%2BYAm2PlAKpiMDt3MDthMDt4MMWjxLPEfHQwwrc2O2%2FoAIt5xn%2BJW3nmAXLFi8QW5gDraTvEC55bxZ%2FEHprkAJ9pO2cwxaR5O8WAW3nkARfFieQBOcQY5AGYdDA7ajDlALGjeTDEQng7ecRucOYBsI5beDswO3nkALfFDDE7eTswxwzFlMwOxCbmAI%2FIKMoOxirOHs4cMcWjceUAxFg7WecA3nowxVyLW%2BQAi4pbQegA9uYAssWTW1g7xLrEF3jFo8WTW1nHDnnkAbfFn8Q%2FxZPFBprEM8S6xAZjMMWk5QFNejDFo3LFWG8w6gE%2B5AKXxmV1zDJCMDtx5wEk5AFTh8QexZ1bQjA7MsWjxK%2FEJ2LmAK3JHpzEHjPUHsWbW3XEDYPQIjHCtzg7c%2F8AlOgAlKPFj1vGDWEw5QJGdeQCLsVLY8gnYjDCtzc7bsRMxaTCqlvFilvFnltyMFvFpHMwW%2BQCCzEwMMWk)
