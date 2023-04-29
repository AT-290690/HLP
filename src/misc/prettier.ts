import { Expression } from '../core'
import { parse } from '../core/parser.js'
import { extractComments, removeNoCode, wrapInBody } from './utils.js'

const format = (tree: Expression[], level = 0, out = '') => {
  level++
  for (const node of tree) {
    if (node.type === 'value' && node.class !== 'void')
      out += (node.class === 'string' ? `"${node.value}"` : node.value) + '; '
    else if (node.type === 'word') out += node.name + '; '
    else if (node.type === 'apply') {
      if (node.operator.type === 'word') {
        out += '\n' + '\t'.repeat(level)
        if (
          node.operator.name == undefined &&
          node.operator.args[0].type === 'word'
        )
          out += node.operator.args[0].name + ' ['
        else out += node.operator.name + ' [' + format(node.args, level) + ']; '
      } else if (node.operator.type === 'apply') {
        if (node.operator.operator.type === 'word') {
          out +=
            node.operator.operator.name +
            ' [' +
            format(node.operator.args, level) +
            ']' +
            ' [' +
            format(node.args, level) +
            ']; '
        }
      } else out += format(node.args, level) + ']; '
    }
  }
  return out.replaceAll(';]', ']').trim()
}

export const pretty = (raw: string) => {
  const { source, match } = extractComments(raw)
  const expr = parse(wrapInBody(removeNoCode(source.toString().trim())))
  if (expr.type === 'apply') {
    const formatted = format(expr.args)
    return match != undefined
      ? formatted.split('void: ["#comment"];').reduce((acc, x, i) => {
          acc += x + (match[i] ?? '')
          return acc
        }, '')
      : formatted
  } else return source
}
