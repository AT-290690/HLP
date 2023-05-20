import { throws, strictEqual, deepStrictEqual } from 'assert'
import { runFromInterpreted } from '../dist/misc/utils.js'
describe('interpretation should work as expected', () => {
  it('definitions', () => {
    deepStrictEqual(
      runFromInterpreted(
        `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]`
      ),
      10
    )
    deepStrictEqual(
      runFromInterpreted(
        `:=[mult;->[x;y;z;*[x;y;z]]];:=[cap;->[B;ay;sdz;+[B;ay;sdz]]];:=[mult2;->[x2;y3;z3;*[x2;y3;z3]]];:=[cap2;->[B2;ay2;sdz2;+[B2;ay2;sdz2]]];:=[mult4;->[x4;y4;z4;*[x4;y4;z4]]];:=[cap4;->[B4;ay4;sdz4;+[B4;ay4;sdz4]]];:=[mult24;->[x24;y34;z34;*[x24;y34;z34]]];:=[cap24;->[B24;ay24;sdz24;+[B24;ay24;sdz24]]];:=[mult44;->[x44;y44;z44;*[x44;y44;z44]]];:=[cap44;->[B44;ay44;sdz44;+[B44;ay44;sdz44]]];:=[mult24;->[x2444;y3444;z3444;*[x2444;y3444;z3444]]];:=[cap24;->[B24444;ay24444;sdz24444;+[B24444;ay24444;sdz24444]]];:=[xmult;->[xx;xy;xz;*[xx;xy;xz]]];:=[xcap;->[xB;xay;xsdz;+[xB;xay;xsdz]]];:=[xmult2;->[xx2;xy3;xz3;*[xx2;xy3;xz3]]];:=[xcap2;->[xB2;xay2;xsdz2;+[xB2;xay2;xsdz2]]];:=[xmult4;->[xx4;xy4;xz4;*[xx4;xy4;xz4]]];:=[xcap4;->[xB4;xay4;xsdz4;+[xB4;xay4;xsdz4]]];:=[xmult24;->[xx24;xy34;xz34;*[xx24;xy34;xz34]]];:=[xcap24;->[xB24;xay24;xsdz24;+[xB24;xay24;xsdz24]]];:=[xmult44;->[xx44;xy44;xz44;*[xx44;xy44;xz44]]];:=[xcap44;->[xB44;xay44;xsdz44;+[xB44;xay44;xsdz44]]];:=[xmult24;->[xx2444;xy3444;xz3444;*[xx2444;xy3444;xz3444]]];:=[xcap242;->[xB24444;xay24444;xsdz24444;+[xB24444;xay24444;xsdz24444]]];mult[cap[2;4;xmult24[xmult44[3;2;11];cap24[3;4;5];xcap242[1;2;3]]];5;6]`
      ),
      142740
    )
    deepStrictEqual(
      runFromInterpreted(`:= [x; 10; y; 23]; .: [x; y]`).items,
      [10, 23]
    )
    throws(() => runFromInterpreted(`/ [29; 0]`), RangeError)
    throws(
      () => runFromInterpreted(`:= [x; 1]; !throw[> [x; 1]; "Smaller "]`),
      Error
    )
  })
  it(':: ::keys ::entries ::->.: ::size ::.? should work', () => {
    deepStrictEqual(
      runFromInterpreted(`::entries [:: ["x"; 10; "y"; 23; "z"; 4]]`).items,
      [
        ['x', 10],
        ['y', 23],
        ['z', 4],
      ]
    )
    deepStrictEqual(
      runFromInterpreted(`::keys [:: ["x"; 10; "y"; 23; "z"; 4]]`).items,
      ['x', 'y', 'z']
    )
    deepStrictEqual(
      runFromInterpreted(`::->.: [:: ["x"; 10; "y"; 23; "z"; 4]]`).items,
      [10, 23, 4]
    )
    deepStrictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; 3; "y"; 4]]; .: [::.? [obj; "z"]; ::.? [obj; "x"]; ::size [obj]]`
      ).items,
      [0, 1, 2]
    )
  })
  it('simple math', () => {
    strictEqual(
      runFromInterpreted(
        `:= [x; 30]; := [result; + [* [* [+ [1; 2; 3]; 2]; / [% [4; 3]]]; x]];`
      ),
      42
    )
    deepStrictEqual(
      runFromInterpreted(`:= [distance; 
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
      closest [.: [3; 4]]];`).items,
      [4, 5]
    )
    throws(() => runFromInterpreted(`/ [29; 0]`), RangeError)
  })
  it('if', () => {
    strictEqual(
      runFromInterpreted(
        `:= [age; 18];
   ? [>= [age; 18]; "Can work!"; "Can't work"];`
      ),
      'Can work!'
    )
    deepStrictEqual(
      runFromInterpreted(`
          := [validate age; -> [age; ? [>= [age; 18]; ~ ["Can work"; ? [>=[age; 21]; " and can drink"; ""]]; "Can't work and can't drink"]]];
          .: [validate age [18]; validate age [21]; validate age [12]];
      `).items,
      ['Can work', 'Can work and can drink', "Can't work and can't drink"]
    )
  })

  it('fib sum', () => {
    strictEqual(
      runFromInterpreted(`;; calculating fib sequance
          := [fib; -> [n; ? [
            > [n; 0];
               ? [== [n; 1]; 1;
                ? [== [n; 2]; 1;
                  + [fib [- [n; 1]]; fib [- [n; 2]]]]]; n]]];
                fib[10]
                  `),
      55
    )
  })

  it('max sub array sum rec', () => {
    strictEqual(
      runFromInterpreted(`;; max_sub_array_recursive
      := [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:length [nums]]; : [
          = [maxGlobal; math_max [maxGlobal; = [maxSoFar; math_max [0; + [maxSoFar; .: . [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
      [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; math_negative[math_INFINITY]; math_negative[math_INFINITY]]`),
      21
    )
    strictEqual(
      runFromInterpreted(
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
    max_sub_array_sum [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]];`
      ),
      21
    )
  })
  it('sum median', () => {
    strictEqual(
      runFromInterpreted(`
  := [NUMBERS; .: ... [100; 1]];
  := [first; .: . [NUMBERS; 0]];
  := [last; .: . [NUMBERS; - [.:length [NUMBERS]; 1]]];
  := [median; + [first;
  - [* [last; * [+ [1; last]; 0.5]];
      * [first; * [+ [1; first]; 0.5]]]]];
  == [math_sum [NUMBERS]; median]
      `),
      1
    )
  })

  it('sum tree nodes', () => {
    strictEqual(
      runFromInterpreted(`;; sum_tree_nodes
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
      `),
      28
    )
  })

  it('import should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
      .:map>> [.: [1.123; 3.14; 4.9]; -> [x; math_floor[x]]];
      `).items,
      [1, 3, 4]
    )
    strictEqual(runFromInterpreted(`math_PI`), Math.PI)
  })

  it('nested pipes should work', () => {
    strictEqual(
      runFromInterpreted(`
        |> [
          10;
          -> [x; * [x; 3]][];
          -> [x; * [x; 10]][]
        ]`),
      300
    )
    strictEqual(
      runFromInterpreted(`
        |> [
          10;
          + [|> [2; * [10]]];
          + [4; * [100; |> [8; + [2]]]];
          - [10]
        ]`),
      1024
    )
  })
  it('logic operations should work', () => {
    strictEqual(
      runFromInterpreted(`
        == [&& [|| [0; 0; 1]; 10]; 10]
        `),
      1
    )
  })
  it('calling :: methods should work', () => {
    strictEqual(
      runFromInterpreted(`
    := [create_db; -> [:: ["connect"; -> ["connected!"]]]];
    := [db; create_db[]];
    |> [db; :: . ["connect"]][];`),
      'connected!'
    )
  })
  it('.:chunks should work', () => {
    deepStrictEqual(
      runFromInterpreted('|> [.: [1; 2; 3; 4; 5; 6]; .:chunks [3]]').items,
      [
        [1, 2, 3],
        [4, 5, 6],
      ]
    )
  })
  it('>> and << should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
    := [out; .: []];
    >> [.: [1; 2; 3; 4]; -> [x; i; a; .:>= [out; * [x; 10]]]];
    << [.: [10; 20; 30]; -> [x; i; a; .:>= [out; - [.: . [out; i]; * [x; 0.1]]]]];
    >> [out; -> [x; i; a; .: .= [out; i; + [x; i]]]];
    out;
      `).items,
      [10, 21, 32, 43, 31, 23, 15]
    )

    deepStrictEqual(
      runFromInterpreted(`
      |> [
        .: [1; 2; 3; 4];
        >> [-> [x; i; a; .: .= [a; i; * [x; 10]]]];
        << [-> [x; i; a; .: .= [a; i; - [.: . [a; i]; * [x; 0.1]]]]];
        >> [-> [x; i; a; .: .= [a; i; + [x; i]]]];
        << [-> [x; i; a; .: .= [a; i; + [.: . [a; i]; i; 1]]]];
      ]
      `).items,
      [10, 21, 32, 43]
    )
  })
  it('*>> and *<< should work', () => {
    strictEqual(
      runFromInterpreted(`:= [collection; 
:: ["x"; 1; "y"; 2; "d"; 3; "g"; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`),
      4
    )
    strictEqual(
      runFromInterpreted(`:= [collection; 
.: [1; 2; 3; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`),
      4
    )
    strictEqual(
      runFromInterpreted(`:= [collection; 
:. [1; 2; 3; 4]]; 
|> [collection; 
*>> [-> [a; x; i; c; 
? [% [x; 2]; 
:..= [a; x]; a]]; 
:. []]; 
*<< [-> [a; x; i; c; 
+ [a; x]]; 0]];`),
      4
    )
  })

  it('.:find>> should work', () => {
    strictEqual(
      runFromInterpreted(`|> [.: [1; 2; 3; 4; 5; 6; 7; 8];
    .: filter [-> [x; % [x; 2]]];
    .: map << [-> [x; * [x; 2]]];
    .: find >> [-> [x; > [x; 10]]]];`),
      14
    )
    strictEqual(
      runFromInterpreted(`|> [.: [1; 2; 3; 4; 5];
    .: filter [-> [x; == [% [x; 2]; 1]]];
	.:map>> [-> [x; 
			* [x; 10]]];
   .: reduce >> [-> [acc; x; + [acc; x]]; 0]];`),
      90
    )
    strictEqual(
      runFromInterpreted(`.:find>> [.: [1; 2; 3; 4]; -> [x;  == [x; 2]]]`),
      2
    )
    strictEqual(
      runFromInterpreted(`.:find<< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`),
      2
    )
  })
  it('.:find_index>> should work', () => {
    strictEqual(
      runFromInterpreted(`.:find_index>> [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`),
      1
    )
    strictEqual(
      runFromInterpreted(`.:find_index<< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`),
      1
    )
  })
  it('.:map>> and .:map<< should work', () => {
    deepStrictEqual(
      runFromInterpreted(
        `.:map>> [.: [1; 2; 3; 4]; -> [x; i; a; + [i; * [x; 2]]]]`
      ).items,
      [2, 5, 8, 11]
    )
    deepStrictEqual(
      runFromInterpreted(
        `.:map<< [.: [1; 2; 3; 4]; -> [x; i; a; + [i; * [x; 2]]]]`
      ).items,
      [2, 5, 8, 11].reverse()
    )
  })

  it('*loop should work', () => {
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .:[]]; *loop [3; -> [.:>=[arr; 1]]]`).items,
      [1, 1, 1]
    )
    deepStrictEqual(
      runFromInterpreted(
        `:= [arr; .:[]]; *loop [3; -> [i; .:>=[arr; +[i; 1]]]]`
      ).items,
      [1, 2, 3]
    )
  })
  it('.:>!=. should work', () => {
    strictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3];
     .:>!=. [];
     + [100]]`),
      103
    )
  })
  it('.:<!=. should work', () => {
    strictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3];
      .:<!=. [];
     + [100]]`),
      101
    )
  })
  it('...  shoud work', () => {
    deepStrictEqual(
      runFromInterpreted(`.: [
      ... [.: [1; 2; 3]; .: [4; 5; 6]];
      ]`).items,
      [[1, 2, 3, 4, 5, 6]]
    )
  })
  it('.:merge_sort and .:quick_sort should work', () => {
    deepStrictEqual(
      runFromInterpreted(` |> [
      .: [3; 4; 2; 1; 2; 3];
      .:merge_sort [-> [a; b; ? [> [a; b]; -1; 1]]]
    ];
    `).items,
      [4, 3, 3, 2, 2, 1]
    )
    deepStrictEqual(
      runFromInterpreted(` |> [
      .: [3; 4; 2; 1; 2; 3];
      .:quick_sort [-1]
    ];
    `).items,
      [4, 3, 3, 2, 2, 1]
    )
  })
  it('.:rotate should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
      .:rotate [.: [3; 4; 2; 1; 2; 3]; 2; -1]
    `).items,
      [2, 1, 2, 3, 3, 4]
    )
    deepStrictEqual(
      runFromInterpreted(`.:rotate [.: [3; 4; 2; 1; 2; 3]; 3; 1]`).items,
      [1, 2, 3, 3, 4, 2]
    )
  })
  it('.:to_string should work', () => {
    strictEqual(
      runFromInterpreted(`.:to_string [.: ["a"; "b"; "c"; "d"]; ""]`),
      'abcd'
    )
    strictEqual(
      runFromInterpreted(`.:to_string [.: ["a"; "b"; "c"; "d"]; "-"]`),
      'a-b-c-d'
    )
  })
  it('.:add_at and .:remove_from should work', () => {
    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [4; "x"; "y"; "z"];
      .:remove_from [0; 4];
      .:remove_from [3; 4]
    ]`).items,
      ['x', 'y', 'z']
    )
    deepStrictEqual(
      runFromInterpreted(`
    |> [:= [arr; .: [1; 2; 3]]; 
    .: add_at [.: length [arr]; 6; 6; 6; 6];
    .: add_at [.: length [arr]; 7; 7];
    .: add_at [.: length [arr]; 8]]
    `).items,
      [1, 2, 3, 6, 6, 6, 6, 7, 7, 8]
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [2; "x"; "y"; "z"];
    ]`).items,
      [1, 2, 'x', 'y', 'z', 3, 4, 5, 6, 7, 8]
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:remove_from [2; 4];
    ]`).items,
      [1, 2, 7, 8]
    )
    throws(
      () =>
        runFromInterpreted(
          `.:remove_from [ .: [1; 2; 3; 4; 5; 6; 7; 8]; 199; 2]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(`.:add_at [ .: [1; 2; 3; 4; 5; 6; 7; 8]; 199; "x"]`),
      RangeError
    )
  })

  it(':: . .? :: .= :: .!=  should work', () => {
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["x"]; :: . ["y"]]`
      ),
      0
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["x"]; :: . ["z"]]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["z"]; :: . ["y"]]`
        ),
      RangeError
    )
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["x"]; :: .= ["y"; 1]]; |> [obj; :: . ["x"]; :: . ["y"]]`
      ),
      1
    )
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["x"]; :: .= ["z"; 1]]; |> [obj; :: . ["x"]; :: . ["z"]]`
      ),
      1
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["x"]; :: . ["z"]; :: .= ["f"; 1]]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; :: . ["z"]; :: .= ["y"; 1]]`
        ),
      RangeError
    )

    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; :: .!=  [obj; "x"; "z"; "f"]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; :: .!=  [obj; "z"; "y"]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; :: . ["x"]; :: . ["y"]; :: . ["m"]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; :: . ["x"]; :: . ["y"]; ::.? ["m"]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; :: . ["x"]; :: . ["y"]; :: .= ["m"; 4]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; :: . ["x"]; :: . ["y"]; :: .!=  ["m"]]`
        ),
      TypeError
    )
  })
  it(':= should work', () => {
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .: []];
    := [loop; -> [i; bounds; : [.:>= [arr; i];
    ? [> [bounds; i]; loop [+= [i]; bounds]]]]][1; 12];
    arr;`).items,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    )
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .: []];
    := [loop1; -> [i;  : [
      .: <= [arr; .:[]];
      := [current; .:< [arr]];
      := [loop2; -> [j;  : [
       .: <= [current; + [j; i]];
      ? [> [j; 0]; loop2 [= [j; - [j; 1]]]]]]][10];
    ? [> [i; 0]; loop1 [= [i; - [i; 1]]]]]]][10];
    arr`).items,
      [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      ]
    )
  })
  it('^ should work', () => {
    strictEqual(
      runFromInterpreted(`:= [x; 11; y; 23];
    |> [x; 
        + [y; 23; 4];
        * [2];
        -> [x;
          * [x; x]
        ][];
       ];
    `),
      14884
    )
    strictEqual(
      runFromInterpreted(`|> [0; 
        + [2];
        -> [x; * [x; x]][]];`),
      4
    )
  })
  it('.:difference .:xor .:union .:intersection should work', () => {
    strictEqual(
      runFromInterpreted(
        `|> [
      .: [1; 2; 3; 4];
      .: -> :. [];
      :. difference [|>[.: [1; 2; 4]; .: -> :. []]];
      :. -> .: [];
      .: > []
    ];
    `
      ),
      3
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .: -> :. [];
      :. xor [:. [1; 2; 4; 6]]; 
      :. -> .: []];
    `).items,
      [3, 5, 7]
    )

    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .: -> :. [];
      :. union [:. [1; 2; 4; 6]];
      :. -> .: []];
    `).items,
      [1, 2, 3, 4, 5, 6, 7]
    )

    deepStrictEqual(
      runFromInterpreted(`
    |> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .: -> :. [];
      :. intersection [:. [1; 2; 4; 6]]; 
      :. -> .: []];
    `).items,
      [1, 2, 4, 6]
    )
  })
  it('+= -= *= should work', () => {
    strictEqual(runFromInterpreted(`:=[x; 0]; += [x]`), 1)
    strictEqual(runFromInterpreted(`:=[x; 1]; +=[x; 3]`), 4)
    strictEqual(runFromInterpreted(`:=[x; 1]; +=[x; 3]; x`), 4)
    strictEqual(runFromInterpreted(`:=[x; 1]; -= [x]`), 0)
    strictEqual(runFromInterpreted(`:=[x; 1]; -=[x; 3]`), -2)
    strictEqual(runFromInterpreted(`:=[x; 1]; -=[x; 3]; x`), -2)
    strictEqual(runFromInterpreted(`:=[x; 2]; *= [x]`), 2)
    strictEqual(runFromInterpreted(`:=[x; 2]; *=[x; 3]`), 6)
    strictEqual(runFromInterpreted(`:=[x; 2]; *=[x; 3]; x`), 6)
  })
  it('.:length :. : .:is_in_bounds should work', () => {
    deepStrictEqual(
      runFromInterpreted(
        `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:length [arr]; .: . [arr; -2]; .: . [arr; 3]; .:is_in_bounds [arr; 4]; .:is_in_bounds [arr; 9]]`
      ).items,
      [8, 7, 4, 1, 0]
    )
  })
  it('` should work', () => {
    strictEqual(runFromInterpreted('` [1]'), '1')
    strictEqual(runFromInterpreted('` ["1"]'), 1)
    strictEqual(runFromInterpreted('+ [1; 2; 3; `[" "]; ` ["10"]]'), 16)
    strictEqual(
      runFromInterpreted('~ [`[1]; `[2]; `[3]; " "; "sequance"; "!"]'),
      '123 sequance!'
    )
    strictEqual(runFromInterpreted('` [` [> [1; 2]]]'), 0)
  })
  it('.: >!=, .: <!=, .: <, .: >, .: >!=., .: <!=. should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
|> [arr; 
   .: >!= [];
   .: >!= [];
   .: <!= [];
   .: <!= []];
    `).items,
      [3, 4]
    )
    strictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: < [arr]
    `),
      1
    )
    strictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: > [arr]
    `),
      6
    )
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: [.: <!=. [arr]; arr]
    `).items,
      [1, [2, 3, 4, 5, 6]]
    )
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: [.: >!=. [arr]; arr]
    `).items,
      [6, [1, 2, 3, 4, 5]]
    )
  })
  it('complex expressions should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
    := [is_odd; -> [x; == [% [x; 2]; 0]]];
    := [is_even; -> [x; % [x; 2]]];
    := [first_element; .: < [.: [1; 2; 3; 4]]];
    := [out; |> [
        .: [3; 4; 2; 1; 2; 3];
        .:map>> [-> [x; |> [x;
         + [2; 4];
        * [10000; first_element];
        -> [x;
            |> [x; - [232321]]][]]]];
        .: map << [-> [x; math_abs[x]]];
      ]];

    .: [is_even[.:<[out]]; is_odd[.:>[out]]]`).items,
      [1, 0]
    )
  })
  it(':[] should work', () =>
    strictEqual(
      runFromInterpreted(`:= [fn; -> [x; : [
      ;; @check ?== [x; 1];
      * [x; 2]]]]; fn [3];`),
      6
    ))

  it(`=== and !== should work`, () => {
    strictEqual(runFromInterpreted(`===[.:[1;2;3]; .:[1;2;3]]`), 1)
    strictEqual(runFromInterpreted(`=== [.:[1;"2";3]; .:[1;2;3]]`), 0)
    strictEqual(runFromInterpreted(`!== [.:[1;2;3]; .:[1;2;3]]`), 0)
    strictEqual(runFromInterpreted(`!== [.:[1;"2";3]; .:[1;2;3]]`), 1)
  })
  it(`/ should work`, () => {
    strictEqual(runFromInterpreted(`* [4; / [2]]`), 2)
    strictEqual(runFromInterpreted(`* [12; / [6]]`), 2)
    strictEqual(runFromInterpreted(`* [8; / [2]]`), 4)
    strictEqual(runFromInterpreted(`* [4; / [4; 2]]`), 0.5)
  })
  it(':. should work', () => {
    deepStrictEqual(
      runFromInterpreted(` :. [1; 2; 3; 4]`),
      new Set([1, 2, 3, 4])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      :. [1; 2; 3; 4]; :. xor [:. [3; 4; 5]]
      ]`),
      new Set([1, 2, 5])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      :. [1; 2; 3; 4]; :. difference [:. [3; 4; 5]]
      ]`),
      new Set([1, 2])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      :. [1; 2; 3; 4]; :. union [:. [3; 4; 5]]
      ]`),
      new Set([1, 2, 3, 4, 5])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      :. [1; 2; 3; 4]; :. intersection [:. [3; 4; 5]]
      ]`),
      new Set([3, 4])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [:. [1; 2; 3; 4]; :. .=  [5]]`),
      new Set([1, 2, 3, 4, 5])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [:. [1; 2; 3; 4]; :. .!=  [2]]`),
      new Set([1, 3, 4])
    )
    deepStrictEqual(
      runFromInterpreted(`|> [:. [1; 2; 3; 4]; :. -> .: []]`).items,
      [1, 2, 3, 4]
    )
  })
  it('comples examples should work', () => {
    strictEqual(
      runFromInterpreted(`:= [arr; .:... [10; 1]]; 
    .:. [arr; 
     |> [arr; 
      .:adjacent_difference<< [-> [a; b; 
        * [b; a]]]; 
      .:adjacent_find_index>> [-> [a; b; 
        == [- [b; a]; 6]]]]];`),
      2
    )
    strictEqual(
      runFromInterpreted(`aliases= [xor; bit_xor; shift; bit_right_shift]; 
    := [abs; -> [x; 
      - [xor [x; 
        shift [x; 31]]; 
       shift [x; 31]]]]; 
    abs [- [1; 2]];`),
      1
    )
    deepStrictEqual(
      runFromInterpreted(`|> [.: [4; 6; 9; 13; 18; 19; 19; 15; 10]; 
    .: map >> [-> [x; i; c; ? [> [i; 0]; - [.: . [c; i]; .: . [c; - [i; 1]]]; x]]]]`)
        .items,
      [4, 2, 3, 4, 5, 1, 0, -4, -5]
    )
    strictEqual(
      runFromInterpreted(`:= [f; -> [arg; ? [< [arg; 100]; |> [arg; 
      + [1; 2; 3]; 
      * [2]; 
      f []]; arg]]]; 
  f [10];`),
      164
    )
    deepStrictEqual(
      runFromInterpreted(`|> [.: [1; 2; 3; 4; 5; 6]; 
    .:chunks_if [-> [x; 
      % [x; 2]]]; 
    .:cartesian_product []];`).items,
      [
        [1, 2],
        [1, 4],
        [1, 6],
        [3, 2],
        [3, 4],
        [3, 6],
        [5, 2],
        [5, 4],
        [5, 6],
      ]
    )
    deepStrictEqual(
      runFromInterpreted(`:= [crates; .: [:: ["22"; 
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
    == [part2]]];`).items,
      [1, 1]
    )
  })
})
