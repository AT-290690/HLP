import { equal, deepEqual } from 'assert'
import { compress, decompress } from '../src/misc/compression.js'
import { runFromInterpreted, runFromCompiled } from '../src/misc/utils.js'
describe('compression should work as expected', () => {
  it('definitions', () =>
    [
      `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]; :: ["x"; x; "y"; y]`,
      `:= [x; 10; y; 23]; .: [x; y]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('simple math', () =>
    [`:= [x; 30]; := [result; + [/ [* [+ [1; 2; 3]; 2]; % [4; 3]]; x]];`]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))

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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('max sub array sum rec', () =>
    [
      `;; max_sub_array_recursive
      <- [MATH] [LIBRARY];
      <- [max; infinity] [MATH];
      ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:length [nums]]; : [
          = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; ^ [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
        [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; * [infinity; -1]; * [infinity; -1]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('sum median', () =>
    [
      `
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
          `,
    ]
      .map((source) => decompress(compress(source)))
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
      `,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('length of string', () =>
    [`.:length [.:from_string ["01010"; ""]];`]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('import should work', () =>
    [
      `<- [MATH; ARRAY] [LIBRARY];
      <- [floor] [MATH];
      .:map>> [.: [1.123; 3.14; 4.9]; floor];
      `,
      `<- [MATH; LOGIC; STRING; LOOP; CONVERT] [LIBRARY];
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
      `,
      `<- [MATH] [LIBRARY]; <- [PI] [MATH]; PI;`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('nested pipes should work', () =>
    [
      `|> [
        10;
        => [-> [x; * [x; 3]]];
        => [-> [x; * [x; 10]]]
      ]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('>> and << should work', () =>
    [
      `
    := [out; .: []];
    >> [.: [1; 2; 3; 4]; -> [x; i; a; .:append [out; * [x; 10]]]];
    << [.: [10; 20; 30]; -> [x; i; a; .:append [out; - [^ [out; i]; * [x; 0.1]]]]];
    >> [out; -> [x; i; a; ^= [out; i; + [x; i]]]];
    out;
    `,
      `
    |> [
      .: [1; 2; 3; 4];
      >> [-> [x; i; a; ^= [a; i; * [x; 10]]]];
      << [-> [x; i; a; ^= [a; i; - [^ [a; i]; * [x; 0.1]]]]];
      >> [-> [x; i; a; ^= [a; i; + [x; i]]]];
      << [-> [x; i; a; ^= [a; i; + [^ [a; i]; i; 1]]]];
    ]
    `,
      `
    |> [
      .: [1; 2; 3; 4];
      .:map>> [-> [x; i; a; * [x; 10]]];
      .:filter [-> [x; i; a; % [x; 2]]]
    ]
    `,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))

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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:map>> and .:map<< should work', () =>
    [
      `.:map>> [.: [1; 2; 3; 4]; -> [x; i; a; + [i; * [x; 2]]]]`,
      `|> [.: [1; 2; 3; 4]; .:map>> [-> [x; i; a; + [i; * [x; 2]]]]; .:map>> [-> [x; i; a; + [i; * [x; 2]]]]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))

  it('*loop should work', () =>
    [
      `:= [arr; .:[]]; *loop [3; -> [.:append[arr; 1]]]`,
      `:= [arr; .:[]]; *loop [3; -> [i; .:append[arr; +[i; 1]]]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:cut should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     .:cut [];
     + [100]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:chop should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     .:cut [];
     + [100]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('... shoud work', () =>
    [
      `.: [
      ... [.: [1; 2; 3]; .: [4; 5; 6]];
      ]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':: ::keys ::entries ::values .? ::size should work', () =>
    [
      `.: [::entries [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::keys [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::values [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:add_at [2; "x"; "y"; "z"];
    ]`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      .:remove_from [2; 4];
    ]`,
      `:= [obj; :: ["x"; 3; "y"; 4]]; .: [.? [obj; "z"]; .? [obj; "x"]; ::size [obj]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('~= should work', () =>
    [
      `:= [arr; .: []];
    ~= [loop1; -> [i;  : [
      .:prepend [arr; .:[]];
      := [current; .:first [arr]];
      ~= [loop2; -> [j;  : [
       .:prepend [current; + [j; i]];
      ? [> [j; 0]; loop2 [= [j; - [j; 1]]]]]]][10];
    ? [> [i; 0]; loop1 [= [i; - [i; 1]]]]]]][10];
    arr`,
      `:= [arr; .: []];
    ~= [loop; -> [i; bounds; : [.:append [arr; i];
    ? [> [bounds; i]; loop [+= [i]; bounds]]]]][1; 12];
    arr;`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it(':: should work', () =>
    [
      `:= [d; :: ["x"; 10; "y"; 23]];
    :: ["y"; 5; "m"; :: ["x"; :: ["x"; 10; "y"; d]; "y"; 23];]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
        => [-> [x;
          * [x; x]
        ]];
       ];
    `,
      `|> [0; 
      + [2];
      => [-> [x; * [x; x]]]];`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('.:difference .:xor .:union .:intersection should work', () =>
    [
      `|> [
      .: [1; 2; 3; 4];
      .:difference [.: [1; 2; 4]];
      .:last []
    ];
    `,
      `|> [
      .: [1; 2; 3; 4];
      .:difference [.: [1; 2; 4]];
      .:last []
    ];
    `,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:union [.: [1; 2; 4; 6]];
    ];
    `,
      `
    |> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:intersection [.: [1; 2; 4; 6]];
    ];
    `,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('<-:: and <-.: should work', () =>
    [
      `:= [obj; :: ["x"; 10; "y"; 12; "z"; 10]];
    <-:: [x; y; z; obj]; .:[x; y; z]`,
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]];
    <-.: [a; b; c; rest; arr]; .: [a; b; c; rest]`,
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]];
    <-.: [a; b; c; rest; arr];
    |> [rest; .:append [a]; .:append [b]; .:append [c]];`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
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
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        equal(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:length :. : .:is_in_bounds should work', () =>
    [
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:length [arr]; ^ [arr; -2]; ^ [arr; 3]; ? [.:is_in_bounds [arr; 4]; 1; 0]; ? [.:is_in_bounds [arr; 9]; 1; 0]]`,
    ]
      .map((source) => decompress(compress(source)))
      .forEach((source) =>
        deepEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
})
