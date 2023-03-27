import { decodeBase64 } from './dist/misc/compression.js'
import { compileToJs } from './dist/core/compiler.js'
import { runFromInterpreted } from './dist/misc/utils.js'
import { wrapInBody } from './dist/misc/helpers.js'
import { parse } from './dist/core/parser.js'
import Inventory from './dist/extensions/Inventory.js'

const buildModule = (encoding) => {
  const inlined = wrapInBody(encoding)
  const { top, program } = compileToJs(parse(inlined))
  return { top, program }
}
const buildScript = (encoding) => {
  const { top, program } = buildModule(encoding)
  return `
;(() => {
  ${top}
  ${program}
  })()`
}
window.runFromInterpreted = runFromInterpreted
window.decodeBase64 = decodeBase64
window.Inventory = Inventory
const appendScript = (encoding) => {
  const script = document.createElement('script')
  if (encoding) script.innerHTML += `{ ${buildScript(encoding)} }`
  document.body.appendChild(script)
}
window.buildModule = (str) => {
  const { top, program } = buildModule(str)
  return new Function(`
    ${top}
    return ${program}
  `)()
}
appendScript(
  decodeBase64(
    decodeURIComponent(new URLSearchParams(location.search).get('l') ?? '')
  )
)
