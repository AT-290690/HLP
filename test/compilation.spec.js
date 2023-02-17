import { equal, deepEqual } from 'assert'
import { runFromInterpreted, runFromCompiled } from '../src/misc/utils.js'
describe('compilation should work as expected', () => {
  it('definitions', () =>
    [
      `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]; :: ["x"; x; "y"; y]`,
      `:= [x; 10; y; 23]; .: [x; y]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('simple math', () =>
    [
      `:= [x; 30]; := [result; + [/ [* [+ [1; 2; 3]; 2]; % [4; 3]]; x]];`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
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
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
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
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('max sub array sum rec', () =>
    [
      `;; max_sub_array_recursive
      <- [MATH] [LIBRARY];
      <- [max; infinity] [MATH];
      ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:? [nums]]; : [
          = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; ^ [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
        [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; * [infinity; -1]; * [infinity; -1]]`,
    ].forEach((source) =>
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
      := [last; ^ [NUMBERS; - [.:? [NUMBERS]; 1]]];
      := [median; + [first;
      - [* [last; * [+ [1; last]; 0.5]];
          * [first; * [+ [1; first]; 0.5]]]]];
      == [sum [NUMBERS]; median]
          `,
    ].forEach((source) =>
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
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('length of string', () =>
    [`.:? [.-: ["01010"; ""]];`].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('split and join', () =>
    [
      `.+:[.-: ["01010"; ""]; "-"];`,
      `|> [
      .: [3; 4; 2; 1; 2; 3];
      :+: [3];
      >>. [-> [x; ~["["; .+: [x; ", "]; "]"]]];
     .+: [", "]
    ];`,
      `|> [:+: [.: [3; 4; 2; 1; 2; 3]; 2]; >>. [-> [x; ~["["; .+: [x; ", "]; "]"]]]; .+: [", "]];`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      :+ [4; "x"; "y"; "z"];
      :- [0; 4];
      :- [3; 4];
      .+: [", "]
    ];`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      :+ [2; "x"; "y"; "z"];
            .+: [", "]
    ]`,
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('import should work', () =>
    [
      `<- [MATH; ARRAY] [LIBRARY];
      <- [floor] [MATH];
      >>. [.: [1.123; 3.14; 4.9]; floor];
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
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('nested pipes should work', () =>
    [
      `|> [
        10;
        => [-> [x; * [x; 3]]];
        => [-> [x; * [x; 10]]]
      ]`,
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('>> and << should work', () =>
    [
      `
    := [out; .: []];
    >> [.: [1; 2; 3; 4]; -> [x; i; a; .:= [out; * [x; 10]]]];
    << [.: [10; 20; 30]; -> [x; i; a; .:= [out; - [^ [out; i]; * [x; 0.1]]]]];
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
      >>. [-> [x; i; a; * [x; 10]]];
      >- [-> [x; i; a; % [x; 2]]]
    ]
    `,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))

  it('><> should work', () =>
    [
      `><> [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `<>< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `>.: [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
      `.:< [.: [1; 2; 3; 4]; -> [x; == [x; 2]]]`,
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('>>. and .<< should work', () =>
    [
      `>>. [.: [1; 2; 3; 4]; -> [x; i; a; + [i; * [x; 2]]]]`,
      `|> [.: [1; 2; 3; 4]; >>. [-> [x; i; a; + [i; * [x; 2]]]]; >>. [-> [x; i; a; + [i; * [x; 2]]]]]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))

  it('@ should work', () =>
    [
      `:= [arr; .:[]]; @ [3; -> [.:=[arr; 1]]]`,
      `:= [arr; .:[]]; @ [3; -> [i; .:=[arr; +[i; 1]]]]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('|. should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     |. [];
     + [100]]`,
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('.| should work', () =>
    [
      `|> [
      .: [1; 2; 3];
     |. [];
     + [100]]`,
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('... shoud work', () =>
    [
      `.: [
      ... [.: [1; 2; 3]; .: [4; 5; 6]];
      ]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('*:: and ~:: should work', () =>
    [
      ` |> [
      .: [3; 4; 2; 1; 2; 3];
      *:: [-> [a; b; ? [> [a; b]; -1; 1]]]
    ];
    `,
      ` |> [
      .: [3; 4; 2; 1; 2; 3];
      ~:: [-1]
    ];
    `,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it(':: ::. ::: ::* .? ::? should work', () =>
    [
      `.: [::: [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::. [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
      `.: [::* [:: ["x"; 10; "y"; 23; "z"; 4]]]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it(':+: should work', () =>
    [
      `|> [
      .: [3; 4; 2; 1; 2; 3];
      :+: [3]
    ];`,
      `:+: [.: [3; 4; 2; 1; 2; 3]; 2];`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it(':+ and :- should work', () =>
    [
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      :+ [4; "x"; "y"; "z"];
      :- [0; 4];
      :- [3; 4]
    ]`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      :+ [2; "x"; "y"; "z"];
    ]`,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7; 8];
      :- [2; 4];
    ]`,
      `:= [obj; :: ["x"; 3; "y"; 4]]; .: [.? [obj; "z"]; .? [obj; "x"]; ::? [obj]]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('~= should work', () =>
    [
      `:= [arr; .: []];
    ~= [loop1; -> [i;  : [
      =.: [arr; .:[]];
      := [current; .> [arr]];
      ~= [loop2; -> [j;  : [
       =.: [current; + [j; i]];
      ? [> [j; 0]; loop2 [= [j; - [j; 1]]]]]]][10];
    ? [> [i; 0]; loop1 [= [i; - [i; 1]]]]]]][10];
    arr`,
      `:= [arr; .: []];
    ~= [loop; -> [i; bounds; : [.:= [arr; i];
    ? [> [bounds; i]; loop [+= [i]; bounds]]]]][1; 12];
    arr;`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it(':: should work', () =>
    [
      `:= [d; :: ["x"; 10; "y"; 23]];
    :: ["y"; 5; "m"; :: ["x"; :: ["x"; 10; "y"; d]; "y"; 23];]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
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
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('<> </> .:. >< should work', () =>
    [
      `|> [
      .: [1; 2; 3; 4];
      <> [.: [1; 2; 4]];
      .< []
    ];
    `,
      `|> [
      .: [1; 2; 3; 4];
      <> [.: [1; 2; 4]];
      .< []
    ];
    `,
      `|> [
      .: [1; 2; 3; 4; 5; 6; 7];
      .:. [.: [1; 2; 4; 6]];
    ];
    `,
      `
    |> [
      .: [1; 2; 3; 4; 5; 6; 7];
      >< [.: [1; 2; 4; 6]];
    ];
    `,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    ))
  it('<-:: and <-.: should work', () =>
    [
      `:= [obj; :: ["x"; 10; "y"; 12; "z"; 10]];
    <-:: [x; y; z; obj]; .:[x; y; z]`,
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]];
    <-.: [a; b; c; rest; arr]; .: [a; b; c; rest]`,
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]];
    <-.: [a; b; c; rest; arr];
    |> [rest; .:= [a]; .:= [b]; .:= [c]];`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
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
    ].forEach((source) =>
      equal(runFromInterpreted(source), runFromCompiled(source))
    ))
  it('.:? :. : :? should work', () => {
    ;[
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:? [arr]; ^ [arr; -2]; ^ [arr; 3]; ? [:? [arr; 4]; 1; 0]; ? [:? [arr; 9]; 1; 0]]`,
    ].forEach((source) =>
      deepEqual(runFromInterpreted(source).items, runFromCompiled(source).items)
    )
  })
})
