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
    px; -> [u; ~[`[u]; "px"]];
    N; 17;
    factor; 1;
    r; * [N; factor];
    h; * [r; factor; -1];
    cols; N; rows; N;
    bound; * [rows; cols]; cells; .: [];
    get_cell; -> [x; y; .: . [cells; % [+ [x; * [rows; y]]; bound]]];
    cells_container; |> [dom::get_root []; dom::set_style [::["w"; px [340]]]];

    make_button; -> [x; : [:= [b; |> [dom::create_element["bt"];
                                      dom::set_text_content["*"]]];
                                      dom::add_to[cells_container; b]; b]];
    fill; -> [cell; is_alive; dom::set_style [cell; :: ["c"; "tr"; "b"; "s1b"; "bg"; ? [is_alive; "#000"; "#fff"]]]];

  make_grid; -> [cells; : [

*loop [bound; -> [count; : [
  ? [! [% [count; cols]]; += [h; r]];
  ' [x; y];
  := [is_alive; math::random_int [0; 1];
      next_is_alive;math::random_int [0; 1];
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
time::set_interval[-> [: [update_state []; render []]]; 100];
```

click to run it:

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xZZhMDtiMDtjMDt4O3nFmsS%2FZDA7xYB1O8WPxZd1xZoicHgixZlOOzE3O2UwOzE7cjvFi047ZTDFmmg7xYtyxBUtMcWaZjA7TjtnxAVoMDvFi2cwO2YwxZppMDvFg8WaasRSeDt5O8SxxBKNxYl4xiR5xZloMCczO2swO8WFw4XFmsK9xYQidyI7ZDBbMzQwJzQ7bMY7xYXCqCJidCLFmsKjIirEB7xrxDltxB90MDt1MDvCvXQwO8WEImMiOyJ0ciI7ImIiOyJzMcQGYmciO8WQdTA7IiMwMDAiOyIjZmZmIic0O27EP%2BQAk5TEneQAuIB2xAzFkMWRxY125QDDmcS2aDtyxZnFlucBHsRqsDA7McWad8kKeOQAv2wwW3LFmm0wWzHFmeUAimPlAJdiMDt3MDthMDt4xE2paTA7dDAnNjtvx3p5xX2%2FeeUBRcWB5ACM5ADQaTvECpTFlXk7xZDFjWk7ZzDFmnk7xLZ5JzM7xL94O8QU5AFidDA7ajBb5ACcmXkwW3TlAcUnNjtw5QF5hHg7MDt55ACixAsxO3k7MMYLLcsMxCLFfccjyAzFJMwZzBgxxZlx5ACrWDtZ5QDAejDFT4HEeIBB5gDU5gCbxYlYO8SwQTA7eMWZxYlZxgx5JzQ7xZV6MDvFicQFkHQwO8SwdOQChcWa5AEeejDFmXLES28wW%2BgBE%2BQCQMRXdcssQjA7cecA%2FsWQxL11MDvFk0IwOzLFmcSldOUBfOQAlscakkIwOzPRGsWRdTDFmsS5zh0xJzg7c%2F8AgWMwxZnFhcULYTDlAfp15AHjxEJjxyNiMCc3O27EQ8WawqrFgMWUcjBbxZpzMFsnMzsxMDDFmg%3D%3D)
