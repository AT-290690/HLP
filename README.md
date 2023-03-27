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
 ;; window
' [view; next; alive; x; y];
:= [
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];
    cells_container; |> [dom::get_element_by_id["container"];
      dom::set_attribute["style"; ~["max-width:"; 380; "px"]]];

    make_button; -> [x; : [:= [b; |> [dom::create_element["button"];
                                      dom::set_text_content["*"]]];
                                      dom::add_to[cells_container; b]; b]];

    fill; -> [cell; is_alive;  dom::set_attribute[cell; "style"; ~["color: transparent; width:"; x;  "px;"; "background:"; ? [is_alive; "black"; "white"]]]];
  make_grid; -> [cells; : [

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]];
  ' [x; y];
  := [is_alive; math::random_int [0; 1];
      next_is_alive;math::random_int [0; 1];
      rect;|> [make_button [r]; fill ["black"]];
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
time::set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xYxhMDtiMDtjMDt4O3nFkMS2TjsxNztkMDsxO3I7xYFOO2QwxZBoO8WBcsQVLTHFkGUwO047ZsQFZzA7xYFmMDtlxCMwO8S6xZBpMDvEt3g7eTvEqGgwO8WDxL94xiR5xY9nMCczO2owO8S8wqIiY29udGFpbmVyIsWQwqsic3R5bGUiO8WFIm1heC13aWR0aDoiOzM4MDsicHgiJzM7a8ZZxYrEtmLEQqgiYnV0dG9uxD%2BjIirEI8OYajA7YsWQYsWPbMQuczA7dDA7wqtzMDvLYGNvbG9yOiB0cmFuc3BhcmVudDsgyHB4xG47IjsiYmFja2dyb3VuZDoiO8WGdDA7ImJsYWNrIjsid2hpdGUiJzQ7bcRk5ADlisSYZ8QMdcQMxYbFh8WDdeUBFY%2FErWg7csWPxYznAVzkAI%2BwMDsxxZB2yQp35AERazBbcsWQbDBbx2fFj3MwO8S7Y%2BUAwmIwO3YwO2EwO3fEU6JoMDtzMCc2O27nAIB4xHfEtnnlAZ3EuOQBieQA%2B2k75QCcxYt5O8WGxYNpO2YwxZB5O8SteSczO8S2eDvEFOQBusQsMFvkAKKPeDBbc%2BUCCSc2O2%2FkAdHEu3g7MDt55ACoxAsxO3k7MMYLLcsMxCLFfccjyAzFJMwZzBgxxY9w5ACrWDtZ5gDAMMVPuMR4t3rmANTmAJvEv1g7xKd6MDt4xY%2FEv1nGDHknNDvFi3kwO8S%2FeTA7xYbkATCnc%2BQCycWQ5AEeeTDFj3HES24wW%2BgBE%2BQCmMRXdMssQTA7cOcA%2FsWGxLR0MDvFiUEwOzLFj8Sec%2BUBfDDFkMgaiEEwOzPRGsWHdOQAurDOHTEnODty%2FwCBY%2BQB0bzFC2Ew5QIAdMQSxEJjxyNiMCc3O23EQ8WQwqrEt8WKcTBbxZByMFsnMzsxMDDFkA%3D%3D)
