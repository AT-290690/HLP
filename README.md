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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xaRbYTA7YjA7YzA7eDt5xajFk1vDjlvFqMODW8WSWyJiZyI7MMK3MzvFjVtkMDvFjlt1O8WdW8WlW3XFqCJweCLFp047MTc7ZTA7MTtyO8WZW047ZTDFqGjEC3LEF8WYMcWoZjA7TjtnxAVoMMQaZzA7ZjDFqGkwO8WRW8WoasVaeDt5O8S%2FW8QVm1vFl1t4xyp5xado5QCEazA75ACfj%2BoAn3ciO2QwWzM4MMK3NDtsx0bFk1vCqFsiYnQixajCo1siKiLFqMOAW2vFRG3FJXQwO3UwO8ODxAnESGMiOyJ0ciI7ImIiOyJzMnTECmciO8WeW3UwOyIjZmZm5QEHNDtuxT%2FkAKOiW8SrW%2BQAzo5bdsUPxZ5bxZ9bxZvED2YwxafFhFtoO3LFp8Wk5ADaxajFjcRNwrBbMDsxxah3ygt45QDXbDBbcsWobTBbMcWn5gCWY%2BUApWIwO3cwO2EwO3gwxafEt8R8dDDCtzY7b%2BgAi3nGf41beeYBbcWPxBbmAOZpO8QLolvFo8QenuQAn2k7ZzDFqHk7xYRbeecB2njkAXJp5QGTdDA7ajDlALGneTDEQng7ecRucOYBq5JbeDswO3nkALfFDDE7eTswxwzFmMwOxCbmAI%2FIKMoOxirOHs4cMcWnceUAxFg7WecA3nowxVyPW%2BQAi45bQegA9uYAssWXW1g7xL7EF3jFp8WXW1nHDnnkAbfFo8Q%2FxZfFBp7EM8S%2BxAZjMMWo5QFNejDFp3LFWG8w6gE%2B5AKSxmV1zDJCMDtx5wEk5AFTi8QexaFbQjA7MsWnxLPEJ2LmAK3JHqDEHjPUHsWfW3XEDYfQIjHCtzg7c%2F8AlOgAlKfFk1vGDWEw5QJGdeQCLsVLY8gnYjDCtzc7bsRMxajCqlvFjlvFoltyMFvFqHMwW%2BQCCzEwMMWo)
