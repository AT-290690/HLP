import { removeNoCode, wrapInBody } from './helpers.js'
import { parse } from '../core/parser.js'
import { LZUTF8 } from './lz-utf8.js'
import { STD } from '../extensions/extentions.js'
import { tokens } from '../core/tokens.js'
import { runFromInterpreted } from './utils.js'

const LIBRARY = STD.LIBRARY
LIBRARY.HTTP.signal = (url, callback) =>
  fetch(url)
    .then((raw) => raw.text())
    .then((source) =>
      callback(
        runFromInterpreted(decodeBase64(decodeURIComponent(source.trim())))
      )
    )
LIBRARY.HTTP.signals = (urls, callback) =>
  Promise.all(urls.map((url) => fetch(url).then((raw) => raw.text()))).then(
    (sources) =>
      callback(
        new Map(
          Object.entries(
            sources.map((source) =>
              runFromInterpreted(
                decodeBase64(decodeURIComponent(source.trim()))
              )
            )
          )
        )
      )
  )

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

const generateCompressionRunes = (start) => {
  return Object.keys(tokens)
    .map((t) => `${t}[`)
    .concat(['][', '];', ']];'])
    .map((t, i) => ({ full: t, short: String.fromCharCode(start + i + 191) }))
}
export const generateCompressedModules = () => {
  const { NAME, ...lib } = LIBRARY
  const modules = new Set([NAME])
  const dfs = (lib, modules) => {
    for (const module in lib) {
      if (module.length > 1) modules.add(module)
      for (const m in lib[module]) {
        if (lib[module][m].NAME) dfs(lib[module][m], modules)
        if (m !== 'NAME' && m.length > 1) modules.add(m)
      }
    }
  }
  dfs(lib, modules)
  return [...modules].map((full, i) => {
    const short = String.fromCharCode(i + 191)
    return { full, short }
  })
}

export const shortModules = generateCompressedModules()
export const shortRunes = generateCompressionRunes(shortModules.length)
const dfs = (
  tree,
  definitions = new Set(),
  imports = new Set()
  // excludes = new Set()
) => {
  for (const node of tree) {
    const { type, operator, args, name } = node
    if (type === 'import') imports.add(name)
    else if (
      type === 'word' &&
      node.name.length > 1 &&
      node.name[0] !== '_' &&
      !imports.has(node.name)
    )
      definitions.add(node.name)
    else if (type === 'apply' && operator.type === 'word')
      args.forEach(({ name }) => {
        if (name && name.length > 2 && name[0] !== '_') {
          definitions.add(name)
        }
      })
    if (Array.isArray(args)) dfs(args, definitions, imports)
    if (Array.isArray(operator?.args)) dfs(operator.args, definitions, imports)
  }
  return { definitions, imports }
}
export const compress = (source) => {
  const raw = removeNoCode(source).split('];]').join(']]')
  const strings = raw.match(/"([^"]*)"/g) || []
  const value = raw.replaceAll(/"([^"]*)"/g, '" "')
  const AST = parse(wrapInBody(value))
  const { definitions, imports } = dfs(
    AST.args,
    new Set(),
    new Set(['LIBRARY'])
  )
  // imports.forEach(value => {
  //   if (definitions.has(value)) definitions.delete(value)
  // })

  const importedModules = shortModules.reduce((acc, item) => {
    if (imports.has(item.full)) acc.push(item)
    return acc
  }, [])

  const defs = [...definitions]
  let { result, occurance } = value.split('').reduce(
    (acc, item) => {
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

  for (const { full, short } of importedModules)
    result = result.replaceAll(new RegExp(`\\b${full}\\b`, 'g'), short)

  let index = 0
  let count = 0
  const shortDefinitions = defs.map((full) => {
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

  result = result.split('" "')
  strings.forEach((str, i) => (result[i] += str))

  return result.join('')
}
export const decompress = (raw) => {
  const strings = raw.match(/"([^"]*)"/g) || []
  const value = raw.replaceAll(/"([^"]*)"/g, '" "')
  const suffix = [...new Set(value.match(/\'+?\d+/g))]
  let result = suffix.reduce(
    (acc, m) => acc.split(m).join(']'.repeat(parseInt(m.substring(1)))),
    value
  )
  for (const { full, short } of shortModules)
    result = result.replaceAll(new RegExp(short, 'g'), full)

  for (const { full, short } of shortRunes)
    result = result.replaceAll(short, full)

  result = result.split('" "')
  strings.forEach((str, i) => (result[i] += str))

  return result.join('')
}
export const encodeBase64 = (source) =>
  LZUTF8.compress(compress(source).trim(), { outputEncoding: 'Base64' })

export const decodeBase64 = (source) =>
  decompress(
    LZUTF8.decompress(source.trim(), {
      inputEncoding: 'Base64',
      outputEncoding: 'String',
    })
  )
