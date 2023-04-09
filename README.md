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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xaBhMDtiMDtjMDt4O3nFpMWJZDA7xYp1O8WZxaF1xaQicHgixaNOOzE3O2UwOzE7cjvFlU47ZTDFpGg7xZVyxBUtMcWkZjA7TjtnxAVoMDvFlWcwO2YwxaRpMDvFjcWkasRSeDt5O8S7xBKXxZN4xiR5xaNoMCczO2swO8WPw47FpMOCxY4idyI7ZDBbMzQwJzQ7bMY7xY%2FCqCJidCLFpMKjIirEB79rxDltxB90MDt1MDvDgnQwO8WOImMiOyJ0ciI7ImIiOyJzMcQGYmciO8WadTA7IiMwMDAiOyIjZmZmIic0O27EP%2BQAk57Ep%2BQAuIp2xAzFmsWbxZd25QDDo8WAaDtyxaPFoOcBHnUwO8KwMDsxxaR3yQp45AC%2FbDBbcsWkbTBbMcWj5QCKY%2BUAl2IwO3cwO2EwO3gwxaPEs2kwO3QwJzY7b8d6ecVxiXnlAUXFi%2BQAjOQA0Gk7xAqexZ95O8WaxZdpO2cwxaR5O8WAeSczO8WJeDvEFOQBYnQwO2owW%2BQAnKN5MFt05QHFJzY7cOUBeY54OzA7eeQAosQLMTt5OzDGCy3LDMQixX3HI8gMxSTMGcwYMcWjceQAq1g7WeUAwHowxU%2BLxHiKQeYA1OYAm8WTWDvEukEwO3jFo8WTWcYMeSc0O8WfejA7xZPEBZp0MDvEunTkAoXFpOQBHnowxaNyxEtvMFvoARPkAkDEV3XLLEIwO3HnAP7FmsWHdTA7xZ1CMDsyxaPEr3TlAXzkAJbHGpxCMDsz0RrFm3XECoPOHTEnODtz%2FwCBY%2BQCHo%2FFC2Ew5QH6deQB48RCY8cjYjAnNztuxEPFpMKqxYrFnnIwW8WkczBbJzM7MTAwxaQ%3D)
