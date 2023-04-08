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
              .join('')}})()`
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
              else out += `${name}=${obj}.slice(${i})`
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
              .map((x) => `(${dfs(x, locals)})`)
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
        case '`':
          return `Inventory._cast(${dfs(tree.args[0], locals)})`
        case '.:...':
          return `Inventory._fill(${dfs(tree.args[0], locals)});`
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
          return `Inventory._mapSet(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case '::.!=':
          return `Inventory._mapRemove(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case '?==':
          return `Inventory._checkType(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case '!throw':
          return `Inventory._throw(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case '::entries':
          return `Inventory._mapEntries(${dfs(tree.args[0], locals)});`
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
        case '::->.:':
          return `Inventory._mapValues(${dfs(tree.args[0], locals)});`
        case '::keys':
          return `Inventory._mapKeys(${dfs(tree.args[0], locals)});`
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
          return `Inventory._call(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        }
        case ':.':
          return (
            'new Set([' + tree.args.map((x) => dfs(x, locals)).join(',') + ']);'
          )
        case ':..!=':
          return `Inventory._setRemove(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case ':..=':
          return `Inventory._setSet(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
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
        case ':.difference':
          return `Inventory._setDifference(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case ':.intersection':
          return `Inventory._setIntersection(${dfs(
            tree.args[0],
            locals
          )}, ${dfs(tree.args[1], locals)});`
        case ':.union':
          return `Inventory._setUnion(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case ':.xor':
          return `Inventory._setXor(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case ':.->.:':
          return `Inventory._setValues(${dfs(tree.args[0], locals)});`
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
        case 'bit::make_bit':
          return `((${dfs(tree.args[0], locals)}>>>0).toString(2));`
        case 'bit::and':
          return `(${dfs(tree.args[0], locals)}&${dfs(tree.args[1], locals)});`
        case 'bit::not':
          return `~${dfs(tree.args[0], locals)};`
        case 'bit::or':
          return `(${dfs(tree.args[0], locals)}|${dfs(tree.args[1], locals)});`
        case 'bit::xor':
          return `(${dfs(tree.args[0], locals)}^${dfs(tree.args[1], locals)});`
        case 'bit::left_shift':
          return `(${dfs(tree.args[0], locals)}<<${dfs(tree.args[1], locals)});`
        case 'bit::right_shift':
          return `(${dfs(tree.args[0], locals)}>>${dfs(tree.args[1], locals)});`
        case 'bit::un_right_shift':
          return `(${dfs(tree.args[0], locals)}>>>${dfs(
            tree.args[1],
            locals
          )});`
        case 'math::factorial':
          return `Inventory._math_factorial(${dfs(tree.args[0], locals)});`
        case 'math::permutations':
          return `Inventory._math_permutations(${dfs(
            tree.args[0],
            locals
          )}, ${dfs(tree.args[0], locals)});`
        case 'math::permutations_array':
          return `Inventory._math_permutations_array(${dfs(
            tree.args[0],
            locals
          )});`
        case 'math::lerp': {
          const [start, end, amt] = tree.args.map((x) => dfs(x, locals))
          return `((1 - ${amt}) * ${start} + ${amt} * ${end});`
        }
        case 'math::abs':
          return `Math.abs(${dfs(tree.args[0], locals)});`
        case 'math::mod': {
          const left = dfs(tree.args[0], locals)
          const right = dfs(tree.args[1], locals)
          return `(((${left} % ${right}) + ${right}) % ${right});`
        }
        case 'math::clamp':
          ;`Math.min(Math.max(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}), ${dfs(tree.args[2], locals)});`
        case 'math::sqrt':
          return `Math.sqrt(${dfs(tree.args[0], locals)});`
        case 'math::add':
          return `(${dfs(tree.args[0], locals)}+${dfs(tree.args[1], locals)});`
        case 'math::sub':
          return `(${dfs(tree.args[0], locals)}-${dfs(tree.args[1], locals)});`
        case 'math::mult':
          return `(${dfs(tree.args[0], locals)}*${dfs(tree.args[1], locals)});`
        case 'math::pow':
          return `(${dfs(tree.args[0], locals)}**${dfs(tree.args[1], locals)});`
        case 'math::pow2':
          return `(${dfs(tree.args[0], locals)}**2);`
        case 'math::divide':
          return `(${dfs(tree.args[0], locals)}/${dfs(tree.args[1], locals)});`
        case 'math::sign':
          return `Math.sign(${dfs(tree.args[0], locals)});`
        case 'math::trunc':
          return `Math.trunc(${dfs(tree.args[0], locals)});`
        case 'math::exp':
          return `Math.exp(${dfs(tree.args[0], locals)});`
        case 'math::floor':
          return `Math.floor(${dfs(tree.args[0], locals)});`
        case 'math::round':
          return `Math.round(${dfs(tree.args[0], locals)});`
        case 'math::random':
          return `Math.random();`
        case 'math::random_int': {
          const min = dfs(tree.args[0], locals)
          const max = dfs(tree.args[1], locals)
          return ` Math.floor(Math.random() * (${max} - ${min} + 1) + ${min});`
        }
        case 'math::max':
          return `Math.max(${tree.args.map((x) => dfs(x, locals))});`
        case 'math::min':
          return `Math.min(${tree.args.map((x) => dfs(x, locals))});`
        case 'math::sin':
          return `Math.sin(${dfs(tree.args[0], locals)});`
        case 'math::cos':
          return `Math.cos(${dfs(tree.args[0], locals)});`
        case 'math::tan':
          return `Math.tan(${dfs(tree.args[0], locals)});`
        case 'math::tanh':
          return `Math.tanh(${dfs(tree.args[0], locals)});`
        case 'math::atan':
          return `Math.atan(${dfs(tree.args[0], locals)});`
        case 'math::atan2':
          return `Math.atan2(${dfs(tree.args[0], locals)});`
        case 'math::acos':
          return `Math.acos(${dfs(tree.args[0], locals)});`
        case 'math::acosh':
          return `Math.acosh(${dfs(tree.args[0], locals)});`
        case 'math::asin':
          return `Math.asin(${dfs(tree.args[0], locals)});`
        case 'math::asinh':
          return `Math.asinh(${dfs(tree.args[0], locals)});`
        case 'math::atanh':
          return `Math.atanh(${dfs(tree.args[0], locals)});`
        case 'math::hypot':
          return `Math.hypot(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'math::fround':
          return `Math.fround(${dfs(tree.args[0], locals)});`
        case 'math::log':
          return `Math.log(${dfs(tree.args[0], locals)});`
        case 'math::log10':
          return `Math.log10(${dfs(tree.args[0], locals)});`
        case 'math::log2':
          return `Math.log2(${dfs(tree.args[0], locals)});`
        case 'math::sum':
          return `((${dfs(
            tree.args[0],
            locals
          )}).reduce((acc, item) => (acc += item), 0));`
        case 'math::MIN_INT':
          return `Number.MIN_SAFE_INTEGER`
        case 'math::MAX_INT':
          return `Number.MAX_SAFE_INTEGER`
        case 'math::infinity':
          return `Number.POSITIVE_INFINITY`
        case 'math::PI':
          return `Math.PI`
        case 'math::E':
          return `Math.E`
        case 'math::LN10':
          return `Math.LN10`
        case 'math::LOG10E':
          return `Math.LOG10E`
        case 'math::SQRT1_2':
          return `Math.SQRT1_2`
        case 'math::SQRT2':
          return `Math.SQRT2`
        case 'math::parse_int':
          return `parseInt(${dfs(tree.args[0], locals).toString()}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'math::number':
          return `Number(${dfs(tree.args[0], locals)});`
        case 'math::negative':
          return `-(${dfs(tree.args[0], locals)});`
        case 'text::make_regexp':
          return `new RegExp(${dfs(tree.args[0], locals)}),`
        case 'text::match':
          return `(${dfs(tree.args[0], locals)}).match(${dfs(
            tree.args[1],
            locals
          )});`
        case 'text::replace':
          return `(${dfs(tree.args[0], locals)}).replace(${dfs(
            tree.args[1],
            locals
          )});`
        case 'text::to_lower_case':
          return `(${dfs(tree.args[0], locals)}).toLowerCase();`
        case 'text::to_upper_case':
          return `(${dfs(tree.args[0], locals)}).toUpperCase();`
        case 'text::trim':
          return `(${dfs(tree.args[0], locals)}).trim();`
        case 'text::trim_start':
          return `(${dfs(tree.args[0], locals)}).trimStart();`
        case 'text::trim_end':
          return `(${dfs(tree.args[0], locals)}).trimEnd();`
        case 'time::set_timeout':
          return `setTimeout(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'time::set_interval':
          return `setInterval(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
        case 'time::set_animation': {
          return `requestAnimationFrame(${dfs(tree.args[0], locals)});`
        }
        case 'dom::div':
          return `Inventory._dom_div(${dfs(tree.args[0], locals)})`
        case 'dom::set_attribute':
          return `Inventory._dom_set_attribute(${dfs(
            tree.args[0],
            locals
          )}, ${dfs(tree.args[1], locals)}, ${dfs(tree.args[2], locals)})`
        case 'dom::get_attribute':
          return `Inventory._dom_get_attribute(${dfs(
            tree.args[0],
            locals
          )}, ${dfs(tree.args[1], locals)}, ${dfs(tree.args[2], locals)})`
        case 'dom::create_element':
          return `Inventory._dom_create_element(${dfs(tree.args[0], locals)})`
        case 'dom::insert': {
          const [container, ...rest] = tree.args
          return `Inventory._dom_insert_into_container(${dfs(
            container,
            locals
          )}, ${rest.map((x) => dfs(x, locals)).join(',')});`
        }
        case 'dom::append_to': {
          const [item, container] = tree.args
          return `Inventory._dom_insert_self_into_container(
            ${dfs(item, locals)},
            ${dfs(container, locals)});`
        }
        case 'dom::get_element_by_id':
          return `Inventory._dom_get_element_by_id(${dfs(
            tree.args[0],
            locals
          )})`
        case 'dom::set_text_content':
          return `Inventory._dom_set_text_content(${dfs(
            tree.args[0],
            locals
          )}, ${dfs(tree.args[1], locals)})`
        case 'dom::set_style':
          return `Inventory._dom_set_style(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )})`
        case 'dom::get_root':
          return `Inventory._dom_get_root();`
        case 'dom::event':
          return `Inventory._dom_add_event(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case 'dom::css_link':
          return `Inventory._dom_css_link(${dfs(tree.args[0], locals)});`
        case 'dom::load_bulma':
          return `Inventory._dom_load_bulma(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )}, ${dfs(tree.args[2], locals)});`
        case 'dom::container':
          return `Inventory._dom_container(${tree.args
            .map((x) => dfs(x, locals))
            .join(',')});`
        case 'dom::add_class':
          return `Inventory._dom_add_class(${dfs(tree.args[0], locals)}, ${dfs(
            tree.args[1],
            locals
          )});`
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
    } else if (tree.type === 'word') return tree.name
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
