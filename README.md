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

[game_of_life.hlp](https://at-290690.github.io/hlp/?l=xZlhMDtiMDtjMDt4O3nFncWCczA7xYN1O8WSxZp1xZ0icHgixZxOOzE3O2QwOzE7cjvFjk47ZDDFnWg7xY5yxBUtMcWdZTA7TjtmxAVnMDvFjmYwO2XEIzA7xYbFnWnEUng7eTvEtMQSkMWMeMYkecWcZzAnMztqMDvFiMOFxZ3CvcWHInciO3MwWzM0MCc0O2vGO8WXxYJiO8WIwqgiYnQixZ3CoyIqIiczO8OcajA7YsWdYsWcbMQqdDA7dTA7wr10MDvFhyJjIjsidHIiOyJiIjsiczHEBmJnIjvFk3UwOyIjMDAwIjsiI2ZmZiInNDttxD%2FkAJ6XxKDkAMODdsQMxZPFlMWQduUAzpzEuWg7csWcxZnnASnEarAwOzHFnXfJCnjkAMprMFtyxZ1sMFsxxZzlAIpj5QCXYjA7dzA7YTA7eMRNrGgwO3QwJzY7bsd6ecVxgnnlAVDFhOQAjOQA0Gk7xAqXxZh5O8WTxZBpO2YwxZ15O8S5eSczO8WCeDvEFOQBbcQsMFvkAJyceTBbdOUB0Cc2O2%2FlAYSHeDswO3nkAKLECzE7eTswxgstywzEIsV9xyPIDMUkzBnMGDHFnHDkAKtYO1nlAMB6MMVPhMR4g0HmANTmAJvFjFg7xLNBMDt4xZzFjFnGDHknNDvFmHowO8WMxAWTdDA7xLN05AKQxZ3kAR56MMWcccRLbjBb6AET5AJLxFd1yyxCMDtw5wD%2BxZPFgHUwO8WWQjA7MsWcxKh05QF85ACWxxqVQjA7M9EaxZR1MMWdxLzOHTEnODty%2FwCBYzDFnMWIxQthMOUB%2BnXkAePEQmPHI2IwJzc7bcRDxZ3CqsWDxZdxMFvFnXIwWyczOzEwMMWd)
