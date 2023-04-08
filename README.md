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
    cells_container; |> [dom::get_root []; dom::set_style [::["w"; px [340]]]];

    make_button; -> [x; |> [dom::create_element["bt"];
                                      dom::set_text_content["*"];
                                      dom::append_to[cells_container]]];
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

[game_of_life.hlp](https://at-290690.github.io/hlp/?l=xZthMDtiMDtjMDt4O3nFn8WEZDA7xYV1O8WUxZx1xZ8icHgixZ5OOzE3O2UwOzE7cjvFkE47ZTDFn2g7xZByxBUtMcWfZjA7TjtnxAVoMDvFkGcwO2YwxZ9pMDvFiMWfasRSeDt5O8S2xBKSxY54xiR5xZ5oMCczO2swO8WKw4jFn8K%2BxYkidyI7ZDBbMzQwJzQ7bMY7xYrCqCJidCLFn8KjIirEB71rxDltxB90MDt1MDvCvnQwO8WJImMiOyJ0ciI7ImIiOyJzMcQGYmciO8WVdTA7IiMwMDAiOyIjZmZmIic0O27EP%2BQAk5nEouQAuIV2xAzFlcWWxZJ25QDDnsS7aDtyxZ7Fm%2BcBHsRqsDA7McWfd8kKeOQAv2wwW3LFn20wWzHFnuUAimPlAJdiMDt3MDthMDt4xE2uaTA7dDAnNjtvx3p5xXGEeeUBRcWG5ACM5ADQaTvECpnFmnk7xZXFkmk7ZzDFn3k7xLt5JzM7xYR4O8QU5AFidDA7ajBb5ACcnnkwW3TlAcUnNjtw5QF5iXg7MDt55ACixAsxO3k7MMYLLcsMxCLFfccjyAzFJMwZzBgxxZ5x5ACrWDtZ5QDAejDFT4bEeIVB5gDU5gCbxY5YO8S1QTA7eMWexY5Zxgx5JzQ7xZp6MDvFjsQFlXQwO8S1dOQChcWf5AEeejDFnnLES28wW%2BgBE%2BQCQMRXdcssQjA7cecA%2FsWVxYJ1MDvFmEIwOzLFnsSqdOUBfOQAlscal0IwOzPRGsWWdTDFn8S%2Bzh0xJzg7c%2F8AgWMwxZ7FisULYTDlAfp15AHjxEJjxyNiMCc3O27EQ8WfwqrFhcWZcjBbxZ9zMFsnMzsxMDDFnw%3D%3D)
