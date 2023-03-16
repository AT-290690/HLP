import { throws, strictEqual, deepStrictEqual } from 'assert'
import { runFromInterpreted } from '../src/misc/utils.js'
describe('interpretation should work as expected', () => {
  it('definitions', () => {
    deepStrictEqual(
      runFromInterpreted(
        `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]`
      ),
      10
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
  it(':: ::keys ::entries ::values ::size .? should work', () => {
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
      runFromInterpreted(`::values [:: ["x"; 10; "y"; 23; "z"; 4]]`).items,
      [10, 23, 4]
    )
    deepStrictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; 3; "y"; 4]]; .: [.? [obj; "z"]; .? [obj; "x"]; ::size [obj]]`
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
      <- [MATH] [LIBRARY];
      <- [max; infinity] [MATH];
      ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:length [nums]]; : [
          = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; ^ [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
      [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; * [infinity; -1]; * [infinity; -1]]`),
      21
    )
    strictEqual(
      runFromInterpreted(
        `<- [MATH] [LIBRARY];
    <- [max; infinity] [MATH];
    := [max_sub_array_sum; -> [nums; : [
       := [max_global; * [infinity; -1]; 
           max_so_far;  max_global];    
       * loop [.: length [nums]; -> [i; 
               = [max_global; 
                  max [max_global; 
                       = [max_so_far; 
                          max [0; 
                               + [max_so_far; 
                                  ^ [nums; i]]]]]]]]]]];
    max_sub_array_sum [.: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]];`
      ),
      21
    )
  })
  it('sum median', () => {
    strictEqual(
      runFromInterpreted(`
  <- [MATH; ARRAY] [LIBRARY];
  <- [sum] [MATH];
  <- [range] [ARRAY];

  := [NUMBERS; range [1; 100]];
  := [first; ^ [NUMBERS; 0]];
  := [last; ^ [NUMBERS; - [.:length [NUMBERS]; 1]]];
  := [median; + [first;
  - [* [last; * [+ [1; last]; 0.5]];
      * [first; * [+ [1; first]; 0.5]]]]];
  == [sum [NUMBERS]; median]
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
          + [. [item; "value"];
             sum [. [item; "left"]];
             sum [. [item; "right"]]]]]];

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
      runFromInterpreted(`<- [MATH; ARRAY] [LIBRARY];
      <- [floor] [MATH];
      .:map>> [.: [1.123; 3.14; 4.9]; floor];
      `).items,
      [1, 3, 4]
    )

    strictEqual(
      runFromInterpreted(`<- [MATH; LOGIC; STRING; LOOP; CONVERT] [LIBRARY];
      <- [floor; PI; sin; cos] [MATH];
      <- [trim; upper_case] [STRING];
      <- [string] [CONVERT];
      <- [repeat] [LOOP];
      <- [is_equal] [LOGIC];
  
      ? [|> [
        12;
        + [sin [4]];
        > [10];
        is_equal [10];  
      ]; 1; 
      |> [15; + [100]; string []; ~ ["hello"; " "; "there"]; upper_case []]];
      `),
      '115HELLO THERE'
    )

    strictEqual(
      runFromInterpreted(`<- [MATH] [LIBRARY]; <- [PI] [MATH]; PI;`),
      Math.PI
    )
  })

  it('nested pipes should work', () => {
    strictEqual(
      runFromInterpreted(`
        |> [
          10;
          => [-> [x; * [x; 3]]];
          => [-> [x; * [x; 10]]]
        ]`),
      300
    )
  })
  it('calling :: methods should work', () => {
    strictEqual(
      runFromInterpreted(`
    := [create_db; -> [:: ["connect"; -> ["connected!"]]]];
    := [db; create_db[]];
    |> [db; . ["connect"]][];`),
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
    >> [.: [1; 2; 3; 4]; -> [x; i; a; .:append [out; * [x; 10]]]];
    << [.: [10; 20; 30]; -> [x; i; a; .:append [out; - [^ [out; i]; * [x; 0.1]]]]];
    >> [out; -> [x; i; a; ^= [out; i; + [x; i]]]];
    out;
      `).items,
      [10, 21, 32, 43, 31, 23, 15]
    )

    deepStrictEqual(
      runFromInterpreted(`
      |> [
        .: [1; 2; 3; 4];
        >> [-> [x; i; a; ^= [a; i; * [x; 10]]]];
        << [-> [x; i; a; ^= [a; i; - [^ [a; i]; * [x; 0.1]]]]];
        >> [-> [x; i; a; ^= [a; i; + [x; i]]]];
        << [-> [x; i; a; ^= [a; i; + [^ [a; i]; i; 1]]]];
      ]
      `).items,
      [10, 21, 32, 43]
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
      runFromInterpreted(`:= [arr; .:[]]; *loop [3; -> [.:append[arr; 1]]]`)
        .items,
      [1, 1, 1]
    )
    deepStrictEqual(
      runFromInterpreted(
        `:= [arr; .:[]]; *loop [3; -> [i; .:append[arr; +[i; 1]]]]`
      ).items,
      [1, 2, 3]
    )
  })
  it('.:cut should work', () => {
    strictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3];
     .:cut [];
     + [100]]`),
      103
    )
  })
  it('.:chop should work', () => {
    strictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3];
      .:chop [];
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

  it('. .? .= .!= should work', () => {
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["x"]; . ["y"]]`
      ),
      0
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["x"]; . ["z"]]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["z"]; . ["y"]]`
        ),
      RangeError
    )
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["x"]; .= ["y"; 1]]; |> [obj; . ["x"]; . ["y"]]`
      ),
      1
    )
    strictEqual(
      runFromInterpreted(
        `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["x"]; .= ["z"; 1]]; |> [obj; . ["x"]; . ["z"]]`
      ),
      1
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["x"]; . ["z"]; .= ["f"; 1]]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; |> [obj; . ["z"]; .= ["y"; 1]]`
        ),
      RangeError
    )

    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; .!= [obj; "x"; "z"; "f"]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]]; .!= [obj; "z"; "y"]`
        ),
      RangeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; . ["x"]; . ["y"]; . ["m"]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; . ["x"]; . ["y"]; .? ["m"]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; . ["x"]; . ["y"]; .= ["m"; 4]]`
        ),
      TypeError
    )
    throws(
      () =>
        runFromInterpreted(
          `:= [obj; :: ["x"; :: ["y"; 0]]];|> [obj; . ["x"]; . ["y"]; .!= ["m"]]`
        ),
      TypeError
    )
  })
  it('~= should work', () => {
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .: []];
    ~= [loop; -> [i; bounds; : [.:append [arr; i];
    ? [> [bounds; i]; loop [+= [i]; bounds]]]]][1; 12];
    arr;`).items,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    )
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .: []];
    ~= [loop1; -> [i;  : [
      .:prepend [arr; .:[]];
      := [current; .:first [arr]];
      ~= [loop2; -> [j;  : [
       .:prepend [current; + [j; i]];
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
        => [-> [x;
          * [x; x]
        ]];
       ];
    `),
      14884
    )
    strictEqual(
      runFromInterpreted(`|> [0; 
        + [2];
        => [-> [x; * [x; x]]]];`),
      4
    )
  })
  it('.:difference .:xor .:union .:intersection should work', () => {
    strictEqual(
      runFromInterpreted(
        `|> [
      .: [1; 2; 3; 4];
      .:difference [.: [1; 2; 4]];
      .:last []
    ];
    `
      ),
      3
    )
    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:xor [.: [1; 2; 4; 6]];
    ];
    `).items,
      [3, 5, 7]
    )

    deepStrictEqual(
      runFromInterpreted(`|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:union [.: [1; 2; 4; 6]];
    ];
    `).items,
      [1, 2, 3, 4, 5, 6, 7, 1, 2, 4, 6]
    )

    deepStrictEqual(
      runFromInterpreted(`
    |> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:intersection [.: [1; 2; 4; 6]];
    ];
    `).items,
      [1, 2, 4, 6]
    )
  })
  it('<-:: and <-.: should work', () => {
    deepStrictEqual(
      runFromInterpreted(`:= [obj; :: ["x"; 10; "y"; 12; "z"; 10]];
  <-:: [x; y; z; obj]; .:[x; y; z]`).items,
      [10, 12, 10]
    )
    deepStrictEqual(
      runFromInterpreted(`:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]];
       <-.: [a; b; c; rest; arr]; .: [a; b; c; rest]`).items,
      [1, 2, 3, [4, 5, 6, 7, 8]]
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
        `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:length [arr]; ^ [arr; -2]; ^ [arr; 3]; .:is_in_bounds [arr; 4]; .:is_in_bounds [arr; 9]]`
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
  })
  it('.: head, .: tail, .: first, .: last, .: cut, .: chop should work', () => {
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
|> [arr; 
   .: head [];
   .: head [];
   .: tail [];
   .: tail []];
    `).items,
      [3, 4]
    )
    strictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: first [arr]
    `),
      1
    )
    strictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: last [arr]
    `),
      6
    )
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: [.: chop [arr]; arr]
    `).items,
      [1, [2, 3, 4, 5, 6]]
    )
    deepStrictEqual(
      runFromInterpreted(`
    := [arr; .: [1; 2; 3; 4; 5; 6]];
      .: [.: cut [arr]; arr]
    `).items,
      [6, [1, 2, 3, 4, 5]]
    )
  })
  it('complex expressions should work', () => {
    deepStrictEqual(
      runFromInterpreted(`<- [MATH] [LIBRARY];
    <- [abs] [MATH];
    := [is_odd; -> [x; == [% [x; 2]; 0]]];
    := [is_even; -> [x; % [x; 2]]];
    := [first_element; .: first [.: [1; 2; 3; 4]]];
    := [out; |> [
        .: [3; 4; 2; 1; 2; 3];
        .:map>> [-> [x; |> [x;
         + [2; 4];
        * [10000; first_element];
        => [-> [x; 
            |> [x; - [232321]]]]]]];
        .: map << [-> [x; abs[x]]];
      ]];
      
    .: [is_even[.:first[out]]; is_odd[.:last[out]]]`).items,
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
})
