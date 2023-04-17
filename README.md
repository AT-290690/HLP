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

[game_of_life.hlp](https://at-290690.github.io/hlp/?l=J1t2aWV3O25leHQ7YWxpdmU7eDt5XTvFnlvDiVvDlVtdO8WdWyJiZyI7IiMwMDAiwrczO8WYW2EwO8WZW3U7fltgW3VdOyJweCJdXTtOOzE3O2IwOzE7cjsqW047YjBdO2g7KltyxBUtMV07YzA7TjtkxAVlMDsqW2QwO2MwXTtmMDvFnFtdO2fFVXg7eTvFiltmMDslWytbeMYneV1dO2UwxH1oMOgAnZbnAJ13IjthMFszODDCtzQ7acVExCKGW8KkW8KrWyJidCJdOyIqIl07aMVCasUjdDA7cTA7w4nECcRGYyI7InRyIjsiYiI7InMydMQKZyI7P1txMDsiI2ZmZiI7xWFrxT5mMDs6W8S2W2XFDmNvdW50OzpbP1shWyXHDmMwXV07xY9baDtyXV07J%2BQA113kATpxMDvCtlswOzFdO3LKC3PlANZqMFtpMFtyXTsxXV075gCY5gGUcTDmAaJyMDvlAa9zxV2C5ACHdDDCtzY7bOgAlmNhbGxiYWNrOzpbxZhbeeUBdsWaxBrmAPRpOzpbPVt5Oz9bJVtpO2QwXeQBbo9beecB2Hg7xBfkAZV0MDtnMOUAtl3JVcRBeDt5xHFt5QG0xZ1beDswO3nkAMPFDDE7eTswxwwtzA3EJeUAjMgmyQ3FJ80bzRrkAQtu5QC%2BWDtZ5gDWdTDFV5pb5ACFmVtkaXLGGOYAsytbWDvFicUWeF1dOytbWcgPeeQBwD3EPyvEBT%2FEMcXlAgHlAWZd5AHhNjt15AFcb8VabDDqATnkApfFZnHPNXYwO27oASk%2FW8WWxCE8W3YwOzJdXTvEvsQq5QG8MMofPsQfM9YfIVtx5ADdktMjMcK3ODtw8QCa9ACW5QPCajBbxhTkAjRdO3HkANnGT8UlxzHEW8K3NztrxFNdO8KuW8WZWzpbbzBbXTtwMFvkAhkxMDBdOw%3D%3D)

try the [editor](https://at-290690.github.io/hlp/editor)
(type **spec** for language manual)
