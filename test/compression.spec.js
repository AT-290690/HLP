import { equal, strictEqual, deepEqual, deepStrictEqual } from 'assert'
import { compress, decompress } from '../dist/misc/compression.js'
import { runFromInterpreted, runFromCompiled } from '../dist/misc/utils.js'
import { decodeBase64 } from '../dist/misc/compression.js'
import { pretty } from '../dist/misc/prettier.js'
describe('compression should work as expected', () => {
  it('definitions', () =>
    [
      `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]; :: ["x"; x; "y"; y]`,
      `:= [x; 10; y; 23]; .: [x; y]`,
      `:=[mult;->[x;y;z;*[x;y;z]]];:=[cap;->[B;ay;sdz;+[B;ay;sdz]]];:=[mult2;->[x2;y3;z3;*[x2;y3;z3]]];:=[cap2;->[B2;ay2;sdz2;+[B2;ay2;sdz2]]];:=[mult4;->[x4;y4;z4;*[x4;y4;z4]]];:=[cap4;->[B4;ay4;sdz4;+[B4;ay4;sdz4]]];:=[mult24;->[x24;y34;z34;*[x24;y34;z34]]];:=[cap24;->[B24;ay24;sdz24;+[B24;ay24;sdz24]]];:=[mult44;->[x44;y44;z44;*[x44;y44;z44]]];:=[cap44;->[B44;ay44;sdz44;+[B44;ay44;sdz44]]];:=[mult24;->[x2444;y3444;z3444;*[x2444;y3444;z3444]]];:=[cap24;->[B24444;ay24444;sdz24444;+[B24444;ay24444;sdz24444]]];:=[xmult;->[xx;xy;xz;*[xx;xy;xz]]];:=[xcap;->[xB;xay;xsdz;+[xB;xay;xsdz]]];:=[xmult2;->[xx2;xy3;xz3;*[xx2;xy3;xz3]]];:=[xcap2;->[xB2;xay2;xsdz2;+[xB2;xay2;xsdz2]]];:=[xmult4;->[xx4;xy4;xz4;*[xx4;xy4;xz4]]];:=[xcap4;->[xB4;xay4;xsdz4;+[xB4;xay4;xsdz4]]];:=[xmult24;->[xx24;xy34;xz34;*[xx24;xy34;xz34]]];:=[xcap24;->[xB24;xay24;xsdz24;+[xB24;xay24;xsdz24]]];:=[xmult44;->[xx44;xy44;xz44;*[xx44;xy44;xz44]]];:=[xcap44;->[xB44;xay44;xsdz44;+[xB44;xay44;xsdz44]]];:=[xmult24;->[xx2444;xy3444;xz3444;*[xx2444;xy3444;xz3444]]];:=[xcap242;->[xB24444;xay24444;xsdz24444;+[xB24444;xay24444;xsdz24444]]];mult[cap[2;4;xmult24[xmult44[3;2;11];cap24[3;4;5];xcap242[1;2;3]]];5;6]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('simple math', () =>
    [
      `:= [x; 30]; := [result; + [/ [* [+ [1; 2; 3]; 2]; % [4; 3]]; x]];`,
      `:= [distance; 
      -> [x1; y1; x2; y2; 
        math_sqrt [+ [math_pow2 [- [x2; x1]]; 
            math_pow2 [- [y2; y1]]]]]]; 
    := [to_distance; 
      -> [a; b; 
        distance [.:< [a]; 
          .:> [a]; 
          .:< [b]; 
          .:> [b]]]]; 
    := [to_distances; 
      -> [points; target; 
        .:map>> [points; 
          -> [x; i; 
            to_distance [x; target]]]]]; 
    := [get_min_dist; 
      -> [distances; 
        .:reduce>> [distances; 
          -> [acc; x; 
            math_min [acc; x]]; math_INFINITY]]]; 
    := [closest; 
      -> [points; target; 
        : [:= [min_dist; 
            |> [points; 
              to_distances [target]; 
              get_min_dist []]]; 
          .:find>> [points; 
            -> [x; 
              == [to_distance [x; target]; min_dist]]]]]]; 
    |> [.: [.: [1; 1]; 
        .: [2; 2]; 
        .: [3; 1]; 
        .: [4; 5]]; 
      closest [.: [3; 4]]];`,
      `:= [distance; -> [x1; y1; x2; y2; 
        math_sqrt [+ [math_pow2 [- [x2; x1]]; 
            math_pow2 [- [y2; y1]]]]]; 
        ;; to distance function
      to_distance; -> [a; b; 
        distance [.:< [a]; 
          .:> [a]; 
          .:< [b]; 
          .:> [b]]]; 
        ;; to distances function
      to_distances; -> [points; target; 
        .:map>> [points; 
          -> [x; i; 
            to_distance [x; target]]]];
        ;; get the min distance function
      get_min_dist; -> [distances; 
        .:reduce>> [distances; 
          -> [acc; x; 
            math_min [acc; x]]; math_INFINITY]];
        ;; sil
      closest; -> [points; target; 
        : [:= [min_dist; |> [points; 
              to_distances [target]; 
              get_min_dist []]]; 
          .:find>> [points; 
            -> [x; 
              == [to_distance [x; target]; min_dist]]]]]]; 
    |> [.: [.: [1; 1]; 
        .: [2; 2]; 
        .: [3; 1]; 
        .: [4; 5]]; 
      closest [.: [3; 4]]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('if', () =>
    [
      `:= [age; 18];
      ? [>= [age; 18]; "Can work!"; "Can't work"];
         `,
      `
         := [validate age; -> [age; ? [>= [age; 18]; ~ ["Can work"; ? [>=[age; 21]; " and can drink"; ""]]; "Can't work and can't drink"]]];
         .: [validate age [18]; validate age [21]; validate age [12]];
     `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('not throw but compile throw', () => {
    ;[`:= [x; 1]; !throw[> [x; 0]; "Smaller"]; x`]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      )
  })
  it('fib sum', () =>
    [
      `;; calculating fib sequance
      := [fib; -> [n; ? [
        > [n; 0];
           ? [== [n; 1]; 1;
            ? [== [n; 2]; 1;
              + [fib [- [n; 1]]; fib [- [n; 2]]]]]; n]]];
            fib[10]
              `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('max sub array sum rec', () =>
    [
      `;; max_sub_array_recursive
      := [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:length [nums]]; : [
          = [maxGlobal; math_max [maxGlobal; = [maxSoFar; math_max [0; + [maxSoFar; .: . [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
      [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; math_negative[math_INFINITY]; math_negative[math_INFINITY]]`,
      `:= [max_sub_array_sum; -> [nums; : [
        := [max_global; * [math_INFINITY; -1];
            max_so_far;  max_global];
        * loop [.: length [nums]; -> [i;
                = [max_global;
                   math_max [max_global;
                        = [max_so_far;
                         math_max [0;
                                + [max_so_far;
                                   .: . [nums; i]]]]]]]]]]];
     max_sub_array_sum [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('sum median', () =>
    [
      `:= [NUMBERS; .: map >> [.: ... [100]; -> [x; + [x; 1]]]];
      := [first; .: . [NUMBERS; 0]];
      := [last; .: . [NUMBERS; - [.:length [NUMBERS]; 1]]];
      := [median; + [first;
      - [* [last; * [+ [1; last]; 0.5]];
          * [first; * [+ [1; first]; 0.5]]]]];
      == [math_sum [NUMBERS]; median]
          `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('sum tree nodes', () =>
    [
      `;; sum_tree_nodes
      := [node; -> [value; left; right;
        :: ["value"; value;
            "left"; left;
            "right"; right]]];
      := [sum; -> [item;
        ? [== [item; 0];
          0;
          + [:: . [item; "value"];
             sum [:: . [item; "left"]];
             sum [:: . [item; "right"]]]]]];
      := [myTree;
        node [1;
          node [2;
            node [4; 0; 0];
            node [6; 0; 0]];
        node [3;
          node [5; 0; 0];
          node [7; 0; 0]]]];
          sum [myTree]
      `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('length of string', () =>
    [`.:length [.:from_string ["01010"; ""]];`]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('split and join', () =>
    [
      `.:to_string[.:from_string ["01010"; ""]; "-"];`,
      `|> [
      .: [3; 4; 2; 1; 2; 3];
      .:chunks [3];
      .:map>> [-> [x; ~["["; .:to_string [x; ", "]; "]"]]];
     .:to_string [", "]
    ];`,
      `|> [.:chunks [.: [3; 4; 2; 1; 2; 3]; 2]; .:map>> [-> [x; ~["["; .:to_string [x; ", "]; "]"]]]; .:to_string [", "]];`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [4; "x"; "y"; "z"];
      .:remove_from [0; 4];
      .:remove_from [3; 4];
      .:to_string [", "]
    ];`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [2; "x"; "y"; "z"];
            .:to_string [", "]
    ]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('import should work', () =>
    [
      ` .:map>> [.: [1.123; 3.14; 4.9]; -> [x; math_floor[x]]];`,
      'math_PI',
      `aliases= [
        floor; math_floor;
        pi; math_PI
      ];
      .:map>> [.: [1.123; 3.14; 4.9; pi]; -> [x; floor[x]]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('nested pipes should work', () =>
    [
      `|> [
        10;
        -> [x; * [x; 3]][];
        -> [x; * [x; 10]][]
      ]`,
      `|> [
        10;
        + [|> [2; * [10]]];
        + [4; * [100; |> [8; + [2]]]];
        - [10]
      ]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('>> and << should work', () =>
    [
      `
    := [out; .: []];
    >> [.: [1; 2; 3; 4]; -> [x; i; a; .:>= [out; * [x; 10]]]];
    << [.: [10; 20; 30]; -> [x; i; a; .:>= [out; - [.: . [out; i]; * [x; 0.1]]]]];
    >> [out; -> [x; i; a; .: .= [out; i; + [x; i]]]];
    out;
    `,
      `
    |> [
      .: [1; 2; 3; 4];
      >> [-> [x; i; a; .: .= [a; i; * [x; 10]]]];
      << [-> [x; i; a; .: .= [a; i; - [.: . [a; i]; * [x; 0.1]]]]];
      >> [-> [x; i; a; .: .= [a; i; + [x; i]]]];
      << [-> [x; i; a; .: .= [a; i; + [.: . [a; i]; i; 1]]]];
    ]
    `,
      `
    |> [
      .: [1; 2; 3; 4];
      .:map>> [-> [x; i; a; * [x; 10]]];
      .:filter [-> [x; i; a; % [x; 2]]]
    ]
    `,
      `|> [.: [1; 2; 3; 4; 5];
    .: filter [-> [x; == [% [x; 2]; 1]]];
	.:map>> [-> [x; 
			* [x; 10]]];
   .: reduce >> [-> [acc; x; + [acc; x]]; 0]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('*>> and *<< should work', () => {
    ;[
      `:= [collection; 
:: ["x"; 1; "y"; 2; "d"; 3; "g"; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`,
      `:= [collection; 
.: [1; 2; 3; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`,
      `:= [collection; 
:. [1; 2; 3; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      )
  })
  it('.:find>> should work', () =>
    [
      `.:find>> [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `.:find<< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `.:find_index>> [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `.:find_index<< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `|> [.: [1; 2; 3; 4; 5; 6; 7; 8];
      .: filter [-> [x; % [x; 2]]];
      .: map << [-> [x; * [x; 2]]];
      .: find >> [-> [x; > [x; 10]]]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:map>> and .:map<< should work', () =>
    [
      `.:map>> [.: [1; 2; 3; 4]; -> [x; i; a; + [i; * [x; 2]]]]`,
      `|> [.: [1; 2; 3; 4]; .:map>> [-> [x; i; a; + [i; * [x; 2]]]]; .:map>> [-> [x; i; a; + [i; * [x; 2]]]]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))

  it('*loop should work', () =>
    [
      `:= [arr; .:[]]; *loop [3; -> [.:>=[arr; 1]]]`,
      `:= [arr; .:[]]; *loop [3; -> [i; .:>=[arr; +[i; 1]]]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:>!=. should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     .:>!=. [];
     + [100]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:<!=. should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     .:>!=. [];
     + [100]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('... shoud work', () =>
    [
      `.: [
      ... [.: [1; 2; 3]; .: [4; 5; 6]];
      ]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:merge_sort and .:quick_sort should work', () =>
    [
      ` |> [
      .: [3; 4; 2; 1; 2; 3];
      .:merge_sort [-> [a; b; ? [> [a; b]; -1; 1]]]
    ];
    `,
      ` |> [
      .: [3; 4; 2; 1; 2; 3];
      .:quick_sort [-1]
    ];
    `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':: ::keys ::entries ::->.: ::size should work', () =>
    [
      `.: [::entries [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::keys [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::->.: [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:chunks should work', () =>
    [
      `|> [
      .: [3; 4; 2; 1; 2; 3];
      .:chunks [3]
    ];`,
      `.:chunks [.: [3; 4; 2; 1; 2; 3]; 2];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:add_at and .:remove_from should work', () =>
    [
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [4; "x"; "y"; "z"];
      .:remove_from [0; 4];
      .:remove_from [3; 4]
    ]`,
      `|> [:= [arr; .: [1; 2; 3]]; 
    .: add_at [.: length [arr]; 6; 6; 6; 6];
    .: add_at [.: length [arr]; 7; 7];
    .: add_at [.: length [arr]; 8]]
    `,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [2; "x"; "y"; "z"];
    ]`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:remove_from [2; 4];
    ]`,
      `:= [obj; :: ["x"; 3; "y"; 4]]; .: [::.? [obj; "z"]; ::.? [obj; "x"]; ::size [obj]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':= should work', () =>
    [
      `:= [arr; .: []];
    := [loop1; -> [i;  : [
      .: <= [arr; .:[]];
      := [current; .:< [arr]];
      := [loop2; -> [j;  : [
       .: <= [current; + [j; i]];
      ? [> [j; 0]; loop2 [= [j; - [j; 1]]]]]]][10];
    ? [> [i; 0]; loop1 [= [i; - [i; 1]]]]]]][10];
    arr`,
      `:= [arr; .: []];
    := [loop; -> [i; bounds; : [.:>= [arr; i];
    ? [> [bounds; i]; loop [+= [i]; bounds]]]]][1; 12];
    arr;`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':: should work', () =>
    [
      `:= [d; :: ["x"; 10; "y"; 23]];
    :: ["y"; 5; "m"; :: ["x"; :: ["x"; 10; "y"; d]; "y"; 23];]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('^ should work', () =>
    [
      `:= [x; 11; y; 23];
    |> [x; 
        + [y; 23; 4];
        * [2];
       -> [x;
          * [x; x]
        ][];
       ];
    `,
      `|> [0; 
      + [2];
      -> [x; * [x; x]][]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:difference .:xor .:union .:intersection should work', () =>
    [
      `|> [
        .: [1; 2; 3; 4];
        .: -> :. [];
        :. difference [.: -> :. [.: [1; 2; 4]]];
        :. -> .: [];
        .: > []
      ];
      `,
      `|> [
        .: [1; 2; 3; 4];
        .: -> :. [];
        :. difference [.: -> :. [.: [1; 2; 4]]];
        :. -> .: [];
        .: > []
      ];
      `,
      `|> [
        .: [1; 2; 3; 4; 5; 6; 7];
        .: -> :. [];
        :. union [:. [1; 2; 4; 6]];
        :. -> .: [];
      ];
      `,
      `
      |> [
        .: [1; 2; 3; 4; 5; 6; 7];
        .: -> :. [];
        :. intersection [:. [1; 2; 4; 6]];
        :. -> .: [];
      ];
    `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('+= -= *= should work', () =>
    [
      `:=[x; 0]; += [x]`,
      `:=[x; 1]; +=[x; 3]`,
      `:=[x; 1]; +=[x; 3]; x`,
      `:=[x; 1]; -= [x]`,
      `:=[x; 1]; -=[x; 3]`,
      `:=[x; 1]; -=[x; 3]; x`,
      `:=[x; 2]; *= [x]`,
      `:=[x; 2]; *=[x; 3]`,
      `:=[x; 2]; *=[x; 3]; x`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:length :. : .:is_in_bounds should work', () =>
    [
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:length [arr]; .: . [arr; -2]; .: . [arr; 3]; ? [.:is_in_bounds [arr; 4]; 1; 0]; ? [.:is_in_bounds [arr; 9]; 1; 0]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('calling :: methods should work', () =>
    [
      `:= [create_db; -> [:: ["connect"; -> ["connected!"]]]];
        := [db; create_db[]];
        |> [db; :: . ["connect"]][];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('` should work', () =>
    [
      '` [1]',
      '` ["1"]',
      '+ [1; 2; 3; `[" "]; ` ["10"]]',
      '~ [`[1]; `[2]; `[3]; " "; "sequance"; "!"]',
      '` [` [> [1; 2]]]',
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))

  it('.: >!=, .: <!=, .: <, .: >, .: >!=., .: <!=. should work', () =>
    [
      `
        := [arr; .: [1; 2; 3; 4; 5; 6]];
    |> [arr; 
       .: >!= [];
       .: >!= [];
       .: <!= [];
       .: <!= []; 
       .: reduce >> [-> [acc; x; + [acc; x]]; 0]];
        `,
      `
        := [arr; .: [1; 2; 3; 4; 5; 6]];
          .: < [arr]
        `,
      `
        := [arr; .: [1; 2; 3; 4; 5; 6]];
          .: > [arr]
        `,
      `
      := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: <!=. [arr]
      `,
      `
      := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: >!=. [arr]
      `,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('complex expressions should work', () =>
    [
      `:= [is_odd; -> [x; == [% [x; 2]; 0]]];
        := [is_even; -> [x; % [x; 2]]];
        := [first_element; .: < [.: [1; 2; 3; 4]]];
        := [out; |> [
            .: [3; 4; 2; 1; 2; 3];
            .:map>> [-> [x; |> [x;
             + [2; 4];
            * [10000; first_element];
            -> [x; |> [x; - [232321]]][]]]];
            .: map << [-> [x; math_abs[x]]];
          ]];

        .: [is_even[.:<[out]]; is_odd[.:>[out]]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':[] should work', () =>
    [
      `:= [fn; -> [x; : [
    ;; @check ?== [x; 1];
    * [x; 2]]]]; fn [3];`,
      `:[1; 2; 3]`,
      `:[1]`,
      `:= [f; -> [x; y; : [*[x; y]]]]; f[3; 4]`,
      `:= [x; : [1]]; x`,
      `:= [x; : [1; 2; 3]]; x`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))

  it('Algorithms should work', () =>
    [
      `|>[.: [1;2;3;4]; 
          .: map >> [-> [x; * [x; 2]]];
          .: filter [-> [x; == [% [x; 2]; 0]]];
          .: reduce >> [-> [acc; x; + [acc; x]]; 1]
        ]`,
      `|>[.: [1;2;3;4;5;6;7]; 
        .: chunks [2];
        .: flat [1];
        .: reduce >> [-> [acc; x; + [acc; x]]; 1]
      ]`,
      `|>[.: [1;2;3;4;5;6;7]; 
      .: chunks [2];
      .: flatten [-> [x; * [x; 2]]];
      .: reduce << [-> [acc; x; + [acc; x]]; 1]
    ]`,
      `|>["1,2,3,4,5,6"; 
    .: from_string [","];
    .: map >> [-> [x; ~[x; "0"]]];
    .: to_string [","];
  ]`,
      `|>["1,2,3,4,5,6"; 
    .: from_string [","];
    .: map << [-> [x; ~[x; "0"]]];
    .: to_string [","];
  ]`,
      `|>["1,2,3,4,5,6"; 
    .: from_string [","];
    .: map << [-> [x; ~[x; "0"]]];
    .: slice [2; 4];
    .: to_string [","];
  ]`,
      `+ [.: length [.: [1;2;3;4]]; :: size [:: ["x";1; "y"; 2]]]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it(`=== and !== should work`, () =>
    [
      `===[.: [1;2;3]; .: [1;2;3]]`,
      `!== [.: [1;2;3]; .: [1;2;3]]`,
      `.: quick_sort [.: [10; 23; 1; 4; 0; 1; 3]; -1]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('logic operations should work', () =>
    [`== [&& [|| [0; 0; 1]; 10]; 10]`]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))

  it(`/ should work`, () =>
    ['* [4; / [2]]', '* [12; / [6]]', '* [8; / [2]]', '* [4; / [4; 2]]']
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it(':. should work', () =>
    [
      ` :. [1; 2; 3; 4]`,
      `|> [:. [1; 2; 3; 4]; :. xor [:. [3; 4; 5]]]`,
      `|> [:. [1; 2; 3; 4]; :. difference [:. [3; 4; 5]]]`,
      `|> [:. [1; 2; 3; 4]; :. union [:. [3; 4; 5]]]`,
      `|> [:. [1; 2; 3; 4]; :. intersection [:. [3; 4; 5]]]`,
      `|> [:. [1; 2; 3; 4]; :. .=  [5]]`,
      `|> [:. [1; 2; 3; 4]; :. .!=  [2]]`,
      `|> [:. [1; 2; 3; 4]; :. -> .: []]`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('compressoin should be idemptent', () =>
    [
      `'[view;next;alive;x;y];|>[dom_get_body[];dom_set_style[::["bg";0]]];:=[px;->[u;~[\`[u];"px"]];N;17;factor;1;r;*[N;factor];h;*[r;factor;-1];cols;N;rows;N;bound;*[rows;cols];cells;.:[];get_cell;->[x;y;.:.[cells;%[+[x;*[rows;y]];bound]]];cells_container;|>[dom_get_root[];dom_set_style[::["w";px[380]]]];make_button;->[|>[dom_create_element["bt"];dom_set_text_content["*"];dom_append_to[cells_container]]];fill;->[cell;is_alive;dom_set_style[cell;::["c";"tr";"b";"s2t";"bg";?[is_alive;"#fff";0]]]];make_grid;->[cells;:[*loop[bound;->[count;:[?[![%[count;cols]];+=[h;r]];'[x;y];:=[is_alive;math_random_int[0;1];next_is_alive;math_random_int[0;1];rect;|>[make_button[r];fill[1]];cell;::[alive;is_alive;next;next_is_alive;view;rect]];.:>=[cells;cell]]]]]];iterate_cells;->[cells;callback;:[:=[y;-1];>>[cells;->[cell;i;:[=[y;?[%[i;rows];y;+=[y]]];:=[x;%[i;cols];cell;get_cell[x;y]];callback[cell;x;y]]]]]];directions;.:[::[x;0;y;1];::[x;1;y;0];::[x;-1;y;0];::[x;0;y;-1];::[x;1;y;-1];::[x;-1;y;-1];::[x;1;y;1];::[x;-1;y;1]];adjacent;->[X;Y;:[:=[sum;0];>>[directions;->[dir;:[:=[cell;get_cell[+[X;::.[dir;x]];+[Y;::.[dir;y]]]];=[sum;+[sum;?[cell;::.[cell;alive];0]]]]]];sum]];update_state;->[iterate_cells[cells;->[cell;x;y;:[:=[is_alive;::.[cell;alive];neighbors;adjacent[x;y]];?[&&[is_alive;<[neighbors;2]];::.=[cell;next;0];?[&&[is_alive;>[neighbors;3]];::.=[cell;next;0];?[&&[![is_alive];==[neighbors;3]];::.=[cell;next;1]]]]]]]];render;->[iterate_cells[cells;->[cell;:[:=[is_alive;::.[cell;alive]];|>[::.[cell;view];fill[is_alive]];::.=[cell;alive;::.[cell;next]]]]]]];make_grid[cells];time_set_interval[->[:[update_state[];render[]]];100];`,
      `'[value;left;right];:=[make_node;->[v;l;r;:[::[value;v;left;l;right;r]]]];:=[invert_binary_tree;->[node;:[?[::size[node];:[:=[temp_l;::.[node;left]];:=[temp_r;::.[node;right]];::.=[node;left;temp_r];::.=[node;right;temp_l];invert_binary_tree[::.[node;left]];invert_binary_tree[::.[node;right]]];node]]]];:=[tree;make_node[3;make_node[4;::[];::[]];make_node[5;::[];::[]]]];invert_binary_tree[tree];tree`,
      `'[element;text;append];aliases=[<-;::.];:=[dom;::[element;dom_create_element;text;dom_set_text_content;append;dom_append_to]];|>[<-[dom;element]["bt"];<-[dom;text]["hello"];<-[dom;append][dom_get_root[]]]`,
      `:=[mult;->[x;y;z;*[x;y;z]]];:=[cap;->[B;ay;sdz;+[B;ay;sdz]]];:=[mult2;->[x2;y3;z3;*[x2;y3;z3]]];:=[cap2;->[B2;ay2;sdz2;+[B2;ay2;sdz2]]];:=[mult4;->[x4;y4;z4;*[x4;y4;z4]]];:=[cap4;->[B4;ay4;sdz4;+[B4;ay4;sdz4]]];:=[mult24;->[x24;y34;z34;*[x24;y34;z34]]];:=[cap24;->[B24;ay24;sdz24;+[B24;ay24;sdz24]]];:=[mult44;->[x44;y44;z44;*[x44;y44;z44]]];:=[cap44;->[B44;ay44;sdz44;+[B44;ay44;sdz44]]];:=[mult24;->[x2444;y3444;z3444;*[x2444;y3444;z3444]]];:=[cap24;->[B24444;ay24444;sdz24444;+[B24444;ay24444;sdz24444]]];:=[xmult;->[xx;xy;xz;*[xx;xy;xz]]];:=[xcap;->[xB;xay;xsdz;+[xB;xay;xsdz]]];:=[xmult2;->[xx2;xy3;xz3;*[xx2;xy3;xz3]]];:=[xcap2;->[xB2;xay2;xsdz2;+[xB2;xay2;xsdz2]]];:=[xmult4;->[xx4;xy4;xz4;*[xx4;xy4;xz4]]];:=[xcap4;->[xB4;xay4;xsdz4;+[xB4;xay4;xsdz4]]];:=[xmult24;->[xx24;xy34;xz34;*[xx24;xy34;xz34]]];:=[xcap24;->[xB24;xay24;xsdz24;+[xB24;xay24;xsdz24]]];:=[xmult44;->[xx44;xy44;xz44;*[xx44;xy44;xz44]]];:=[xcap44;->[xB44;xay44;xsdz44;+[xB44;xay44;xsdz44]]];:=[xmult24;->[xx2444;xy3444;xz3444;*[xx2444;xy3444;xz3444]]];:=[xcap242;->[xB24444;xay24444;xsdz24444;+[xB24444;xay24444;xsdz24444]]];mult[cap[2;4;xmult24[xmult44[3;2;11];cap24[3;4;5];xcap242[1;2;3]]];5;6]`,
    ].forEach((source) =>
      strictEqual(
        decompress(compress(decompress(compress(source)))),
        decompress(compress(source))
      )
    ))
  it('compression should not change anymore', () => {
    ;[
      {
        raw: `aliases=[element;dom_create_element;attribute;dom_set_attributes;text;dom_set_text_content;attach;dom_append_to;style;dom_set_style;click;dom_click;get_root;dom_get_root;canvas;dom_canvas;get_context;canvas_get_context;fill_style;canvas_fill_style;fill_rect;canvas_fill_rect;];dom_set_style[dom_get_body[];::["bg";"#111"]];'[x;y];:=[N;24;SIZE;360;rec;0;PLAY_ICON;"⏵";PAUSE_ICON;"⏸";ALIVE_COLOR;"#f12";DEAD_COLOR;"#222";CELL_SIZE;*[SIZE;/[N]];r;N;h;*[N;-1];bounds;*[N;N];init;->[N;|>[.:...[N];.:map>>[->[0]]]];cells;init[bounds];next;init[bounds];directions;.:[::[x;0;y;1];::[x;1;y;0];::[x;-1;y;0];::[x;0;y;-1];::[x;1;y;-1];::[x;-1;y;-1];::[x;1;y;1];::[x;-1;y;1]];iterate_cells;->[cells;callback;:[:=[Y;-1];>>[cells;->[cell;i;:[=[Y;?[%[i;N];Y;+=[Y]]];:=[X;%[i;N];cell;get_cell[cells;X;Y]];callback[cell;X;Y]]]]]];get_cell;->[board;X;Y;.:.[board;%[+[X;*[N;Y]];bounds]]];set_cell;->[board;X;Y;val;.:.=[board;%[+[X;*[N;Y]];bounds];val]];adjacent;->[X;Y;:[:=[sum;0];>>[directions;->[dir;:[+=[sum;get_cell[cells;+[X;::.[dir;x]];+[Y;::.[dir;y]]]]]]];sum]];render;->[board;iterate_cells[board;->[is_alive;X;Y;:[|>[ctx;fill_style[?[is_alive;ALIVE_COLOR;DEAD_COLOR]];fill_rect[*[CELL_SIZE;X];*[CELL_SIZE;Y];CELL_SIZE;CELL_SIZE]]]]]];update_state;->[iterate_cells[cells;->[is_alive;X;Y;:[:=[neighbors;adjacent[X;Y]];?[&&[is_alive;<[neighbors;2]];set_cell[next;X;Y;0];?[&&[is_alive;>[neighbors;3]];set_cell[next;X;Y;0];?[&&[![is_alive];==[neighbors;3]];set_cell[next;X;Y;1];set_cell[next;X;Y;is_alive]]]]]]]]];:=[root;get_root[]];|>[element["p"];text["Click on the canvas to draw cells"];style[::["c";"#fff"]];attach[root]];:=[ctx;|>[canvas[];attach[root];attribute[::["w";SIZE;"h";SIZE]];click[->[e;:[:=[X;math_floor[*[::.[e;"ox"];/[CELL_SIZE]]]];:=[Y;math_floor[*[::.[e;"oy"];/[CELL_SIZE]]]];=[rec;0];text[control;PLAY_ICON];:=[is_alive;get_cell[cells;X;Y]];set_cell[cells;X;Y;?[is_alive;0;1]];render[cells]]]];get_context["2d"]]];|>[ctx;fill_style[DEAD_COLOR];fill_rect[0;0;SIZE;SIZE]];:=[step;->[:[update_state[];render[next];=[cells;next];=[next;init[bounds]]]]];:=[play;->[time_set_timeout[->[:[?[rec;:[step[];play[]]]]];150]]];|>[:=[control;element["bt"]];text[PLAY_ICON];click[->[:[text[control;?[=[rec;![rec]];PAUSE_ICON;PLAY_ICON]];play[]]]];attach[|>[element["div"];attach[root]]]];`,
        COMP: `dom_set_style[dom_get_body[];::["bg";"#111"]];'[a;b];:=[c;24;d;360;e;0;f;"⏵";g;"⏸";h;"#f12";i;"#222";j;*[d;/[c]];k;c;l;*[c;-1];m;*[c;c];n;->[c;.:map>>[.:...[c];->[0]]];o;n[m];p;n[m];q;.:[::[a;0;b;1];::[a;1;b;0];::[a;-1;b;0];::[a;0;b;-1];::[a;1;b;-1];::[a;-1;b;-1];::[a;1;b;1];::[a;-1;b;1]];r;->[o;x;:[:=[y;-1];>>[o;->[z;A;:[=[y;?[%[A;c];y;+=[y]]];:=[B;%[A;c];z;s[o;B;y]];x[z;B;y]]]]]];s;->[C;B;y;.:.[C;%[+[B;*[c;y]];m]]];t;->[C;B;y;D;.:.=[C;%[+[B;*[c;y]];m];D]];u;->[B;y;:[:=[E;0];>>[q;->[F;:[+=[E;s[o;+[B;::.[F;a]];+[y;::.[F;b]]]]]]];E]];v;->[C;r[C;->[G;B;y;:[canvas_fill_rect[canvas_fill_style[J;?[G;h;i]];*[j;B];*[j;y];j;j]]]]];w;->[r[o;->[G;B;y;:[:=[H;u[B;y]];?[&&[G;<[H;2]];t[p;B;y;0];?[&&[G;>[H;3]];t[p;B;y;0];?[&&[![G];==[H;3]];t[p;B;y;1];t[p;B;y;G]]]]]]]]];:=[I;dom_get_root[]];dom_append_to[dom_set_style[dom_set_text_content[dom_create_element["p"];"Click on the canvas to draw cells"];::["c";"#fff"]];I];:=[J;canvas_get_context[dom_click[dom_set_attributes[dom_append_to[dom_canvas[];I];::["w";d;"h";d]];->[K;:[:=[B;math_floor[*[::.[K;"ox"];/[j]]]];:=[y;math_floor[*[::.[K;"oy"];/[j]]]];=[e;0];dom_set_text_content[N;f];:=[G;s[o;B;y]];t[o;B;y;?[G;0;1]];v[o]]]];"2d"]];canvas_fill_rect[canvas_fill_style[J;i];0;0;d;d];:=[L;->[:[w[];v[p];=[o;p];=[p;n[m]]]]];:=[M;->[time_set_timeout[->[:[?[e;:[L[];M[]]]]];150]]];dom_append_to[dom_click[dom_set_text_content[:=[N;dom_create_element["bt"]];f];->[:[dom_set_text_content[N;?[=[e;![e]];g;f]];M[]]]];dom_append_to[dom_create_element["div"];I]];`,
      },
    ].forEach(({ raw, COMP }) => strictEqual(decompress(compress(raw)), COMP))
    ;[
      {
        COMP: 'xIJbxJFbXTvGolsiYmciOyIjMTExIl1dOydbYTtiXTvGnVtjOzI0O2Q7MzYwO2U7MDtmOyLij7UiO2fECLgiO2g7IiNmMTIiO2k7IiMyMjIiO2o7KltkOy9bY11dO2s7YztsOypbYzstMV07bcUKY107bjvGnltjO8ajW8WgW8aAW2NdxBEwwrc0O287blttXTtwxgdxO8ahW8aiW2E7MDtiOzHlAKlhOzE7YjswxwwtzA3EJcRpySbJDcUnzRvNGjFdXTty5ACEbzt4Ozpbxp1becYun1tvxBd6O0E7Ols9W3k7P1slW0HkAMR5O8aUW3nCtzPkASVCO8cWejtzW287Qjt5XV07eFt6xArCtzY7c8RFQ8QOO8aPW0M7JVsrW0LlAQ7EKW3ERnTKI0Q7xobSJV07RF1dO3XEJ8Ql5QCmReUA%2B59bccQWRsQUlFtF5QCDxDvGjltGO2FdXTsrW3nGDWLCtzc7RV1dO3bGbnJbQ8QJR8V3OlvGo1vDplvDnVtKOz9bRztoO2ldXTsqW2o7QsYHeV07ajtq5ADRd8Q3cuYBHck%2BnVtIO3XkAJ1dXTs%2FW8abW0c7PFtIOzJdXTt0W3DFJjDJGj5bSDsz0xohW0ddO8aXzx4xygtHwrc55AF0STvEkltdXeQCRsO%2FW8SCW8OKW8OUWyJwIl07IkNsaWNrIG9uIHRoZSBjYW52YXMgdG8gZHJhdyBjZWxscyLmAvVj5AL0ZmZm5AL0ScRN5AD8xFKWW8WKW8OTxVu5W8QdxTB3IjtkOyJoIjtkxC2eW0vmAPhCO8SrWypbxo5bSzsib3giXTsvW2rkAs%2FlAkrMHHnKHD1bZeQA9sOKW047ZsV7R%2BsCPnTGCuUBiTDlAqF2W2%2FENyIyZCLlAnfqAa1pXTswOzA7ZOYAlp1bTOQAmzpbd1vENXBdOz1bbzvFB%2BUDV8K3NcQlTcQlw6VbxSs%2FW2U7OltMW107TVvEIDE1MMhkv%2BUBCorkAOdOO%2BQBYWJ05AEu5ACyxDrlAL8%2FW%2BQAzSFbZV1dO2c7Zl3GRzTHQMQ1ZGl2Il07ScQV',
        raw: `dom_set_style[dom_get_body[];::["bg";"#111"]];'[a;b];:=[c;24;d;360;e;0;f;"⏵";g;"⏸";h;"#f12";i;"#222";j;*[d;/[c]];k;c;l;*[c;-1];m;*[c;c];n;->[c;|>[.:map>>[.:...[c];->[0]]]];o;n[m];p;n[m];q;.:[::[a;0;b;1];::[a;1;b;0];::[a;-1;b;0];::[a;0;b;-1];::[a;1;b;-1];::[a;-1;b;-1];::[a;1;b;1];::[a;-1;b;1]];r;->[o;x;:[:=[y;-1];>>[o;->[z;A;:[=[y;?[%[A;c];y;+=[y]]];:=[B;%[A;c];z;s[o;B;y]];x[z;B;y]]]]]];s;->[C;B;y;.:.[C;%[+[B;*[c;y]];m]]];t;->[C;B;y;D;.:.=[C;%[+[B;*[c;y]];m];D]];u;->[B;y;:[:=[E;0];>>[q;->[F;:[+=[E;s[o;+[B;::.[F;a]];+[y;::.[F;b]]]]]]];E]];v;->[C;r[C;->[G;B;y;:[|>[canvas_fill_rect[canvas_fill_style[J;?[G;h;i]];*[j;B];*[j;y];j;j]]]]]];w;->[r[o;->[G;B;y;:[:=[H;u[B;y]];?[&&[G;<[H;2]];t[p;B;y;0];?[&&[G;>[H;3]];t[p;B;y;0];?[&&[![G];==[H;3]];t[p;B;y;1];t[p;B;y;G]]]]]]]]];:=[I;dom_get_root[]];|>[dom_append_to[dom_set_style[dom_set_text_content[dom_create_element["p"];"Click on the canvas to draw cells"];::["c";"#fff"]];I]];:=[J;|>[canvas_get_context[dom_click[dom_set_attributes[dom_append_to[dom_canvas[];I];::["w";d;"h";d]];->[K;:[:=[B;math_floor[*[::.[K;"ox"];/[j]]]];:=[y;math_floor[*[::.[K;"oy"];/[j]]]];=[e;0];dom_set_text_content[N;f];:=[G;s[o;B;y]];t[o;B;y;?[G;0;1]];v[o]]]];"2d"]]];|>[canvas_fill_rect[canvas_fill_style[J;i];0;0;d;d]];:=[L;->[:[w[];v[p];=[o;p];=[p;n[m]]]]];:=[M;->[time_set_timeout[->[:[?[e;:[L[];M[]]]]];150]]];|>[dom_append_to[dom_click[dom_set_text_content[:=[N;dom_create_element["bt"]];f];->[:[dom_set_text_content[N;?[=[e;![e]];g;f]];M[]]]];|>[dom_append_to[dom_create_element["div"];I]]]];`,
      },
    ].forEach(({ raw, COMP }) =>
      strictEqual(decodeBase64(decodeURIComponent(COMP.trim())), raw)
    )
  })
  it('complex examples should work', () =>
    [
      `:= [crates; .: [:: ["22"; 
    .: [.: ["1000_2000_3000__4000__5000_6000__7000_8000_9000__10000"; 24000; 45000]]]]; 
aoc; .:< [crates]; 
aoc22; ::. [aoc; "22"]; 
day1; .:. [aoc22; 0]; 
sample; .:. [day1; 0]; 
part1; .:. [day1; 1]; 
part2; .:. [day1; 2]; 
input; |> [sample; 
  .:from_string ["__"]; 
  .:map>> [-> [x; 
      |> [x; 
        .:from_string ["_"]; 
        .:map>> [-> [x; 
            \` [x]]]; 
        .:reduce>> [-> [a; x; 
            + [a; x]]; 0]]]]]]; 
.: [|> [input; 
  .:quick_sort [-1]; 
  .:< []; 
  == [part1]]; 
|> [input; 
  .:quick_sort [-1]; 
  .:slice [0; 3]; 
  .:reduce>> [-> [a; x; 
      + [a; x]]; 0]; 
  == [part2]]];`,
    ]
      .map((source) => {
        const COMP = compress(source)
        const DECOMP = decompress(COMP)
        strictEqual(DECOMP, decompress(compress(pretty(DECOMP))))
        return DECOMP
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
})
