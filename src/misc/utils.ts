import { compileToJs } from '../core/compiler.js'
import { parse } from '../core/parser.js'
import { runFromAST } from '../core/interpreter.js'
import { tokens } from '../core/tokeniser.js'
import { protolessModule, removeNoCode, wrapInBody } from './helpers.js'
import Inventory from '../extensions/Inventory.js'
export const logBoldMessage = (msg: string) => console.log('\x1b[1m', msg)
export const logErrorMessage = (msg: string) =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
export const logSuccessMessage = (msg: string) =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
export const logWarningMessage = (msg: string) =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')
export const runFromInterpreted = (source: string, env?: object) =>
  exe(handleUnbalancedParens(removeNoCode(source.toString().trim())), env)
export const runFromCompiled = (source: string) => eval(compileModule(source))
export const exe = (source: string, env = {}) => {
  const ENV = protolessModule(env)
  ENV[';;runes'] = protolessModule(tokens)
  const AST = parse(wrapInBody(source))
  return runFromAST(AST, ENV).result
}
export const isBalancedParenthesis = (sourceCode: string) => {
  let count = 0
  const stack = []
  const str = sourceCode.replace(/"(.*?)"/g, '')
  const pairs = { ']': '[' }
  for (let i = 0; i < str.length; ++i)
    if (str[i] === '[') stack.push(str[i])
    else if (str[i] in pairs) if (stack.pop() !== pairs[str[i]]) ++count
  return { str, diff: count - stack.length }
}
export const handleUnbalancedParens = (sourceCode: string) => {
  const parenMatcher = isBalancedParenthesis(sourceCode)
  if (parenMatcher.diff !== 0)
    throw new SyntaxError(
      `Parenthesis are unbalanced by ${parenMatcher.diff > 0 ? '+' : ''}${
        parenMatcher.diff
      } "]"`
    )
  return sourceCode
}
export const compilePlain = (source: string) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `${top}
${program}`
}
export const compileModule = (source: string) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `${Inventory.toString()}
${top}${program}`
}
export const compilePlainJs = (source: string) => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `${top}${program}`
}
export const compileHtml = (source: string, scripts = '') => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `
<style>body { background: #0e0e0e } </style><body>
${scripts}
<script>
${Inventory.toString()}
</script>
<script> (() => { ${top}${program} })()</script>
</body>`
}
export const compileHtmlModule = (source: string, scripts = '') => {
  const inlined = wrapInBody(removeNoCode(source))
  const { top, program } = compileToJs(parse(inlined))
  return `
<style>body { background: #0e0e0e } </style><body>
${scripts}
<script type="module">
  import Inventory from '../../chip/language/extensions/Inventory.js'; 
  (() => { ${top}${program} })()
 </script>
</body>`
}
export const compileExecutable = (source: string) => {
  const inlined = wrapInBody(removeNoCode(source))
  const ENV = protolessModule({})
  ENV[';;runes'] = protolessModule(tokens)
  const AST = parse(inlined)
  // const { AST } = cell(ENV, false)(inlined)
  const { top, program } = compileToJs(AST)
  return `${Inventory.toString()}
  ${top}${program}`
}
