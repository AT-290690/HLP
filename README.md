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
;; share
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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=J1thMDtiMDtjMDt4O3ldO8akW8SCW8SRW107xqNbImJnIjsiIzAwMCLCtzM7xp5bZDA7xp9bdTt%2BW2BbdV07InB4Il1dO047MTc7ZTA7MTtyOypbTjtlMF07aDsqW3LEFS0xXTtmMDtOO2fEBWgwOypbZzA7ZjBdO2kwO8aiW107asVVeDt5O8aQW2kwOyVbK1t4xid5XV07aDDEfWsw6ACdkucAnXciO2QwWzM4MMK3NDtsxUTGpFvDv1vDilvDlFsiYnQiXTsiKiJdO2vFQm3FI3cwO3QwO8SCxAnERmMiOyJ0ciI7ImIiOyJzMnTECmciOz9bdDA7IiNmZmYiO8VhbsU%2BaTA7OlvFvFtoxQ5jb3VudDs6Wz9bIVslxw5mMF1dO8aVW2g7cl1dOyfkANdd5AE6dDA7w6pbMDsxXTt1ygt25QDWbTBbbDBbcl07MV1dO%2BYAmGPlAKdiMMQtYTA7dsVWiOQAgHcwwrc2O2%2FoAI9jYWxsYmFjazs6W8aeW3nlAW%2FGoMQa5gDtaTs6Wz1beTs%2FWyVbaTtnMF3kAWeVW3nnAdF4O8QX5AGOdzA7ajDlAK9dyVXEQXg7ecRxcOUBrcajW3g7MDt55AC8xQwxO3k7MMcMLcwNxCXlAIzIJskNxSfNG80a5AEEceUAvlg7WeYA1ngwxVegW%2BQAhZ9bZGlyxhjmALMrW1g7xo%2FFFnhdXTsrW1nID3nkAbk9xD8rxAU%2FxDHGj8QGYzBd5AHXNjt45AFZcsVXbzDqATbkAo3FY3TMMnkwO3HoASM%2FW8acxB48W3kwOzLkAZ6ExCdi5QCryB0%2BxB0z1B0hW3TkANOY0SExwrc4O3PxAJHxAI3lA6xtMFvGEWEwXTt0xRXFSGPIKWIwwrc3O27ESV07w5hbxp9bOltyMFtdO3MwW%2BQCAzEwMF07)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)
