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
    cells_container; |> [dom::get_element_by_id["c"];
      dom::set_style[::["w"; px [340]]]];

    make_button; -> [x; : [:= [b; |> [dom::create_element["button"];
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

[game_of_life.hlp](https://at-290690.github.io/hlp?l=xY1hMDtiMDtjMDt4O3nFkcS3czA7xLh1O8WGxY51xZEicHgixZBOOzE3O2QwOzE7cjvFgk47ZDDFkWg7xYJyxBUtMcWRZTA7TjtmxAVnMDvFgmYwO2XEIzA7xLvFkWnEUng7eTvEqWgwO8WExYB4xiR5xZBnMCczO2owO8S9wqIiYyLFkcK8xLwidyI7czBbMzQwJzQ7a8Y%2BxYvEt2LEJ6giYnTEKKMiKiInMzvDmWowO2LFkWLFkGzEKnQwO3UwO8K8dDA7xLwiYyI7InRyIjsiYiI7InMxxAZiZyI7xYd1MDsiIzAwMCI7IiNmZmYiJzQ7bcQ%2F5AChi8SZZ8QMdsQMxYfFiMWEduUA0ZDErmg7csWQxY3nASzEarAwOzHFkXfJCnjkAM1rMFtyxZFsMFsxxZDlAIpj5QCXYjA7dzA7YTA7eMRNo2gwO3QwJzY7bsd6ecV9t3nlAVPEueQBP%2BQA0Gk75QCWxYx5O8WHxYRpO2YwxZF5O8SueSczO8S3eDvEFOQBcMQsMFvkAJyQeTBbdOUB0yc2O2%2FkAYfEvHg7MDt55ACixAsxO3k7MMYLLcsMxCLFfccjyAzFJMwZzBgxxZBw5ACrWDtZ5QDAejDFT7nEeLhB5gDU5gCbxYBYO8SoQTA7eMWQxYBZxgx5JzQ7xYx6MDvFgMQFh%2BQBMKh05AKTxZHkAR56MMWQccRLbjBb6AET5AJOxFd1yyxCMDtw5wD%2BxYfEtXUwO8WKQjA7MsWQxJ905QF8MMWRyBqJQjA7M9EaxYh15AC6sc4dMSc4O3L%2FAIFj5AHRvcULYTDlAfp1xBLEQmPHI2IwJzc7bcRDxZHCqsS4xYtxMFvFkXIwWyczOzEwMMWR)
