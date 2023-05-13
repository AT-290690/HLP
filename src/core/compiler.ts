import { Expression, Word } from '.'
import { unreachable } from './interpreter.js'
import { VOID, tokens } from './tokeniser.js'
import { Token } from './tokens'
const CAST_BOOLEAN_TO_NUMBER = true
const handleBoolean = (source: string) =>
  CAST_BOOLEAN_TO_NUMBER ? `+${source}` : source
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
const units: Partial<Record<Token, string>> = {
  units_pixels: 'px',
  units_percent: '%',
  units_viewport_height: 'vh',
  units_viewport_width: 'vw',
  units_centimeters: 'cm',
  units_millimeters: 'mm',
  units_inches: 'in',
  units_points: 'pt',
  units_picas: 'pc',
}
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

  dom_click: 'Inventory._dom_click',
  dom_mouse_down: 'Inventory._dom_mouse_down',
  dom_mouse_up: 'Inventory.__dom_mouse_up',
  dom_key_down: 'Inventory.__dom_key_down',
  dom_key_up: 'Inventory.__dom_key_up',

  dom_css_link: 'Inventory._dom_css_link',
  dom_load_bulma: 'Inventory._dom_load_bulma',
  dom_load_milligram: 'Inventory._dom_load_milligram',
  dom_on_change: 'Inventory._dom_on_change',
  dom_add_class: 'Inventory._dom_add_class',
  dom_clear: 'Inventory._dom_clear',
  dom_ns_element: 'Inventory._create_element_ns',
  dom_act: 'Inventory._dom_active',

  dom_canvas: 'Inventory._dom_canvas',

  canvas_arc: 'Inventory._canvas_arc',
  canvas_get_context: 'Inventory._canvas_get_context',
  canvas_arc_to: 'Inventory._canvas_arc_to',
  canvas_begin_path: 'Inventory._canvas_begin_path',
  canvas_bezier_curve_to: 'Inventory._canvas_bezier_curve_to',
  canvas_clear_rect: 'Inventory._canvas_clear_rect',
  canvas_clip: 'Inventory._canvas_clip',
  canvas_close_path: 'Inventory._canvas_close_path',
  canvas_ellipse: 'Inventory._canvas_ellipse',
  canvas_fill: 'Inventory._canvas_fill',
  canvas_fill_rect: 'Inventory._canvas_fill_rect',

  canvas_fill_style: 'Inventory._canvas_fill_style',
  canvas_get_image_data: 'Inventory._canvas_get_image_data',

  canvas_get_transform: 'Inventory._canvas_get_transform',
  canvas_set_transform: 'Inventory._canvas_set_transform',
  canvas_reset_transform: 'Inventory._canvas_reset_transform',

  canvas_is_point_in_path: 'Inventory._canvas_is_point_in_path',
  canvas_is_point_in_stroke: 'Inventory._canvas_is_point_in_stroke',
  canvas_line_to: 'Inventory._canvas_line_to',
  canvas_line_width: 'Inventory._canvas_line_width',
  canvas_move_to: 'Inventory._canvas_move_to',
  canvas_quadratic_curve_to: 'Inventory._canvas_quadratic_curve_to',
  canvas_rect: 'Inventory._canvas_rect',
  canvas_reset: 'Inventory._canvas_reset',
  canvas_reset_trasform: 'Inventory._canvas_reset_trasform',
  canvas_restore: 'Inventory._canvas_restore',
  canvas_rotate: 'Inventory._canvas_rotate',
  canvas_round_rect: 'Inventory._canvas_round_rect',
  canvas_save: 'Inventory._canvas_save',
  canvas_scale: 'Inventory._canvas_scale',
  canvas_stroke: 'Inventory._canvas_stroke',
  canvas_stroke_style: 'Inventory._canvas_stroke_style',
  canvas_transform: 'Inventory._canvas_transform',
  canvas_translate: 'Inventory._canvas_translate',
  canvas_draw_image: 'Inventory._canvas_draw_image',

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
  '>-': 'Inventory.filtrate',
}
type Compiler = (tree: Expression, locals: Set<string>) => string
type Parser = (args: Expression[], locals: Set<string>) => string[]
const parse: Parser = (args: Expression[], locals: Set<string>) =>
  args.map((x) => compile(x, locals))
const parseArgs = (
  args: Expression[],
  locals: Set<string>,
  separator: string = ','
): string => parse(args, locals).join(separator)
const compile: Compiler = (tree, locals) => {
  if (!tree) return ''
  if (tree.type === 'apply') {
    const treeArgs = tree.args
    const token =
      tree.operator.type === 'word' ? (tree.operator.name as Token) : undefined
    switch (token) {
      case ':': {
        if (treeArgs.length > 1) {
          return `(()=>{${treeArgs
            .map((x, i) => {
              const res = compile(x, locals)
              return res !== undefined && i === treeArgs.length - 1
                ? ';return ' + res.toString().trimStart()
                : res
            })
            .join('')}})();`
        } else {
          const res = compile(treeArgs[0], locals)
          return res !== undefined ? res.toString().trim() : ''
        }
      }
      case ':=': {
        let name: string,
          out = '(('
        for (let i = 0, len = treeArgs.length; i < len; ++i) {
          const arg = treeArgs[i]
          if (i % 2 === 0 && arg.type === 'word') {
            name = arg.name
            locals.add(name)
          } else
            out += `${name}=${compile(arg, locals)}${i !== len - 1 ? ',' : ''}`
        }
        out += `), ${name});`
        return out
      }
      case '=': {
        const res = compile(treeArgs[1], locals)
        const arg = treeArgs[0]
        if (arg.type === 'word') return `((${arg.name}=${res}),${arg.name});`
      }
      case '->': {
        const args = treeArgs
        const body = args.pop()
        const localVars = new Set<string>()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        return `(${parseArgs(args, locals)}) => {${vars} ${
          body.type === 'apply' || body.type === 'value' ? 'return ' : ' '
        } ${evaluatedBody.toString().trimStart()}};`
      }
      case '~':
        return '(' + parseArgs(treeArgs, locals, '+') + ');'
      case '==':
        return handleBoolean(`(${parseArgs(treeArgs, locals, '===')});`)
      case '!=':
        return handleBoolean(`(${parseArgs(treeArgs, locals, '!==')});`)
      case '/':
        return `(${treeArgs
          .map((x) => `1 / ${compile(x, locals)}`)
          .join('*')});`

      case '>=':
      case '<=':
      case '>':
      case '<':
        return handleBoolean(`(${parseArgs(treeArgs, locals, token)});`)

      case '+':
      case '-':
      case '*':
      case '&&':
      case '||':
        return `(${parseArgs(treeArgs, locals, token)});`
      case '%':
        return `(${compile(treeArgs[0], locals)}%${compile(
          treeArgs[1],
          locals
        )});`
      case '|':
        return `(${compile(treeArgs[0], locals)}.toFixed(
        ${treeArgs.length === 1 ? 0 : compile(treeArgs[1], locals)}
      ));`
      case '+=':
        return `(${compile(treeArgs[0], locals)}+=${
          treeArgs[1] != undefined ? compile(treeArgs[1], locals) : 1
        });`
      case '-=':
        return `(${compile(treeArgs[0], locals)}-=${
          treeArgs[1] != undefined ? compile(treeArgs[1], locals) : 1
        });`
      case '*=':
        return `(${compile(treeArgs[0], locals)}*=${
          treeArgs[1] != undefined ? compile(treeArgs[1], locals) : 1
        });`
      case '!':
        return handleBoolean(`!${compile(treeArgs[0], locals)}`)
      case '?': {
        const conditionStack = []
        treeArgs
          .map((x) => compile(x, locals))
          .forEach((x, i) =>
            i % 2 === 0
              ? conditionStack.push(x, '?')
              : conditionStack.push(x, ':')
          )
        conditionStack.pop()
        if (conditionStack.length === 3) conditionStack.push(':', 0, ';')
        return `(${conditionStack.join('')});`
      }

      case '*loop':
        return `Inventory._repeat(${parseArgs(treeArgs, locals)});`
      case '===': {
        const [first, ...rest] = treeArgs
        return handleBoolean(
          `Inventory.of(${parseArgs(
            rest,
            locals
          )}).every(x => Inventory.of(${compile(
            first,
            locals
          )}).isEqual(Inventory.of(x)));`
        )
      }
      case '!==': {
        const [first, ...rest] = treeArgs
        return handleBoolean(
          `Inventory.of(${parseArgs(
            rest,
            locals
          )}).every(x => !Inventory.of(${compile(
            first,
            locals
          )}).isEqual(Inventory.of(x)));`
        )
      }

      case '.:find>>':
        return `${compile(treeArgs[0], locals)}.find(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:find<<':
        return `${compile(treeArgs[0], locals)}.findLast(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:every':
        return handleBoolean(
          `${compile(treeArgs[0], locals)}.every(${compile(
            treeArgs[1],
            locals
          )});`
        )
      case '.:some':
        return handleBoolean(
          `${compile(treeArgs[0], locals)}.some(${compile(
            treeArgs[1],
            locals
          )});`
        )
      case '.:find_index>>':
        return `${compile(treeArgs[0], locals)}.findIndex(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:find_index<<':
        return `${compile(treeArgs[0], locals)}.findLastIndex(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:<':
        return `${compile(treeArgs[0], locals)}.get(0);`
      case '.:>':
        return `${compile(treeArgs[0], locals)}.at(-1);`
      case '.:.':
        return `${compile(treeArgs[0], locals)}.at(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:is_in_bounds':
        return handleBoolean(
          `${compile(treeArgs[0], locals)}.isInBounds(${compile(
            treeArgs[1],
            locals
          )});`
        )
      case '.:matrix':
        return `Inventory.matrix(${treeArgs
          .map((x) => compile(x, locals))
          .join(',')});`
      case '.:':
        return `Inventory.of(${parseArgs(treeArgs, locals)})`
      case '.:.=':
        return `${compile(treeArgs[0], locals)}.set(${compile(
          treeArgs[1],
          locals
        )}, ${compile(treeArgs[2], locals)});`
      case '.:>=':
        return `${compile(treeArgs[0], locals)}.append(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:<=':
        return `${compile(treeArgs[0], locals)}.prepend(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:>!=':
        return `${parseArgs(treeArgs, locals)}.head();`
      case '.:<!=':
        return `${parseArgs(treeArgs, locals)}.tail();`
      case '.:>!=.':
        return `${parseArgs(treeArgs, locals)}.cut();`
      case '.:<!=.':
        return `${parseArgs(treeArgs, locals)}.chop();`
      case '.:from_string':
        return `Inventory._split(${parseArgs(treeArgs, locals)});`
      case '.:to_string':
        return `${compile(treeArgs[0], locals)}.join(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:chunks':
        return `${compile(treeArgs[0], locals)}.partition(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:length':
        return `${parseArgs(treeArgs, locals)}.length;`
      case '::size':
        return `${parseArgs(treeArgs, locals)}.size;`
      case '...':
        return `Inventory._spreadArr([${treeArgs
          .map((x) => compile(x, locals))
          .join(',')}]);`
      // case '|>': {
      //   return `(${parseArgs(treeArgs, locals)});`
      // }
      case '.:quick_sort': {
        return `${compile(treeArgs[0], locals)}.quickSort(${compile(
          treeArgs[1],
          locals
        )});`
      }
      case '.:merge_sort': {
        return `${compile(treeArgs[0], locals)}.mergeSort(${compile(
          treeArgs[1],
          locals
        )});`
      }
      case '.:->::': {
        return `${compile(treeArgs[0], locals)}.group(${compile(
          treeArgs[1],
          locals
        )});`
      }
      case '::':
        return (
          'new Map([' +
          parse(treeArgs, locals).reduce((acc, item, index) => {
            if (index % 2 === 0) {
              const key = item.replace(';', '')
              acc +=
                key[0] === '"' ? `["${key.replace(/\"/g, '')}",` : `[${key},`
            } else acc += `${item}],`
            return acc
          }, '') +
          ']);'
        )
      case "'": {
        const words = treeArgs.filter(
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
        return handleBoolean(
          `${compile(treeArgs[0], locals)}.has(${compile(
            treeArgs[1],
            locals
          )});`
        )
      case '::.':
        return `${compile(treeArgs[0], locals)}.get(${compile(
          treeArgs[1],
          locals
        )});`
      case '::.=':
        return `${register[token]}(${parseArgs(treeArgs, locals)});`

      case '::->.:':
      case '::keys':
      case '::entries':
      case ':.->.:':
      case '`':
      case '.:...':
      case '::.!=':
      case '?==':
      case '!throw':
      case ':..!=':
      case ':..=':
      case ':.difference':
      case ':.intersection':
      case ':.union':
      case ':.xor':
        return `${register[token]}(${parseArgs(treeArgs, locals)});`

      case '.:add_at': {
        const [first, second, ...rest] = treeArgs.map((item) =>
          compile(item, locals)
        )
        return `${first}.addAt(${second}, ${rest});`
      }
      case '.:remove_from':
        return `${compile(treeArgs[0], locals)}.removeFrom(${compile(
          treeArgs[1],
          locals
        )}, ${compile(treeArgs[2], locals)});`

      case '.:rotate':
        return `${compile(treeArgs[0], locals)}.rotate(${compile(
          treeArgs[1],
          locals
        )}, ${compile(treeArgs[2], locals)});`
      case '.:slice':
        return `${compile(treeArgs[0], locals)}.slice(${compile(
          treeArgs[1],
          locals
        )}, ${compile(treeArgs[2], locals)});`
      case '.:flat':
        return `${compile(treeArgs[0], locals)}.flat(${compile(
          treeArgs[1],
          locals
        )});`
      case '>>':
        return `Inventory.iterate(${compile(treeArgs[0], locals)}, ${compile(
          treeArgs[1],
          locals
        )}, 1);`
      case '<<':
        return `Inventory.iterate(${compile(treeArgs[0], locals)}, ${compile(
          treeArgs[1],
          locals
        )}, -1);`
      case '*>>':
        return `Inventory.fold(${parseArgs(treeArgs, locals)}, 1);`
      case '*<<':
        return `Inventory.fold(${parseArgs(treeArgs, locals)}, -1);`
      case '.:map>>':
        return `${compile(treeArgs[0], locals)}.map(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:map<<':
        return `${compile(treeArgs[0], locals)}.mapRight(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:0|1':
        return `${compile(treeArgs[0], locals)}.toBits(${compile(
          treeArgs[1],
          locals
        )})`
      case '.:flatten':
        return `${compile(treeArgs[0], locals)}.flatten(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:filter':
        return `${compile(treeArgs[0], locals)}.filter(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:reduce>>': {
        const [array, callback, out] = parse(treeArgs, locals)
        return `${array}.reduce(${callback}, ${out});`
      }
      case '.:reduce<<': {
        const [array, callback, out] = parse(treeArgs, locals)
        return `${array}.reduceRight(${callback}, ${out});`
      }
      case '=>':
        return `${register[token]}(${parseArgs(treeArgs, locals)});`
      case ':.':
        return 'new Set([' + parseArgs(treeArgs, locals) + ']);'

      case ':..?':
        return handleBoolean(
          `${compile(treeArgs[0], locals)}.has(${compile(
            treeArgs[1],
            locals
          )});`
        )
      case ':.size':
        return `${compile(treeArgs[0], locals)}.size(${compile(
          treeArgs[1],
          locals
        )});`
      case '.:->:.':
        return `${compile(treeArgs[0], locals)}.uniform();`
      case '~*': {
        const module = compile(treeArgs.pop(), locals)
        const links = `[${parseArgs(treeArgs, locals)}]`
        const out = `Promise.all(${links}.map(f => fetch(f).then(r => r.text())))
        .then(encodes => {
          const callback = ${module}
          const signals = Inventory.from(encodes.map((encode => buildModule(decodeBase64(decodeURIComponent(encode.trim()))))))
          ;callback(signals)
        })`
        return out
      }
      case 'bit_make_bit':
        return `((${compile(treeArgs[0], locals)}>>>0).toString(2));`
      case 'bit_and':
        return `(${compile(treeArgs[0], locals)}&${compile(
          treeArgs[1],
          locals
        )});`
      case 'bit_not':
        return `~${compile(treeArgs[0], locals)};`
      case 'bit_or':
        return `(${compile(treeArgs[0], locals)}|${compile(
          treeArgs[1],
          locals
        )});`
      case 'bit_xor':
        return `(${compile(treeArgs[0], locals)}^${compile(
          treeArgs[1],
          locals
        )});`
      case 'bit_left_shift':
        return `(${compile(treeArgs[0], locals)}<<${compile(
          treeArgs[1],
          locals
        )});`
      case 'bit_right_shift':
        return `(${compile(treeArgs[0], locals)}>>${compile(
          treeArgs[1],
          locals
        )});`
      case 'bit_un_right_shift':
        return `(${compile(treeArgs[0], locals)}>>>${compile(
          treeArgs[1],
          locals
        )});`

      case 'math_lerp': {
        const [start, end, amt] = parse(treeArgs, locals)
        return `((1 - ${amt}) * ${start} + ${amt} * ${end});`
      }

      case 'math_mod': {
        const left = compile(treeArgs[0], locals)
        const right = compile(treeArgs[1], locals)
        return `(((${left} % ${right}) + ${right}) % ${right});`
      }
      case 'math_clamp':
        return `Math.min(Math.max(${compile(treeArgs[0], locals)}, ${compile(
          treeArgs[1],
          locals
        )}), ${compile(treeArgs[2], locals)});`
      case 'math_sqrt':
        return `Math.sqrt(${compile(treeArgs[0], locals)});`
      case 'math_add':
        return `(${compile(treeArgs[0], locals)}+${compile(
          treeArgs[1],
          locals
        )});`
      case 'math_sub':
        return `(${compile(treeArgs[0], locals)}-${compile(
          treeArgs[1],
          locals
        )});`
      case 'math_mult':
        return `(${compile(treeArgs[0], locals)}*${compile(
          treeArgs[1],
          locals
        )});`
      case 'math_pow':
        return `(${compile(treeArgs[0], locals)}**${compile(
          treeArgs[1],
          locals
        )});`
      case 'math_pow2':
        return `(${compile(treeArgs[0], locals)}**2);`
      case 'math_divide':
        return `(${compile(treeArgs[0], locals)}/${compile(
          treeArgs[1],
          locals
        )});`

      case 'math_random_int': {
        const min = compile(treeArgs[0], locals)
        const max = compile(treeArgs[1], locals)
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
      case 'math_hypot':
      case '>-':
        return `${register[token]}(${parseArgs(treeArgs, locals)});`
      case 'math_parse_int':
        return `${register[token]}(${compile(
          treeArgs[0],
          locals
        ).toString()}, ${compile(treeArgs[1], locals)});`
      case 'math_sum':
        return `((${compile(
          treeArgs[0],
          locals
        )}).reduce((acc, item) => (acc += item), 0));`

      case 'math_negative':
        return `-(${compile(treeArgs[0], locals)});`
      case 'text_make_regexp':
        return `new RegExp(${compile(treeArgs[0], locals)}),`
      case 'text_match':
        return `(${compile(treeArgs[0], locals)}).match(${compile(
          treeArgs[1],
          locals
        )});`
      case 'text_replace':
        return `(${compile(treeArgs[0], locals)}).replace(${compile(
          treeArgs[1],
          locals
        )});`
      case 'text_to_lower_case':
        return `(${compile(treeArgs[0], locals)}).toLowerCase();`
      case 'text_to_upper_case':
        return `(${compile(treeArgs[0], locals)}).toUpperCase();`
      case 'text_trim':
        return `(${compile(treeArgs[0], locals)}).trim();`
      case 'text_trim_start':
        return `(${compile(treeArgs[0], locals)}).trimStart();`
      case 'text_trim_end':
        return `(${compile(treeArgs[0], locals)}).trimEnd();`

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
      case 'dom_act':

      case 'dom_remove':
      case 'dom_set_text_content':
      case 'dom_set_style':
      case 'dom_set_value':
      case 'dom_add_class':
      case 'dom_ns_element':

      case 'dom_click':
      case 'dom_mouse_down':
      case 'dom_mouse_up':
      case 'dom_key_down':
      case 'dom_key_up':

      case 'time_set_timeout':
      case 'time_set_interval':
      case 'time_set_animation':

      case 'dom_set_attribute':
      case 'dom_set_attributes':
      case 'dom_get_attribute':

      case 'dom_load_bulma':
      case 'dom_load_milligram':

      case 'dom_append_to':
      case 'dom_on_change':
      case 'dom_canvas':

      case 'canvas_arc':
      case 'canvas_arc_to':
      case 'canvas_begin_path':
      case 'canvas_bezier_curve_to':
      case 'canvas_clear_rect':
      case 'canvas_clip':
      case 'canvas_close_path':
      case 'canvas_ellipse':
      case 'canvas_fill':
      case 'canvas_fill_rect':
      case 'canvas_fill_style':
      case 'canvas_get_context':
      case 'canvas_get_image_data':
      case 'canvas_get_transform':
      case 'canvas_set_transform':
      case 'canvas_reset_transform':
      case 'canvas_is_point_in_path':
      case 'canvas_is_point_in_stroke':
      case 'canvas_line_to':
      case 'canvas_line_width':
      case 'canvas_move_to':
      case 'canvas_quadratic_curve_to':
      case 'canvas_rect':
      case 'canvas_reset':
      case 'canvas_reset_trasform':
      case 'canvas_restore':
      case 'canvas_rotate':
      case 'canvas_round_rect':
      case 'canvas_save':
      case 'canvas_scale':
      case 'canvas_stroke':
      case 'canvas_stroke_style':
      case 'canvas_transform':
      case 'canvas_translate':
      case 'canvas_draw_image':
        return `${register[token]}(${parseArgs(treeArgs, locals)});`

      case 'units_pixels':
      case 'units_percent':
      case 'units_viewport_height':
      case 'units_viewport_width':
      case 'units_centimeters':
      case 'units_millimeters':
      case 'units_inches':
      case 'units_points':
      case 'units_picas':
        return `"${compile(treeArgs[0], locals)}${units[token]}"`

      case 'dom_insert': {
        const [container, ...rest] = treeArgs
        return `${register[token]}(${compile(container, locals)}, ${parseArgs(
          rest,
          locals
        )});`
      }
      case 'console_log': {
        const arg = compile(treeArgs[0], locals)
        return `(console.log(${arg}), ${arg})`
      }
      // dead code
      case 'aliases=':
      case 'void:':
      case '|>':
        return ''
      case 'void':
        return VOID
      default:
        undefined: {
          if (!(token in tokens)) {
            if (token) return `${token}(${parseArgs(treeArgs, locals)});`
            else {
              return `(${compile(tree.operator, locals)})(${parseArgs(
                treeArgs,
                locals
              )});`
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

export const compileToJs = (AST: Expression) => {
  const vars = new Set<string>()
  const raw = compile(AST, vars)
  let program = ''
  for (let i = 0; i < raw.length; ++i) {
    const current = raw[i]
    const next = raw[i + 1]
    if (!semiColumnEdgeCases.has(current + next)) program += current
  }
  const top = `var log = (msg) => { console.log(msg); return msg }; ${
    vars.size ? `var ${[...vars].join(',')};` : ''
  }`
  return { top, program }
}
