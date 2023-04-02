import { parse } from '../core/parser.js'
import { LZUTF8 } from '../../lib/lz-utf8.js'
import { tokens } from '../core/tokeniser.js'
import { evaluate } from '../core/interpreter.js'
import Inventory from '../extensions/Inventory.js'
import { runFromInterpreted, removeNoCode, wrapInBody } from '../misc/utils.js'
import { Expression, Word } from '../core'
const ABC = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]
tokens['~*'] = (args, env) => {
  if (!args.length) throw new RangeError('Invalid number of arguments to ~* []')
  const callback = evaluate(args.pop(), env)
  if (typeof callback !== 'function')
    throw new TypeError('Second argument of ~* must be an -> []')
  Promise.all(
    args.map((arg) => fetch(evaluate(arg, env)).then((r) => r.text()))
  ).then((encodes) => {
    const signals = Inventory.from(
      encodes.map((encode) =>
        runFromInterpreted(decodeBase64(decodeURIComponent(encode.trim())))
      )
    )
    callback(signals)
  })
  return 0
}
const OFFSET = 161
const generateCompressionRunes = (start) => {
  return Object.keys(tokens)
    .map((t) => `${t}[`)
    .sort((a, b) => (a.length > b.length ? -1 : 1))
    .concat(['][', ']];', '];'])
    .map((t, i) => ({
      full: t,
      short: String.fromCharCode(start + i + OFFSET),
    }))
}
export const shortRunes = generateCompressionRunes(0)

const dfs = (tree: Expression[], definitions = new Set()) => {
  for (const node of tree) {
    if (node.type !== 'value') {
      if (node.type === 'word' && node.name.length > 1) {
        definitions.add(node.name)
      } else if (node.type === 'apply') {
        if (node.operator.type === 'word') {
          node.args
            .filter((expr): expr is Word => expr.type === 'word')
            .forEach(({ name }) => {
              if (name && name.length > 2 && name[0] !== '_') {
                definitions.add(name)
              }
            })
        } else dfs(node.operator.args, definitions)
      }
      dfs(node.args, definitions)
    }
  }
  return definitions
}
interface Compression {
  result: string
  occurance: number
}
export const compress = (source: string) => {
  const raw: string = removeNoCode(source).split('];]').join(']]')
  const strings = raw.match(/"([^"]*)"/g) || []
  const value = raw.replaceAll(/"([^"]*)"/g, '" "')
  const AST = parse(wrapInBody(value))
  const definitions = AST.type === 'apply' ? [...dfs(AST.args, new Set())] : []
  let { result, occurance } = value.split('').reduce(
    (acc: Compression, item: string) => {
      if (item === ']') acc.occurance++
      else {
        if (acc.occurance < 3) {
          acc.result += ']'.repeat(acc.occurance)
          acc.occurance = 0
        } else {
          acc.result += "'" + acc.occurance
          acc.occurance = 0
        }
        acc.result += item
      }
      return acc
    },
    { result: '', occurance: 0 }
  )
  if (occurance > 0) result += "'" + occurance
  let index = 0
  let count = 0
  const shortDefinitions = definitions.map((full) => {
    const short = ABC[index] + count
    ++index
    if (index === ABC.length) {
      index = 0
      ++count
    }
    return { full, short }
  })
  for (const { full, short } of shortDefinitions)
    result = result.replaceAll(new RegExp(`\\b${full}\\b`, 'g'), short)

  for (const { full, short } of shortRunes)
    result = result.replaceAll(full, short)

  const arr = result.split('" "')
  strings.forEach((str, i) => (arr[i] += str))

  return arr.join('')
}
export const decompress = (raw: string) => {
  const strings = raw.match(/"([^"]*)"/g) || []
  const value = raw.replaceAll(/"([^"]*)"/g, '" "')
  const suffix = [...new Set(value.match(/\'+?\d+/g))]
  let result = suffix.reduce(
    (acc, m) => acc.split(m).join(']'.repeat(parseInt(m.substring(1)))),
    value
  )

  for (const { full, short } of shortRunes)
    result = result.replaceAll(short, full)

  const arr = result.split('" "')
  strings.forEach((str, i) => (arr[i] += str))

  return arr.join('')
}
export const encodeBase64 = (source: string) =>
  LZUTF8.compress(compress(source).trim(), { outputEncoding: 'Base64' })
export const decodeBase64 = (source: string) =>
  decompress(
    LZUTF8.decompress(source.trim(), {
      inputEncoding: 'Base64',
      outputEncoding: 'String',
    })
  )
