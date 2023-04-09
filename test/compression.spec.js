import { equal, strictEqual, deepEqual, deepStrictEqual } from 'assert'
import { compress, decompress } from '../dist/misc/compression.js'
import { runFromInterpreted, runFromCompiled } from '../dist/misc/utils.js'
describe('compression should work as expected', () => {
  it('definitions', () =>
    [
      `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]; :: ["x"; x; "y"; y]`,
      `:= [x; 10; y; 23]; .: [x; y]`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        deepStrictEqual(
          runFromInterpreted(source).items,
          runFromCompiled(source).items
        )
      ))
  it('simple math', () =>
    [`:= [x; 30]; := [result; + [/ [* [+ [1; 2; 3]; 2]; % [4; 3]]; x]];`]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
      [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; math_negative[math_infinity[]]; math_negative[math_infinity[]]]`,
      `:= [max_sub_array_sum; -> [nums; : [
        := [max_global; * [math_infinity[]; -1];
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('length of string', () =>
    [`.:length [.:from_string ["01010"; ""]];`]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('import should work', () =>
    [` .:map>> [.: [1.123; 3.14; 4.9]; -> [x; math_floor[x]]];`, 'math_PI[]']
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        => [-> [x; * [x; 3]]];
        => [-> [x; * [x; 10]]]
      ]`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        deepStrictEqual(
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
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        => [-> [x;
          * [x; x]
        ]];
       ];
    `,
      `|> [0; 
      + [2];
      => [-> [x; * [x; x]]]];`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        deepStrictEqual(
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
    |> [rest; .:>= [a]; .:>= [b]; .:>= [c]];`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        strictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('.:length :. : .:is_in_bounds should work', () =>
    [
      `:= [arr; .: [1; 2; 3; 4; 5; 6; 7; 8]]; .: [.:length [arr]; .: . [arr; -2]; .: . [arr; 3]; ? [.:is_in_bounds [arr; 4]; 1; 0]; ? [.:is_in_bounds [arr; 9]; 1; 0]]`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
            => [-> [x;
                |> [x; - [232321]]]]]]];
            .: map << [-> [x; math_abs[x]]];
          ]];

        .: [is_even[.:<[out]]; is_odd[.:>[out]]]`,
    ]
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it(`/ should work`, () =>
    ['* [4; / [2]]', '* [12; / [6]]', '* [8; / [2]]', '* [4; / [4; 2]]']
      .map((source) => {
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
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
        const comp = compress(source)
        const decomp = decompress(comp)
        strictEqual(decomp, decompress(compress(decomp)))
        return decomp
      })
      .forEach((source) =>
        deepEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('compressoin should be idemptent', () => {
    ;[
      `'[a0;b0;c0;x;y];:=[d0;->[u;~[\`[u];"px"]];N;17;e0;1;r;*[N;e0];h;*[r;e0;-1];f0;N;g0;N;h0;*[g0;f0];i0;.:[];j0;->[x;y;.:.[i0;%[+[x;*[g0;y]];h0]]];k0;|>[dom_get_root[];dom_set_style[::["w";d0[340]]]];l0;->[x;|>[dom_create_element["bt"];dom_set_text_content["*"];dom_append_to[k0]]];m0;->[t0;u0;dom_set_style[t0;::["c";"tr";"b";"s1b";"bg";?[u0;"#000";"#fff"]]]];n0;->[i0;:[*loop[h0;->[v0;:[?[![%[v0;f0]];+=[h;r]];'[x;y];:=[u0;math_random_int[0;1];w0;math_random_int[0;1];x0;|>[l0[r];m0[1]];t0;::[c0;u0;b0;w0;a0;x0]];.:>=[i0;t0]]]]]];o0;->[i0;y0;:[:=[y;-1];>>[i0;->[t0;i;i0;:[=[y;?[%[i;g0];y;+=[y]]];:=[x;%[i;f0];t0;j0[x;y]];y0[t0;x;y]]]]]];p0;.:[::[x;0;y;1];::[x;1;y;0];::[x;-1;y;0];::[x;0;y;-1];::[x;1;y;-1];::[x;-1;y;-1];::[x;1;y;1];::[x;-1;y;1]];q0;->[X;Y;:[:=[z0;0];>>[p0;->[A0;:[:=[t0;j0[+[X;::.[A0;x]];+[Y;::.[A0;y]]]];=[z0;+[z0;?[t0;::.[t0;c0];0]]]]]];z0]];r0;->[o0[i0;->[t0;x;y;:[:=[u0;::.[t0;c0];B0;q0[x;y]];?[&&[u0;<[B0;2]];::.=[t0;b0;0];?[&&[u0;>[B0;3]];::.=[t0;b0;0];?[&&[![u0];==[B0;3]];::.=[t0;b0;1]]]]]]]];s0;->[o0[i0;->[t0;x;y;:[:=[u0;::.[t0;c0]];|>[::.[t0;a0];m0[u0]];::.=[t0;c0;::.[t0;b0]]]]]]];n0[i0];time_set_interval[->[:[r0[];s0[]]];100];`,
      `dom_load_bulma[0;9;4];:=[a0;dom_create_element;b0;dom_get_value;c0;dom_set_attribute;d0;dom_add_class;e0;dom_set_style;f0;dom_set_text_content;g0;dom_detach;h0;dom_append_to;i0;->[e;dom_set_value[e;""]];j0;->[c;a;:[>>[a;->[x;h0[x;c]]];c]];k0;->[a;:[:=[c;a0["div"]];>>[a;->[x;h0[x;c]]];c]];l0;->[e;c;dom_event[e;"click";c]]];:=[m0;|>[dom_get_root[]]];:=[n0;->[e;:[h0[j0[|>[:=[p0;a0["li"]];d0["panel-block"]];.:[j0[|>[a0["span"];d0["panel-icon"]];.:[|>[a0["span"];f0["✔"]]]];|>[a0["span"];f0[b0[q0]];d0["mr-2"]];|>[a0["button"];d0["delete"];d0["is-pulled-right"];l0[->[dom_detach[p0]]]]]];o0];i0[q0]]]];|>[k0[.:[j0[|>[a0["section"];d0["section"]];.:[k0[.:[|>[a0["h1"];d0["title"];f0["To-Do List"]];|>[k0[.:[|>[k0[.:[:=[q0;|>[a0["input"];d0["input"];c0["placeholder";"Add a new task"]]]]];d0["control"];d0["is-expanded"]];|>[k0[.:[|>[a0["button"];d0["button"];d0["is-primary"];f0["Add"];l0[n0]]]];d0["control"]]]];d0["field"];d0["has-addons"]];:=[o0;|>[a0["ul"];d0["panel"]]]]]]]]];h0[m0]]`,
      `:=[a0;->[i;b0;c0;d0;?[<[i;.:length[b0]];:[=[c0;math_max[c0;=[d0;math_max[0;+[d0;.:.[b0;i]]]]]];a0[+=[i];b0;c0;d0]];c0]]][0;.:[1;-2;10;-5;12;3;-2;3;-199;10];*[math_infinity[];-1];*[math_infinity[];-1]]`,
    ].forEach((source) => strictEqual(source, decompress(compress(source))))
  })
})
