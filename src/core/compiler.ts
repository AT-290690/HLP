import { Expression, Word } from '.'
import { unreachable } from './interpreter.js'
import { tokens } from './tokeniser.js'
import { Token } from './tokens'
const semiColumnEdgeCases = new Set([
  ';)',
  ';-',
  ';+',
  ';*',
  ';%',
  ';&',
  ';/',
  ';:',
  ';.',
  ';=',
  ';<',
  ';>',
  ';|',
  ';,',
  ';?',
  ',,',
  ';;',
  ';]',
])
const register: Partial<Record<Token, string>> = {
  math_factorial: 'Inventory._math_factorial',
  math_permutations: 'Inventory._math_permutations',
  math_permutations_array: 'Inventory._math_permutations_array',
  math_abs: 'Math.abs',
  math_sqrt: 'Math.sqrt',
  math_sign: 'Math.sign',
  math_trunc: 'Math.trunc',
  math_exp: 'Math.exp',
  math_floor: 'Math.floor',
  math_round: 'Math.round',
  math_random: 'Math.random',
  math_max: 'Math.max',
  math_min: 'Math.min',
  math_sin: 'Math.sin',
  math_cos: 'Math.cos',
  math_tan: 'Math.tan',
  math_tanh: 'Math.tanh',
  math_atan: '`Math.atan',
  math_atan2: 'Math.atan2',
  math_acos: 'Math.acos',
  math_acosh: 'Math.acosh',
  math_asin: 'Math.asin',
  math_asinh: 'Math.asinh',
  math_atanh: 'Math.atanh',
  math_hypot: 'Math.hypot',
  math_fround: 'Math.fround',
  math_log: 'Math.log',
  math_log10: 'Math.log10',
  math_log2: 'Math.log2',
  math_MIN_INT: 'Number.MIN_SAFE_INTEGER',
  math_MAX_INT: 'Number.MAX_SAFE_INTEGER',
  math_INFINITY: 'Number.POSITIVE_INFINITY',
  math_PI: 'Math.PI',
  math_E: 'Math.E',
  math_LN10: 'Math.LN10',
  math_LOG10E: 'Math.LOG10E',
  math_SQRT1_2: 'Math.SQRT1_2',
  math_SQRT2: 'Math.SQRT2',
  math_parse_int: 'parseInt',
  math_number: 'Number',

  time_set_timeout: 'setTimeout',
  time_set_interval: 'setInterval',
  time_set_animation: 'requestAnimationFrame',

  dom_get_body: 'Inventory._dom_get_body',
  dom_set_attribute: 'Inventory._dom_set_attribute',
  dom_set_attributes: 'Inventory._dom_set_attributes',
  dom_get_attribute: 'Inventory._dom_get_attribute',
  dom_div: 'Inventory._dom_div',
  dom_get_value: 'Inventory._dom_get_value',
  dom_set_value: 'Inventory._dom_set_value',
  dom_create_element: 'Inventory._dom_create_element',
  dom_insert: 'Inventory._dom_insert_into_container',
  dom_append_to: 'Inventory._dom_insert_self_into_container',
  dom_remove: 'Inventory._dom_remove_from_container',
  dom_detach: 'Inventory._dom_remove_self_from_container',
  dom_get_element_by_id: 'Inventory._dom_get_element_by_id',
  dom_set_text_content: 'Inventory._dom_set_text_content',
  dom_set_style: 'Inventory._dom_set_style',
  dom_get_root: 'Inventory._dom_get_root',
  dom_event: 'Inventory._dom_add_event',
  dom_css_link: 'Inventory._dom_css_link',
  dom_load_bulma: 'Inventory._dom_load_bulma',
  dom_load_milligram: 'Inventory._dom_load_milligram',
  dom_container: 'Inventory._dom_container',
  dom_add_class: 'Inventory._dom_add_class',
  dom_clear: 'Inventory._dom_clear',
  dom_add_to_box: 'Inventory._dom_add_to_box',
  dom_box: 'Inventory._dom_box',
  dom_click: 'Inventory._dom_click',

  '=>': 'Inventory._call',

  '::.=': 'Inventory._mapSet',
  '::.!=': 'Inventory._mapRemove',
  '?==': 'Inventory._checkType',
  '!throw': 'Inventory._throw',
  '::entries': 'Inventory._mapEntries',
  '::->.:': 'Inventory._mapValues',
  '::keys': 'Inventory._mapKeys',
  ':..!=': 'Inventory._setRemove',
  ':..=': 'Inventory._setSet',
  ':.difference': 'Inventory._setDifference',
  ':.intersection': 'Inventory._setIntersection',
  ':.union': 'Inventory._setUnion',
  ':.xor': 'Inventory._setXor',
  ':.->.:': 'Inventory._setValues',
  '`': 'Inventory._cast',
  '.:...': 'Inventory._fill',
}

const compile = () => {
  const vars = new Set<string>()
  const dfs = (tree: Expression, locals: Set<string>) => {
    if (!tree) return ''
    if (tree.type === 'apply') {
      const token = tree.operator.name as Token
      switch (token) {
        case ':': {
          if (tree.args.length > 1) {
            return `(()=>{${tree.args
              .map((x, i) => {
                const res = dfs(x, locals)
                return res !== undefined && i === tree.args.length - 1
                  ? ';return ' + res.toString().trimStart()
                  : res
              })
              .join('')}})();`
          } else {
            const res = dfs(tree.args[0], locals)
            return res !== undefined ? res.toString().trim() : ''
          }
        }
        case ':=': {
          let name: string,
            out = '(('
          for (let i = 0, len = tree.args.length; i < len; ++i) {
            const arg = tree.args[i]
            if (i % 2 === 0 && arg.type === 'word') {
              name = arg.name
              locals.add(name)
            } else
              out += `${name}=${dfs(arg, locals)}${i !== len - 1 ? ',' : ''}`
          }
          out += `), ${name});`
          return out
        }
        case '<-::': {
          let out = '(('
          const obj = dfs(tree.args.pop(), locals)
          for (let i = 0, len = tree.args.length; i < len; ++i) {
            const arg = tree.args[i]
            if (arg.type === 'word') {
              let name = arg.name
              locals.add(name)
              out += `${name}=${obj}.get(${`"${name}"`})${
                i !== len - 1 ? ',' : ''
              }`
            }
          }
          out += `));`

          return out
        }
        case '<-.:': {
          let out = '(('
          const obj = dfs(tree.args.pop(), locals)
          for (let i = 0, len = tree.args.length; i < len; ++i) {
            const arg = tree.args[i]
            if (arg.type === 'word') {
              let name = arg.name
              locals.add(name)
              if (i !== len - 1) out += `${name}=${obj}.at(${i}),`
              else out += `${name}=${obj}.slice(${i});`
            }
          }
          out += `));`

          return out
        }
        case '=': {
          const res = dfs(tree.args[1], locals)
          const arg = tree.args[0]
          if (arg.type === 'word') return `((${arg.name}=${res}),${arg.name});`
        }
        case '->': {
          const args = tree.args
          const body = args.pop()
          const localVars = new Set<string>()
          const evaluatedBody = dfs(body, localVars)
          const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
          return `(${args.map((x) => dfs(x, locals))}) => {${vars} ${
            body.type === 'apply' || body.type === 'value' ? 'return ' : ' '
          } ${evaluatedBody.toString().trimStart()}};`
        }
        case '~':
          return '(' + tree.args.map((x) => dfs(x, locals)).join('+') + ');'
        case '==':
          return '(' + tree.args.map((x) => dfs(x, locals)).join('===') + ');'
        case '!=':
          return '(' + tree.args.map((x) => dfs(x, locals)).join('!==') + ');'
        case '/':
          return (
            '(' + tree.args.map((x) => `1 / ${dfs(x, locals)}`).join('*') + ');'
          )
        case '+':
        case '-':
        case '*':
        case '>=':
        case '<=':
        case '>':
        case '<':
          return (
            '(' +
            tree.args.map((x) => dfs(x, locals)).join(tree.operator.name) +
            ');'
          )
        case '&&':
        case '||':
          return (
            '(' +
            tree.args
              .map((x) => `(${dfs(x, locals)});`)
              .join(tree.operator.name) +
            ');'
          )
        case '%':
          return (
            '(' +
            dfs(tree.args[0], locals) +
            '%' +
            dfs(tree.args[1], locals) +
            ');'
          )
        case '|':
          return `(${dfs(tree.args[0], locals)}.toFixed(
          ${tree.args.length === 1 ? 0 : dfs(tree.args[1], locals)}
        ));`
        case '+=':
          return `(${dfs(tree.args[0], locals)}+=${
            tree.args[1] != undefined ? dfs(tree.args[1], locals) : 1
          });`
        case '-=':
          return `(${dfs(tree.args[0], locals)}-=${
            tree.args[1] != undefined ? dfs(tree.args[1], locals) : 1
          });`
        case '*=':
          return `(${dfs(tree.args[0], locals)}*=${
            tree.args[1] != undefined ? dfs(tree.args[1], locals) : 1
          });`
        case '!':
          return '!' + dfs(tree.args[0], locals)

        case '?': {
          const conditionStack = []
          tree.args
            .map((x) => dfs(x, locals))
            .forEach((x, i) =>
              i % 2 === 0
                ? conditionStack.push(x, '?')
                : conditionStack.push(x, ':')
            )
          conditionStack.pop()
          if (conditionStack.length === 3) conditionStack.push(':', 'null;')
          return `(${conditionStack.join('')});`
        }

        case '*loop':
          return `Inventory._repeat(${dfs(tree.args[0], locals)},${dfs(
            tree.args[1],
            locals
          )});`
        case '===': {
          const [first, ...rest] = tree.args
          return `Inventory.of(${rest
            .map((x) => dfs(x, locals))
            .join(',')}).every(x => Inventory.of(${dfs(
            first,
            locals
          )}).isEqual(Inventory.of(x)));`
        }
        case '!==': {
          const [first, ...rest] = tree.args
          return `Inventory.of(${rest
            .map((x) => dfs(x, locals))
            .join(',')}).every(x => !Inventory.of(${dfs(
            first,
            locals
          )}).isEqual(Inventory.of(x)));`
        }

        case '.:find>>':
          return `${dfs(tree.args[0], locals)}.find(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:find<<':
          return `${dfs(tree.args[0], locals)}.findLast(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:every':
          return `${dfs(tree.args[0], locals)}.every(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:some':
          return `${dfs(tree.args[0], locals)}.some(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:find_index>>':
          return `${dfs(tree.args[0], locals)}.findIndex(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:find_index<<':
          return `${dfs(tree.args[0], locals)}.findLastIndex(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:<':
          return `${dfs(tree.args[0], locals)}.get(0);`
        case '.:>':
          return `${dfs(tree.args[0], locals)}.at(-1);`
        case '.:.':
          return `${dfs(tree.args[0], locals)}.at(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:is_in_bounds':
          return `${dfs(tree.args[0], locals)}.isInBounds(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:matrix':
          return `Inventory.matrix(${tree.args
            .map((x) => dfs(x, locals))
            .join(',')});`
        case '.:':
          return (
            'Inventory.of(' +
            tree.args.map((x) => dfs(x, locals)).join(',') +
            ')'
          )
        case '.:.=':
          return `${dfs(tree.args[0], locals)}.set(${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case '.:>=':
          return `${dfs(tree.args[0], locals)}.append(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:<=':
          return `${dfs(tree.args[0], locals)}.prepend(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:>!=':
          return `${dfs(tree.args[0], locals)}.head();`
        case '.:<!=':
          return `${dfs(tree.args[0], locals)}.tail();`
        case '.:>!=.':
          return `${dfs(tree.args[0], locals)}.cut();`
        case '.:<!=.':
          return `${dfs(tree.args[0], locals)}.chop();`
        case '.:from_string':
          return `Inventory._split(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case '.:to_string':
          return `${dfs(tree.args[0], locals)}.join(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:chunks':
          return `${dfs(tree.args[0], locals)}.partition(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:length':
          return `${dfs(tree.args[0], locals)}.length;`
        case '::size':
          return `${dfs(tree.args[0], locals)}.size;`
        case '...':
          return `Inventory._spreadArr([${tree.args
            .map((x) => dfs(x, locals))
            .join(',')}]);`
        case '|>': {
          return `(${dfs(tree.args[0], locals)});`
        }

        case '.:quick_sort': {
          return `${dfs(tree.args[0], locals)}.quickSort(${dfs(
            tree.args[1],
            locals
          )});`
        }
        case '.:merge_sort': {
          return `${dfs(tree.args[0], locals)}.mergeSort(${dfs(
            tree.args[1],
            locals
          )});`
        }
        case '.:->::': {
          return `${dfs(tree.args[0], locals)}.group(${dfs(
            tree.args[1],
            locals
          )});`
        }
        case '::':
          return (
            'new Map([' +
            tree.args
              .map((x) => dfs(x, locals))
              .reduce((acc, item, index) => {
                if (index % 2 === 0) {
                  const key = item.replace(';', '')
                  acc +=
                    key[0] === '"'
                      ? `["${key.replaceAll('"', '')}",`
                      : `[${key},`
                } else acc += `${item}],`
                return acc
              }, '') +
            ']);'
          )
        case "'": {
          const words = tree.args.filter(
            (expr): expr is Word => expr.type === 'word'
          )
          const names = words.map((expr) => {
            const name = expr.name
            locals.add(name)
            return `${name} = "${name}"`
          })

          return `((${names.join(',')}),${words[words.length - 1].name});`
        }
        case '::.?':
          return `${dfs(tree.args[0], locals)}.has(${dfs(
            tree.args[1],
            locals
          )});`
        case '::.':
          return `${dfs(tree.args[0], locals)}.get(${dfs(
            tree.args[1],
            locals
          )});`
        case '::.=':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`

        case '::->.:':
        case '::keys':
        case '::entries':
        case ':.->.:':
        case '`':
        case '.:...':
          return `${register[token]}(${dfs(tree.args[0], locals)});`

        case '::.!=':
        case '?==':
        case '!throw':
        case ':..!=':
        case ':..=':
        case ':.difference':
        case ':.intersection':
        case ':.union':
        case ':.xor':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`

        case '.:add_at': {
          const [first, second, ...rest] = tree.args.map((item) =>
            dfs(item, locals)
          )
          return `${first}.addAt(${second}, ...${rest});`
        }
        case '.:remove_from':
          return `${dfs(tree.args[0], locals)}.removeFrom(${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`

        case '.:rotate':
          return `${dfs(tree.args[0], locals)}.rotate(${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case '.:slice':
          return `${dfs(tree.args[0], locals)}.slice(${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case '.:flat':
          return `${dfs(tree.args[0], locals)}.flat(${dfs(
            tree.args[1],
            locals
          )});`
        case '>>':
          return `${dfs(tree.args[0], locals)}.scan(${dfs(
            tree.args[1],
            locals
          )}, 1);`
        case '<<':
          return `${dfs(tree.args[0], locals)}.scan(${dfs(
            tree.args[1],
            locals
          )}, -1);`
        case '.:map>>':
          return `${dfs(tree.args[0], locals)}.map(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:map<<':
          return `${dfs(tree.args[0], locals)}.mapRight(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:flatten':
          return `${dfs(tree.args[0], locals)}.flatten(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:filter':
          return `${dfs(tree.args[0], locals)}.filter(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:reduce>>': {
          const [array, callback, out] = tree.args.map((x) => dfs(x, locals))
          return `${array}.reduce(${callback}, ${out});`
        }
        case '.:reduce<<': {
          const [array, callback, out] = tree.args.map((x) => dfs(x, locals))
          return `${array}.reduceRight(${callback}, ${out});`
        }
        case '=>': {
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        }
        case ':.':
          return (
            'new Set([' + tree.args.map((x) => dfs(x, locals)).join(',') + ']);'
          )

        case ':..?':
          return `${dfs(tree.args[0], locals)}.has(${dfs(
            tree.args[1],
            locals
          )});`
        case ':.size':
          return `${dfs(tree.args[0], locals)}.size(${dfs(
            tree.args[1],
            locals
          )});`
        case '.:->:.':
          return `${dfs(tree.args[0], locals)}.uniform();`
        case '~*': {
          const module = dfs(tree.args.pop(), locals)
          const links = `[${tree.args.map((x) => dfs(x, locals)).join(',')}]`
          const out = `Promise.all(${links}.map(f => fetch(f).then(r => r.text())))
          .then(encodes => {
            const callback = ${module}
            const signals = Inventory.from(encodes.map((encode => buildModule(decodeBase64(decodeURIComponent(encode.trim()))))))
            ;callback(signals)
          })`
          return out
        }
        case 'string':
          return '0'
        case 'number':
          return '0'
        case 'object':
          return 'new Map()'
        case 'void':
          return '0'
        case 'array':
          return 'new Inventory()'
        case 'bit_make_bit':
          return `((${dfs(tree.args[0], locals)}>>>0).toString(2));`
        case 'bit_and':
          return `(${dfs(tree.args[0], locals)}&${dfs(tree.args[1], locals)});`
        case 'bit_not':
          return `~${dfs(tree.args[0], locals)};`
        case 'bit_or':
          return `(${dfs(tree.args[0], locals)}|${dfs(tree.args[1], locals)});`
        case 'bit_xor':
          return `(${dfs(tree.args[0], locals)}^${dfs(tree.args[1], locals)});`
        case 'bit_left_shift':
          return `(${dfs(tree.args[0], locals)}<<${dfs(tree.args[1], locals)});`
        case 'bit_right_shift':
          return `(${dfs(tree.args[0], locals)}>>${dfs(tree.args[1], locals)});`
        case 'bit_un_right_shift':
          return `(${dfs(tree.args[0], locals)}>>>${dfs(
            tree.args[1],
            locals
          )});`

        case 'math_lerp': {
          const [start, end, amt] = tree.args.map((x) => dfs(x, locals))
          return `((1 - ${amt}) * ${start} + ${amt} * ${end});`
        }

        case 'math_mod': {
          const left = dfs(tree.args[0], locals)
          const right = dfs(tree.args[1], locals)
          return `(((${left} % ${right}) + ${right}) % ${right});`
        }
        case 'math_clamp':
          return `Math.min(Math.max(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}), ${dfs(tree.args[2], locals)});`
        case 'math_sqrt':
          return `Math.sqrt(${dfs(tree.args[0], locals)});`
        case 'math_add':
          return `(${dfs(tree.args[0], locals)}+${dfs(tree.args[1], locals)});`
        case 'math_sub':
          return `(${dfs(tree.args[0], locals)}-${dfs(tree.args[1], locals)});`
        case 'math_mult':
          return `(${dfs(tree.args[0], locals)}*${dfs(tree.args[1], locals)});`
        case 'math_pow':
          return `(${dfs(tree.args[0], locals)}**${dfs(tree.args[1], locals)});`
        case 'math_pow2':
          return `(${dfs(tree.args[0], locals)}**2);`
        case 'math_divide':
          return `(${dfs(tree.args[0], locals)}/${dfs(tree.args[1], locals)});`

        case 'math_random_int': {
          const min = dfs(tree.args[0], locals)
          const max = dfs(tree.args[1], locals)
          return ` Math.floor(Math.random() * (${max} - ${min} + 1) + ${min});`
        }
        case 'math_MIN_INT':
        case 'math_MAX_INT':
        case 'math_INFINITY':
        case 'math_PI':
        case 'math_E':
        case 'math_LN10':
        case 'math_LOG10E':
        case 'math_SQRT1_2':
        case 'math_SQRT2':
          return register[token]
        case 'math_random':
          return `${register[token]}()`
        case 'math_max':
        case 'math_min':
          return `${register[token]}(${tree.args.map((x) => dfs(x, locals))});`
        case 'math_sin':
        case 'math_cos':
        case 'math_tan':
        case 'math_tanh':
        case 'math_atan':
        case 'math_atan2':
        case 'math_acos':
        case 'math_acosh':
        case 'math_asin':
        case 'math_asinh':
        case 'math_atanh':
        case 'math_fround':
        case 'math_log':
        case 'math_log10':
        case 'math_log2':
        case 'math_number':
        case 'math_factorial':
        case 'math_permutations':
        case 'math_permutations_array':
        case 'math_abs':
        case 'math_sign':
        case 'math_trunc':
        case 'math_exp':
        case 'math_floor':
        case 'math_round':
          return `${register[token]}(${dfs(tree.args[0], locals)});`
        case 'math_hypot':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'math_parse_int':
          return `${register[token]}(${dfs(
            tree.args[0],
            locals
          ).toString()}, ${dfs(tree.args[1], locals)});`
        case 'math_sum':
          return `((${dfs(
            tree.args[0],
            locals
          )}).reduce((acc, item) => (acc += item), 0));`

        case 'math_negative':
          return `-(${dfs(tree.args[0], locals)});`
        case 'text_make_regexp':
          return `new RegExp(${dfs(tree.args[0], locals)}),`
        case 'text_match':
          return `(${dfs(tree.args[0], locals)}).match(${dfs(
            tree.args[1],
            locals
          )});`
        case 'text_replace':
          return `(${dfs(tree.args[0], locals)}).replace(${dfs(
            tree.args[1],
            locals
          )});`
        case 'text_to_lower_case':
          return `(${dfs(tree.args[0], locals)}).toLowerCase();`
        case 'text_to_upper_case':
          return `(${dfs(tree.args[0], locals)}).toUpperCase();`
        case 'text_trim':
          return `(${dfs(tree.args[0], locals)}).trim();`
        case 'text_trim_start':
          return `(${dfs(tree.args[0], locals)}).trimStart();`
        case 'text_trim_end':
          return `(${dfs(tree.args[0], locals)}).trimEnd();`
        case 'time_set_timeout':
        case 'time_set_interval':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'time_set_animation': {
          return `${register[token]}(${dfs(tree.args[0], locals)});`
        }
        case 'dom_get_root':
        case 'dom_get_body':
          return `${register[token]}();`

        case 'dom_div':
        case 'dom_get_value':
        case 'dom_get_element_by_id':
        case 'dom_css_link':
        case 'dom_detach':
        case 'dom_create_element':
        case 'dom_clear':
        case 'dom_box':
          return `${register[token]}(${dfs(tree.args[0], locals)});`

        case 'dom_remove':
        case 'dom_set_text_content':
        case 'dom_set_style':
        case 'dom_set_value':
        case 'dom_add_class':
        case 'dom_add_to_box':
        case 'dom_click':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`

        case 'dom_set_attribute':
        case 'dom_set_attributes':
        case 'dom_get_attribute':
        case 'dom_event':
        case 'dom_load_bulma':
        case 'dom_load_milligram':
          return `${register[token]}(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`

        case 'dom_insert': {
          const [container, ...rest] = tree.args
          return `${register[token]}(${dfs(container, locals)}, ${rest
            .map((x) => dfs(x, locals))
            .join(',')});`
        }
        case 'dom_append_to': {
          const [item, container] = tree.args
          return `${register[token]}(
            ${dfs(item, locals)},
            ${dfs(container, locals)});`
        }

        case 'dom_container':
          return `${register[token]}(${tree.args
            .map((x) => dfs(x, locals))
            .join(',')});`

        default: {
          if (!(token in tokens)) {
            if (token)
              return (
                token +
                '(' +
                tree.args.map((x) => dfs(x, locals)).join(',') +
                ');'
              )
            else {
              return `(${dfs(tree.operator, locals)})(${tree.args
                .map((x) => dfs(x, locals))
                .join(',')});`
            }
          } else {
            unreachable(token)
          }
        }
      }
    } else if (tree.type === 'word')
      return tree.name in register ? register[tree.name] : tree.name
    else if (tree.type === 'value')
      return tree.class === 'string' ? `"${tree.value}"` : tree.value
  }
  return { dfs, vars }
}

export const compileToJs = (AST: Expression) => {
  const { dfs, vars } = compile()
  const raw = dfs(AST, vars)
  let program = ''
  for (let i = 0; i < raw.length; ++i) {
    const current = raw[i]
    const next = raw[i + 1]
    if (!semiColumnEdgeCases.has(current + next)) program += current
  }
  const top = vars.size ? `var ${[...vars].join(',')};` : ''
  return { top, program }
}
